import type { ReactNode } from 'react';
import { formatMoney } from '../order/orderReducer';
import type { Product } from '../types';

interface ProductCardProps {
  readonly product: Product;
  readonly variant: 'menu' | 'side';
  readonly tilt: 'a' | 'b';
  readonly media: ReactNode;
}

const CARD =
  'relative rounded-[26px] border-4 border-ink bg-cream text-ink shadow-[0_8px_0_var(--color-ink)] transition-[translate,rotate,scale,box-shadow] duration-[450ms] ease-pop hover:shadow-[0_20px_0_var(--color-ink),0_32px_48px_rgba(18,48,63,0.35)]';

const HOVER = {
  'menu-a': 'hover:-translate-y-[10px] hover:rotate-[1.5deg] hover:scale-[1.03]',
  'menu-b': 'hover:-translate-y-[10px] hover:-rotate-[1.5deg] hover:scale-[1.03]',
  'side-a': 'hover:-translate-y-[10px] hover:rotate-[1.2deg] hover:scale-[1.02]',
  'side-b': 'hover:-translate-y-[10px] hover:-rotate-[1.2deg] hover:scale-[1.02]',
} as const;

export function ProductCard({ product, variant, tilt, media }: ProductCardProps) {
  const isMenu = variant === 'menu';
  return (
    <div
      className={[
        CARD,
        HOVER[`${variant}-${tilt}`],
        isMenu ? 'cursor-pointer p-[clamp(14px,1.8vw,22px)]' : 'p-[clamp(14px,1.6vw,20px)]',
      ].join(' ')}
    >
      <div
        className={`absolute -top-3.5 rounded-full border-[3px] border-ink bg-salmon px-3 py-[5px] font-display text-[17px] text-cream shadow-[0_3px_0_var(--color-ink)] ${
          isMenu ? 'right-[18px]' : 'right-4'
        }`}
      >
        {formatMoney(product.price)}
      </div>

      {media}

      <div
        className={`font-display leading-none text-ink ${isMenu ? 'mt-4 text-[26px]' : 'mt-3.5 text-2xl'}`}
      >
        {product.name}
      </div>
      <p className="mt-1.5 text-sm font-bold leading-[1.45] text-ink text-pretty">{product.blurb}</p>

      <button
        className="mt-3.5 min-h-11 w-full cursor-pointer touch-manipulation rounded-full border-[3px] border-ink bg-salmon px-4 py-3 font-display text-base tracking-[0.02em] text-cream shadow-[0_4px_0_var(--color-ink)] transition-[translate,box-shadow] duration-300 ease-pop hover:-translate-y-[3px] hover:shadow-[0_7px_0_var(--color-ink)] active:translate-y-[2px] active:shadow-[0_2px_0_var(--color-ink)]"
        type="button"
        data-item={product.id}
        data-price={product.price.toFixed(2)}
      >
        Add to order
      </button>
    </div>
  );
}
