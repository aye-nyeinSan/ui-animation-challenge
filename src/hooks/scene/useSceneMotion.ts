import { useGSAP } from '@gsap/react';
import { useEffect, useRef } from 'react';
import { BURGER_ASPECT, MOTION } from '../../motion';
import { EASE, gsap, ScrollTrigger } from '../../scene/gsapSetup';
import { cardOffset, computeAdPose, computeMenuRun, computePlatePose, menuLead } from '../../scene/layout';
import type { SceneNodeName, SceneRegistry } from '../../scene/sceneNodes';
import type { RefObject } from 'react';

export interface SceneMotionConfig {
  readonly markers?: boolean;
  readonly skipPreloader?: boolean;
  readonly parallaxStrength?: number;
  readonly bubbleCursor?: boolean;
}

export interface SceneMotionOptions {
  readonly registryRef: RefObject<SceneRegistry>;
  readonly hasOpenOrderRef: RefObject<boolean>;
  readonly repaintReceiptRef: RefObject<() => void>;
  readonly reducedMotion: boolean;
  readonly onPreloaderHidden: () => void;
  readonly config?: SceneMotionConfig;
}

const MOBILE_QUERY = '(max-width: 767px)';
const DESKTOP_QUERY = '(min-width: 768px)';
const ms = (milliseconds: number) => milliseconds / 1000;

function hashRandom(seed: number) {
  return (k: number) => {
    const x = Math.sin(seed * 12.9898 + k * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
}

export function useSceneMotion({
  registryRef,
  hasOpenOrderRef,
  repaintReceiptRef,
  reducedMotion,
  onPreloaderHidden,
  config,
}: SceneMotionOptions): void {
  const onHiddenRef = useRef(onPreloaderHidden);
  const configRef = useRef(config);

  useEffect(() => {
    onHiddenRef.current = onPreloaderHidden;
    configRef.current = config;
  }, [onPreloaderHidden, config]);

  useGSAP(
    () => {
      const nodes = registryRef.current;
      const get = (name: SceneNodeName) => nodes[name];
      const at = (prefix: string, i: number) => nodes[`${prefix}${i}` as SceneNodeName];
      const list = (prefix: string, count: number) =>
        Array.from({ length: count }, (_, i) => at(prefix, i)).filter(
          (node): node is HTMLElement => Boolean(node),
        );

      const LAYER = { moving: 'transform', fading: 'transform, opacity', printing: 'clip-path, transform' };
      const layerHint = (nodes: (HTMLElement | undefined)[], value: string) => {
        const targets = nodes.filter(Boolean) as HTMLElement[];
        if (targets.length) gsap.set(targets, { willChange: value });
      };
      const preexisting = new Set(ScrollTrigger.getAll());
      let disposed = false;
      let cueReady = false;
      const skipPreloader = configRef.current?.skipPreloader ?? false;
      ScrollTrigger.defaults({ markers: configRef.current?.markers ?? false });
      const parallaxStrength = configRef.current?.parallaxStrength ?? 1;
      const bubbleCursorEnabled = configRef.current?.bubbleCursor ?? true;

      const layout = {
        viewport: { width: window.innerWidth, height: window.innerHeight },
        plate: { x: 0, y: 0, width: 1 },
        ad: { x: 0, y: 0, width: 240, scale: 1 },
        trackOverflow: 0,
        menuTop: 0,
        menuRun: 1,
        cardCentres: [] as number[],
        landWidth: 0,
        disc: { x: 0, y: 0 },
        register: { docTop: 0, docLeft: 0, width: 0, height: 0 },
        tray: { cx: 0, cy: 0, width: 0, height: 0 },
      };

      function measureTray() {
        const tray = get('trayWrap');
        if (!tray) return;
        gsap.set(tray, { x: 0, y: 0, scale: 1 });
        const rect = tray.getBoundingClientRect();
        layout.tray = {
          cx: rect.left + rect.width / 2,
          cy: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height,
        };
      }

      function measure() {
        const scroller = ScrollTrigger.getScrollFunc(window) as { rec?: number };
        if (typeof scroller.rec === 'number') scroller.rec = window.scrollY;

        const isMobile = window.matchMedia(MOBILE_QUERY).matches;
        layout.viewport = { width: window.innerWidth, height: window.innerHeight };
        const bg = get('heroBg') as HTMLImageElement | undefined;
        layout.plate = computePlatePose(layout.viewport, {
          width: bg?.naturalWidth || 1199,
          height: bg?.naturalHeight || 673,
        });
        layout.ad = computeAdPose(layout.viewport, layout.plate.width);
        const burgerWrap = get('burgerWrap');
        if (burgerWrap) {
          gsap.set(burgerWrap, {
            left: layout.plate.x,
            top: layout.plate.y,
            width: layout.plate.width,
          });
        }

        const track = get('track');
        const menu = get('menu');
        if (track && menu) {
          layout.trackOverflow = Math.max(0, track.scrollWidth - layout.viewport.width);
          layout.menuRun = computeMenuRun(layout.trackOverflow, isMobile);
          menu.style.height = `${layout.viewport.height + layout.menuRun}px`;
          layout.menuTop = menu.getBoundingClientRect().top + window.scrollY;
          layout.cardCentres = Array.from({ length: 9 }, (_, i) => {
            const card = at('mw', i);
            return card ? card.offsetLeft + card.offsetWidth / 2 : 0;
          });
        }

        const disc = get('disc0');
        if (disc && track) {
          const trackRect = track.getBoundingClientRect();
          const discRect = disc.getBoundingClientRect();
          const shift = new DOMMatrix(getComputedStyle(track).transform).m41;
          layout.landWidth = discRect.width * 0.96;
          layout.disc = {
            x: discRect.left - trackRect.left - shift + discRect.width / 2,
            y:
              layout.viewport.height / 2 -
              trackRect.height / 2 +
              (discRect.top - trackRect.top) +
              discRect.height / 2,
          };
        }

        const registerCard = get('registerCard');
        if (registerCard) {
          const rect = registerCard.getBoundingClientRect();
          layout.register = {
            docTop: rect.top + window.scrollY,
            docLeft: rect.left,
            width: rect.width,
            height: rect.height,
          };
        }

        measureTray();
        const flyer = get('flyer');
        if (flyer) {
          gsap.set(flyer, {
            width: layout.ad.width,
            height: (layout.ad.width * BURGER_ASPECT.h) / BURGER_ASPECT.w,
          });
        }
      }

      const onAnchorClick = (event: MouseEvent) => {
        const link = (event.target as HTMLElement).closest?.('a[href^="#"]');
        const id = link?.getAttribute('href')?.slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        event.preventDefault();
        gsap.to(window, {
          duration: reducedMotion ? 0 : 1.1,
          ease: EASE.scrub,
          scrollTo: { y: target, autoKill: true },
        });
      };
      document.addEventListener('click', onAnchorClick);
      ScrollTrigger.addEventListener('refreshInit', measure);
      measure();
      const bgImage = get('heroBg') as HTMLImageElement | undefined;
      if (bgImage && !bgImage.complete) {
        bgImage.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
      }

      function firePuff(target?: HTMLElement) {
        const host = get('puff');
        const anchor = target ?? get('disc0');
        if (!host || !anchor || reducedMotion) return;
        const rect = anchor.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const count = 14;
        host.replaceChildren();
        const bubbles = Array.from({ length: count }, (_, i) => {
          const size = 10 + ((i * 5) % 18);
          const bubble = document.createElement('div');
          bubble.style.cssText =
            `position:absolute;left:${cx - size / 2}px;top:${cy - size / 2}px;` +
            `width:${size}px;height:${size}px;border-radius:50%;` +
            'border:3px solid rgba(255,246,229,.9);background:rgba(255,246,229,.18)';
          host.appendChild(bubble);
          return bubble;
        });
        const angle = (i: number) => (i / count) * Math.PI * 2 + (i % 2) * 0.2;
        const distance = (i: number) => rect.width * (0.7 + (i % 3) * 0.25);

        gsap
          .timeline({ onComplete: () => host.replaceChildren() })
          .fromTo(
            bubbles,
            { x: 0, y: 0, scale: 0.2, opacity: 0 },
            {
              x: (i: number) => Math.cos(angle(i)) * distance(i),
              y: (i: number) => Math.sin(angle(i)) * distance(i) - 30,
              scale: 1,
              duration: 0.9,
              ease: EASE.settle,
              stagger: 0.04,
            },
            0,
          )
          .to(bubbles, { opacity: 1, duration: 0.12, stagger: 0.04 }, 0)
          .to(bubbles, { opacity: 0, duration: 0.7, stagger: 0.04 }, 0.15);
      }

      function dive(duration: number) {
        const host = get('diveStreaks');
        const wrap = get('dive');
        const surface = get('diveSurface');
        if (!host || !wrap || reducedMotion) return;
        host.replaceChildren();
        const isMobile = window.matchMedia(MOBILE_QUERY).matches;
        const streaks = Array.from({ length: isMobile ? 14 : 26 }, (_, i) => {
          const rand = hashRandom(i);
          const size = 8 + rand(1) * 30;
          const streak = document.createElement('div');
          streak.style.cssText =
            `position:absolute;left:${(2 + rand(2) * 96).toFixed(1)}%;bottom:-12vh;` +
            `width:${size.toFixed(0)}px;height:${size.toFixed(0)}px;border-radius:50%;` +
            'border:3px solid rgba(255,246,229,.9);background:rgba(255,246,229,.14)';
          host.appendChild(streak);
          return streak;
        });

        if (surface) {
          gsap.fromTo(
            surface,
            { y: 0, opacity: 0.5 },
            { y: '-62vh', opacity: 0, duration: duration * 0.75, ease: 'power1.inOut' },
          );
        }

        gsap
          .timeline({ onComplete: () => host.replaceChildren() })
          .fromTo(
            streaks,
            { y: '18vh', scaleY: 1, opacity: 0 },
            {
              y: '-125vh',
              scaleY: 1.5,
              duration,
              ease: 'power1.in',
              stagger: { amount: duration * 0.3, from: 'random' },
            },
            0,
          )
          .to(streaks, { opacity: 1, duration: duration * 0.12 }, 0)
          .to(streaks, { opacity: 0, duration: duration * 0.6 }, duration * 0.4);

        gsap
          .timeline()
          .to(wrap, { opacity: 1, duration: 0.25 })
          .to(wrap, { opacity: 0, duration: 0.5 }, duration * 0.62);
      }

      function enterHero(instant: boolean) {
        const hero = MOTION.hero;
        const isMobile = window.matchMedia(MOBILE_QUERY).matches;
        const factor = isMobile ? MOTION.mobileFactor : 1;
        const entering = [
          get('burgerEnter'),
          get('sub'),
          ...list('line', 3),
          ...list('ie', 5),
        ];
        const tl = gsap.timeline({
          onStart: () => layerHint(entering, LAYER.fading),
          onComplete: () => layerHint(entering, 'auto'),
        });

        tl.to(
          list('line', 3),
          {
            yPercent: 0,
            '--line-clip': '0%',
            duration: ms(hero.lineDur),
            ease: EASE.pop,
            stagger: ms(hero.lineStagger) * factor,
          },
          0,
        )
          .to(
            get('sub') ?? [],
            { y: 0, opacity: 1, duration: ms(hero.lineDur), ease: EASE.settle },
            ms(3 * hero.lineStagger * factor + hero.subDelay),
          )
          .to(
            get('burgerEnter') ?? [],
            { scale: 1, y: 0, opacity: 1, duration: ms(hero.burgerDur), ease: EASE.pop },
            ms(hero.burgerDelay),
          )
          .to(
            list('ie', 5),
            {
              scale: 1,
              opacity: 1,
              duration: ms(hero.ingDur),
              ease: EASE.pop,
              stagger: ms(hero.ingStagger) * factor,
            },
            ms(hero.ingDelay),
          )
          .to(get('cue') ?? [], { opacity: 1, duration: 0.5 }, '>-0.2')
          .call(() => {
            cueReady = true;
          });

        if (instant) tl.progress(1);
      }

      function hidePreloader(instant: boolean) {
        const pre = get('pre');
        if (pre) pre.style.display = 'none';
        onHiddenRef.current();
        enterHero(instant);
      }

      const MAX_ASSET_WAIT = 8;

      function waitForEagerImages(): Promise<void> {
        const pending = Array.from(
          document.querySelectorAll<HTMLImageElement>('img:not([loading="lazy"])'),
        ).filter((img) => !img.complete);
        if (!pending.length) return Promise.resolve();

        return Promise.race([
          Promise.all(
            pending.map(
              (img) =>
                new Promise<void>((resolve) => {
                  img.addEventListener('load', () => resolve(), { once: true });
                  img.addEventListener('error', () => resolve(), { once: true });
                }),
            ),
          ).then(() => undefined),
          new Promise<void>((resolve) => {
            gsap.delayedCall(MAX_ASSET_WAIT, resolve);
          }),
        ]);
      }

      function startPreloader() {
        const p = MOTION.preloader;
        const counter = get('preCounter');
        const bar = get('preBar');
        const progress = { value: 0 };
        const paint = () => {
          if (counter) counter.textContent = `${Math.round(progress.value)}%`;
          if (bar) gsap.set(bar, { scaleX: progress.value / 100 });
        };
        const assetsReady = waitForEagerImages();

        gsap
          .timeline()

          .to(progress, { value: 90, duration: ms(p.duration), ease: 'power2.out', onUpdate: paint })
          .call(() => {
            void assetsReady.then(() => {
              if (disposed) return;
              gsap
                .timeline()
                .to(progress, { value: 100, duration: 0.35, ease: 'power1.out', onUpdate: paint })
                .call(() => dive(1.5), undefined, `+=${ms(p.hold)}`)
                .to(get('preContent') ?? [], { opacity: 0, duration: ms(p.fade) })
                .to(
                  [get('preHalfTop'), get('preHalfBot')].filter(Boolean) as HTMLElement[],
                  {
                    yPercent: (i: number) => (i === 0 ? -100 : 100),
                    duration: ms(p.part),
                    ease: EASE.settle,
                  },
                )
                .call(() => hidePreloader(false));
            });
          });
      }

      if (reducedMotion) {
        gsap.set([get('sub'), get('beatB'), get('cue'), get('sidesHead'), get('checkoutHead')].filter(Boolean) as HTMLElement[], { opacity: 1, y: 0, x: 0 });
        gsap.set(list('ie', 5), { opacity: 1, scale: 1 });
        gsap.set(get('burgerEnter') ?? [], { opacity: 1, scale: 1, y: 0 });
        gsap.set(list('line', 3), { yPercent: 0, '--line-clip': '0%' });
        gsap.set(list('ow', 5), { opacity: 1, y: 0, rotate: 0 });
        gsap.set([get('findHead'), get('findCard'), get('registerCard')].filter(Boolean) as HTMLElement[], { opacity: 1, y: 0 });
        gsap.set(get('findCard') ?? [], { xPercent: -50, yPercent: -50 });
        gsap.set(get('registerPaper') ?? [], { '--print': '0%', y: 0 });
        gsap.set(get('classicImg') ?? [], { opacity: 1 });
        hidePreloader(true);
        return;
      }

      gsap.set(get('findCard') ?? [], { xPercent: -50, yPercent: -50 });
      if (skipPreloader) hidePreloader(true);
      else startPreloader();
      const scene = MOTION.scene;
      const heroSection = get('hero');

      if (heroSection) {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            id: 'hero',
            trigger: heroSection,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
            onToggle: (self) =>
              layerHint(
                [
                  get('heroBgParallax'),
                  get('heroBg'),
                  get('burst'),
                  get('beatA'),
                  get('beatB'),
                  get('burgerScale'),
                ],
                self.isActive ? LAYER.fading : 'auto',
              ),
          },
        });
        const bg = get('heroBg');
        if (bg) tl.to(bg, { scale: 1 + scene.bgZoom, yPercent: scene.bgDrift, duration: 1 }, 0);
        const beatA = get('beatA');
        if (beatA) {
          tl.to(
            beatA,
            { opacity: 0, y: -60, duration: scene.aOut[1] - scene.aOut[0], ease: EASE.scrub },
            scene.aOut[0],
          );
        }

        const burst = get('burst');
        if (burst) {
          tl.to(
            burst,
            { opacity: 1, duration: scene.burstIn[1] - scene.burstIn[0], ease: EASE.scrub },
            scene.burstIn[0],
          );
        }

        const beatB = get('beatB');
        if (beatB) {
          tl.fromTo(
            beatB,
            { opacity: 0, y: 70 },
            { opacity: 1, y: 0, duration: scene.bIn[1] - scene.bIn[0], ease: EASE.scrub },
            scene.bIn[0],
          );
        }

        const burgerScale = get('burgerScale');
        if (burgerScale) {
          tl.to(
            burgerScale,
            {
              x: () => layout.ad.x - layout.plate.x,
              y: () => layout.ad.y - layout.plate.y,
              scale: () => layout.ad.scale,
              rotate: -scene.liftRot,
              duration: scene.lift[1] - scene.lift[0],
              ease: EASE.scrub,
            },
            scene.lift[0],
          );
        }
      }

      const cue = get('cue');
      if (heroSection && cue) {
        ScrollTrigger.create({
          id: 'scroll-cue',
          trigger: heroSection,
          start: 'top top',
          end: '+=220',
          scrub: true,
          onUpdate: (self) => {
            if (cueReady) gsap.set(cue, { opacity: 1 - self.progress });
          },
        });
      }

      const menuSection = get('menu');
      const hint = get('hint');
      if (menuSection && hint) {
        ScrollTrigger.create({
          id: 'menu-hint',
          trigger: menuSection,
          start: 'top top',
          end: 'bottom bottom',
          onToggle: (self) => gsap.to(hint, { opacity: self.isActive ? 1 : 0, duration: 0.45 }),
        });
      }

      const registerCard = get('registerCard');
      const trayWrap = get('trayWrap');
      if (registerCard && trayWrap) {
        let lastProgress = 0;
        const setTray = gsap.quickSetter(trayWrap, 'css') as (v: object) => void;
        const setPaper = get('registerPaper')
          ? (gsap.quickSetter(get('registerPaper') as HTMLElement, 'css') as (v: object) => void)
          : null;

        const paintReceipt = (progress: number) => {
          lastProgress = progress;
          const vh = layout.viewport.height;
          const measurable = layout.register.height > 0 && vh > 0;
          // Trigger spans card-top-at-viewport-bottom → card-centre-at-viewport-centre, so the
          // card's position follows from progress (window.scrollY is 0 mid-refresh).
          const cardTop = vh - (progress * (vh + layout.register.height)) / 2;

          if (!hasOpenOrderRef.current || !measurable) {
            setTray({
              x: 0,
              y: 0,
              scale: 1,
              opacity: 1,
              visibility: 'visible',
              pointerEvents: 'none',
            });
            gsap.set(registerCard, { opacity: 1 });
            const print = gsap.utils.clamp(
              0,
              1,
              (layout.viewport.height * 0.85 - cardTop) / (layout.viewport.height * 0.4),
            );
            setPaper?.({ '--print': `${(1 - print) * 100}%`, y: -10 * (1 - print) });
            return;
          }

          const eased = gsap.parseEase(EASE.scrub)(progress);
          const dx = layout.register.docLeft + layout.register.width / 2 - layout.tray.cx;
          const dy = cardTop + layout.register.height / 2 - layout.tray.cy;
          const scale =
            1 +
            (gsap.utils.clamp(0.8, 1.15, layout.register.width / Math.max(1, layout.tray.width)) -
              1) *
              eased;

          const fade = gsap.utils.clamp(0, 1, (progress - 0.12) / 0.26);
          setTray({
            x: dx * eased,
            y: dy * eased,
            scale,
            opacity: 1 - fade,
            pointerEvents: fade > 0.3 ? 'none' : 'auto',
            visibility: fade >= 1 ? 'hidden' : 'visible',
          });
          const print = gsap.utils.clamp(0, 1, (progress - 0.62) / 0.38);
          setPaper?.({ '--print': `${(1 - print) * 100}%`, y: -10 * (1 - print) });
          gsap.set(registerCard, { opacity: gsap.utils.clamp(0, 1, (progress - 0.5) / 0.1) });
        };

        repaintReceiptRef.current = () => {
          measureTray();
          paintReceipt(lastProgress);
        };

        ScrollTrigger.create({
          id: 'receipt-flight',
          onToggle: (self) => {
            layerHint([registerCard, trayWrap], self.isActive ? LAYER.fading : 'auto');
            layerHint([get('registerPaper')], self.isActive ? LAYER.printing : 'auto');
          },
          trigger: registerCard,
          start: 'top bottom',
          end: 'center center',
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => paintReceipt(self.progress),
          onLeave: () => hasOpenOrderRef.current && firePuff(registerCard),
        });
        paintReceipt(0);
      }

      const sidesHead = get('sidesHead');
      if (sidesHead) {
        gsap.to(sidesHead, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: EASE.pop,
          onStart: () => layerHint([sidesHead], LAYER.fading),
          onComplete: () => layerHint([sidesHead], 'auto'),
          scrollTrigger: { id: 'sides-head', trigger: sidesHead, start: 'top 85%', once: true },
        });
      }

      const checkoutHead = get('checkoutHead');
      if (checkoutHead) {
        gsap.fromTo(
          checkoutHead,
          { y: -30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: EASE.pop,
            onStart: () => layerHint([checkoutHead], LAYER.fading),
            onComplete: () => layerHint([checkoutHead], 'auto'),
            scrollTrigger: { id: 'checkout-head', trigger: checkoutHead, start: 'top 85%', once: true },
          },
        );
      }

      const cells = list('ow', 5);
      if (cells.length) {
        gsap.fromTo(
          cells,
          { y: 46, rotate: (i: number) => (i % 2 ? 3 : -3) },
          {
            opacity: 1,
            y: 0,
            rotate: 0,
            duration: 0.7,
            ease: EASE.pop,
            stagger: 0.07,
            onStart: () => layerHint(cells, LAYER.fading),
            onComplete: () => layerHint(cells, 'auto'),
            scrollTrigger: { id: 'sides-cards', trigger: cells[0], start: 'top 85%', once: true },
          },
        );
      }

      const findSection = get('find');
      if (findSection) {
        const find = MOTION.find;
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            id: 'find-us',
            onToggle: (self) => {
              layerHint(
                [get('streetParallax'), get('streetRise'), get('findHead')],
                self.isActive ? LAYER.fading : 'auto',
              );
              layerHint(
                [get('findCard'), get('findFlip')],
                self.isActive ? LAYER.moving : 'auto',
              );
            },
            trigger: findSection,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        const rise = get('streetRise');
        if (rise) tl.fromTo(rise, { yPercent: find.rise }, { yPercent: 0, duration: 1, ease: EASE.scrub }, 0);
        const head = get('findHead');
        if (head) tl.fromTo(head, { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: find.headAt }, 0);
        const card = get('findCard');
        if (card) {
          tl.fromTo(
            card,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: find.cardSpan },
            find.cardAt,
          ).to(card, { scale: 1.06, duration: find.flySpan, ease: EASE.scrub }, find.holdAt);
        }

        const flip = get('findFlip');
        if (flip) {
          tl.to(
            flip,
            {
              rotateY: 180,
              duration: find.flySpan,
              ease: EASE.scrub,
              onComplete: () => firePuff(card),
            },
            find.holdAt,
          );
        }
      }

      let looping = false;

      function loopToTop() {
        if (looping) return;
        looping = true;
        const veil = get('loopVeil');

        gsap
          .timeline({
            onComplete: () => {
              looping = false;
            },
          })
          .to(veil ?? [], { opacity: 1, duration: 0.32, ease: 'none' }, 0)
          .call(() => dive(1.4), undefined, 0.3)
          .call(() => {
            gsap.set(window, { scrollTo: 0 });
            ScrollTrigger.update();
          }, undefined, 0.34)
          .to(veil ?? [], { opacity: 0, duration: 0.4, ease: 'none' }, 0.42);
      }

      ScrollTrigger.create({
        id: 'sea-floor',
        start: 0,
        end: 'max',
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (looping || reducedMotion || self.end <= 0) return;
          if (self.end - self.scroll() <= 2) loopToTop();
        },
      });
      const mm = gsap.matchMedia();

      mm.add({ isMobile: MOBILE_QUERY, isDesktop: DESKTOP_QUERY }, (context) => {
        const isMobile = Boolean(context.conditions?.isMobile);
        const lead = menuLead(isMobile);

        if (menuSection) {
          const track = get('track');
          if (track) gsap.set(track, { yPercent: -50 });
          const bar = get('menuBar');
          const cards = list('mw', 9);
          const setCard = cards.map((card) => gsap.quickSetter(card, 'css') as (v: object) => void);

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              id: 'menu-board',
              onToggle: (self) =>
                layerHint([track, ...cards], self.isActive ? LAYER.moving : 'auto'),
              trigger: menuSection,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const shift =
                  Math.max(0, (self.progress - lead) / (1 - lead)) * layout.trackOverflow;
                for (let i = 0; i < setCard.length; i++) {
                  const d = cardOffset(layout.cardCentres[i] ?? 0, shift, layout.viewport.width);
                  setCard[i]({
                    y: Math.abs(d) * MOTION.menu.dip,
                    rotate: d * MOTION.menu.tilt,
                  });
                }
              },
            },
          });
          if (track) tl.to(track, { x: () => -layout.trackOverflow, duration: 1 - lead }, lead);
          if (bar) tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1 - lead }, lead);
        }

        const flyer = get('flyer');
        if (heroSection && menuSection && flyer) {
          const heroBurger = get('burgerScale');
          const classicImg = get('classicImg');
          const landFraction = isMobile ? MOTION.handoff.landAtMobile : MOTION.handoff.landAt;

          type HandoffPhase = 'idle' | 'flying' | 'landed';
          let phase: HandoffPhase = 'idle';

          const settle = (landed: boolean) => {
            gsap.set(flyer, { opacity: 0 });
            gsap.to(heroBurger ?? [], { opacity: landed ? 0 : 1, duration: 0.2, overwrite: 'auto' });
            gsap.to(classicImg ?? [], { opacity: landed ? 1 : 0, duration: 0.35, overwrite: 'auto' });
          };
          const setPhase = (next: HandoffPhase) => {
            if (phase === next) return;
            phase = next;
            if (next !== 'flying') settle(next === 'landed');
          };
          const setFlyer = gsap.quickSetter(flyer, 'css') as (v: object) => void;

          const paintHandoff = (self: ScrollTrigger) => {
            if (self.progress <= 0) return setPhase('idle');
            if (self.progress >= 1) return setPhase('landed');
            setPhase('flying');

            const scroll = self.start + (self.end - self.start) * self.progress;
            const start = layout.menuTop;
            const end = start + layout.menuRun * landFraction;
            const p = gsap.utils.clamp(0, 1, (scroll - start) / Math.max(1, end - start));
            const eased = gsap.parseEase(EASE.scrub)(p);
            const targetX = layout.viewport.width / 2;
            const targetY = isMobile ? layout.viewport.height / 2 : layout.disc.y;
            const targetW = isMobile
              ? Math.min(layout.viewport.width * 0.52, layout.viewport.height * 0.34, 260)
              : layout.landWidth;

            const width = layout.ad.width + (targetW - layout.ad.width) * eased;
            const cx = layout.ad.x + (targetX - layout.ad.x) * eased;
            const cy = layout.ad.y + (targetY - layout.ad.y) * eased;
            const arc = Math.sin(p * Math.PI) * MOTION.handoff.arc * layout.viewport.height;
            const baseW = layout.ad.width;
            const baseH = (baseW * BURGER_ASPECT.h) / BURGER_ASPECT.w;
            setFlyer({
              opacity: 1,
              scale: width / baseW,
              x: cx - baseW / 2,
              y: cy - arc - baseH / 2,
              rotate: Math.sin(p * Math.PI) * MOTION.handoff.spin,
            });
            gsap.set([heroBurger, classicImg].filter(Boolean) as HTMLElement[], { opacity: 0 });
          };

          // Reset to idle first: creating the trigger runs its initial update synchronously,
          // which picks the real phase when the page is already scrolled past this range.
          let live = false;
          settle(false);
          ScrollTrigger.create({
            id: 'patty-handoff',
            onToggle: (self) => layerHint([flyer], self.isActive ? LAYER.fading : 'auto'),
            trigger: heroSection,
            start: 'bottom bottom',
            endTrigger: menuSection,
            end: () => `top+=${layout.menuRun * landFraction} top`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: paintHandoff,
            onEnter: paintHandoff,
            onEnterBack: paintHandoff,
            onLeave: () => {
              setPhase('landed');
              if (live) firePuff(isMobile ? flyer : get('disc0'));
            },
            onLeaveBack: () => setPhase('idle'),
          });
          live = true;
        }
      });

      mm.add(`${DESKTOP_QUERY} and (hover: hover) and (pointer: fine)`, () => {
        const hero = MOTION.hero;
        const smooth = { duration: 0.7, ease: 'power3' };

        const follow = (node: HTMLElement | undefined, depth: number) =>
          node
            ? {
                x: gsap.quickTo(node, 'x', smooth),
                y: gsap.quickTo(node, 'y', smooth),
                depth: depth * parallaxStrength,
              }
            : null;

        const layers = [
          follow(get('burgerParallax'), hero.burgerDepth),
          follow(get('heroBgParallax'), -hero.bgDepth),
          follow(get('streetParallax'), -MOTION.find.bgDepth),
          ...hero.depths.map((depth, i) => follow(at('ing', i), depth)),
        ].filter(Boolean) as { x: (v: number) => void; y: (v: number) => void; depth: number }[];
        const cursor = get('cursor');
        const cursorInner = get('cursorInner');
        const trailHost = get('trail');
        const useCursor = bubbleCursorEnabled && cursor && trailHost;
        let toCursorX: ((v: number) => void) | null = null;
        let toCursorY: ((v: number) => void) | null = null;
        const pool: HTMLElement[] = [];
        let poolIndex = 0;
        let spawnX = -999;
        let spawnY = -999;
        let seen = false;

        if (useCursor) {
          document.body.setAttribute('data-bubble-cursor', '');
          const c = MOTION.cursor;
          toCursorX = gsap.quickTo(cursor, 'x', { duration: 0.12, ease: 'power3' });
          toCursorY = gsap.quickTo(cursor, 'y', { duration: 0.12, ease: 'power3' });

          for (let i = 0; i < c.pool; i++) {
            const wrap = document.createElement('div');
            wrap.style.cssText = 'position:absolute;left:0;top:0';
            const dot = document.createElement('div');
            const size = c.minSize + ((i * 7) % (c.maxSize - c.minSize));
            dot.style.cssText =
              `width:${size}px;height:${size}px;margin:${-size / 2}px 0 0 ${-size / 2}px;` +
              'border-radius:50%;border:3px solid rgba(255,246,229,.85);' +
              'background:rgba(255,246,229,.12);opacity:0';
            wrap.appendChild(dot);
            trailHost.appendChild(wrap);
            pool.push(dot);
          }
        }

        const onDown = () => gsap.to(cursorInner ?? [], { scale: 0.7, duration: 0.25, ease: EASE.pop });
        const onUp = () => gsap.to(cursorInner ?? [], { scale: 1, duration: 0.25, ease: EASE.pop });

        function onMove(event: MouseEvent) {
          const nx = (event.clientX / window.innerWidth - 0.5) * 2;
          const ny = (event.clientY / window.innerHeight - 0.5) * 2;
          for (const layer of layers) {
            layer.x(nx * layer.depth);
            layer.y(ny * layer.depth);
          }

          if (!useCursor) return;
          if (!seen) {
            seen = true;
            gsap.set(cursor, { x: event.clientX, y: event.clientY, opacity: 1 });
          }
          toCursorX?.(event.clientX);
          toCursorY?.(event.clientY);
          const dx = event.clientX - spawnX;
          const dy = event.clientY - spawnY;
          if (dx * dx + dy * dy <= MOTION.cursor.spawnDist ** 2) return;
          spawnX = event.clientX;
          spawnY = event.clientY;
          const dot = pool[poolIndex];
          poolIndex = (poolIndex + 1) % pool.length;
          const drift = ((poolIndex % 5) - 2) * 6;
          gsap.set(dot.parentElement, { x: event.clientX + drift, y: event.clientY });
          gsap.fromTo(
            dot,
            { y: 0, scale: 0.5, opacity: 0.95 },
            {
              y: -70,
              scale: 0.35,
              opacity: 0,
              duration: ms(MOTION.cursor.life),
              ease: EASE.settle,
              overwrite: true,
            },
          );
        }

        window.addEventListener('mousemove', onMove, { passive: true });
        window.addEventListener('mousedown', onDown);
        window.addEventListener('mouseup', onUp);

        return () => {
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mousedown', onDown);
          window.removeEventListener('mouseup', onUp);
          document.body.removeAttribute('data-bubble-cursor');
          trailHost?.replaceChildren();
        };
      });

      return () => {
        disposed = true;
        ScrollTrigger.defaults({ markers: false });
        document.removeEventListener('click', onAnchorClick);
        ScrollTrigger.removeEventListener('refreshInit', measure);
        mm.revert();
        for (const trigger of ScrollTrigger.getAll()) {
          if (!preexisting.has(trigger)) trigger.kill();
        }
        get('puff')?.replaceChildren();
        get('diveStreaks')?.replaceChildren();
      };
    },
    { dependencies: [reducedMotion], revertOnUpdate: true },
  );
}
