import type { CSSProperties } from 'react';
import { useSceneNode } from '../scene/sceneNodes';
import type { MenuProduct, Product } from '../types';

const DISC =
  'grid aspect-square place-items-center overflow-visible rounded-full border-4 border-ink bg-[radial-gradient(circle_at_50%_40%,var(--color-gold-soft),var(--color-gold)_70%)]';
const DISC_IMG =
  'block size-[96%] animate-float object-contain drop-shadow-[0_10px_10px_rgba(18,48,63,0.35)]';

function floatVars(product: MenuProduct): CSSProperties {
  return {
    '--float-dur': product.float.duration,
    '--float-delay': product.float.delay,
    ...(product.float.reverse ? { '--float-dir': 'reverse' } : {}),
  } as CSSProperties;
}

export function MenuDisc({ product }: { product: MenuProduct }) {
  return (
    <div className={DISC}>
      <img className={DISC_IMG} src={product.image} alt={product.alt} style={floatVars(product)} />
    </div>
  );
}

export function ClassicDisc({ product }: { product: MenuProduct }) {
  return (
    <div className={DISC} ref={useSceneNode<HTMLDivElement>('disc0')}>
      <img
        className={`${DISC_IMG} opacity-0`}
        ref={useSceneNode<HTMLImageElement>('classicImg')}
        src={product.image}
        alt={product.alt}
        style={floatVars(product)}
      />
    </div>
  );
}

export function SideThumb({ product }: { product: Product }) {
  return (
    <div className="aspect-square overflow-hidden rounded-[20px] border-4 border-ink bg-sea">
      <img
        className="block size-full object-cover"
        src={product.image}
        alt={product.alt}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
