import { useCallback, useRef, useState } from 'react';
import { CheckoutSection } from './components/CheckoutSection';
import { FindUsSection } from './components/FindUsSection';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { MenuScene } from './components/MenuScene';
import { OrderTray } from './components/OrderTray';
import { Preloader } from './components/Preloader';
import { SceneOverlays, WaterBackdrop } from './components/SceneOverlays';
import { SidesSection } from './components/SidesSection';
import { SiteNav } from './components/SiteNav';
import { useMediaFlags } from './hooks/media/useMediaFlags';
import { OrderMotionBridge } from './order/OrderMotionBridge';
import { OrderProvider } from './order/OrderProvider';
import { SceneNodesProvider, useSceneNodesValue } from './scene/sceneNodes';
import { useSceneMotion, type SceneMotionConfig } from './hooks/scene/useSceneMotion';

const TRUTHY = new Set(['', '1', 'true', 'on', 'yes']);
const FALSY = new Set(['0', 'false', 'off', 'no']);

function readFlag(params: URLSearchParams, name: string, fallback: boolean): boolean {
  const raw = params.get(name);
  if (raw === null) return fallback;
  const value = raw.trim().toLowerCase();
  if (TRUTHY.has(value)) return true;
  if (FALSY.has(value)) return false;
  return fallback;
}

function readConfig(): SceneMotionConfig {
  const params = new URLSearchParams(window.location.search);
  const parallax = Number.parseFloat(params.get('parallaxStrength') ?? '');
  return {
    markers: readFlag(params, 'markers', false),
    skipPreloader: readFlag(params, 'skipPreloader', false),
    parallaxStrength: Number.isFinite(parallax) ? parallax : 1,
    bubbleCursor: readFlag(params, 'bubbleCursor', true),
  };
}

const SCENE_CONFIG: SceneMotionConfig = import.meta.env.DEV ? readConfig() : {};

export default function App() {
  return (
    <OrderProvider>
      <KrustyKrabPage />
    </OrderProvider>
  );
}

function KrustyKrabPage() {
  const { isMobile, reducedMotion } = useMediaFlags();
  const sceneNodes = useSceneNodesValue();
  const [preloaderMounted, setPreloaderMounted] = useState(true);
  const hasOpenOrderRef = useRef(false);
  const repaintReceiptRef = useRef<() => void>(() => {});

  useSceneMotion({
    registryRef: sceneNodes.registryRef,
    hasOpenOrderRef,
    repaintReceiptRef,
    reducedMotion,
    onPreloaderHidden: useCallback(() => setPreloaderMounted(false), []),
    config: SCENE_CONFIG,
  });

  return (
    <SceneNodesProvider value={sceneNodes}>
      <WaterBackdrop isMobile={isMobile} />
      {preloaderMounted && <Preloader isMobile={isMobile} />}
      <SceneOverlays />

      <SiteNav />

      <main>
        <Hero />
        <Marquee />
        <MenuScene />
        <SidesSection tiltEnabled={!isMobile && !reducedMotion} />
        <CheckoutSection />
        <FindUsSection isMobile={isMobile} />
      </main>

      <OrderMotionBridge
        hasOpenOrderRef={hasOpenOrderRef}
        repaintReceiptRef={repaintReceiptRef}
      />
      <OrderTray />
    </SceneNodesProvider>
  );
}
