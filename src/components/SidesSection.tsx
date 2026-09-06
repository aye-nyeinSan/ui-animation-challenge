import { SIDES } from '../data/menu';
import { useCardTilt } from '../hooks/useCardTilt';
import { useAddToOrder } from '../order/useAddToOrder';
import { useSceneNode } from '../scene/sceneNodes';
import type { Product } from '../types';
import { Eyebrow, Lede, SectionTitle } from './Headings';
import { ProductCard } from './ProductCard';
import { SideThumb } from './ProductMedia';
import dining from '../assets/dining.webp';

type SideIndex = 0 | 1 | 2 | 3 | 4;
const INDEXES = [0, 1, 2, 3, 4] as const satisfies readonly SideIndex[];

function SideCell({ index }: { index: SideIndex }) {
  const product: Product = SIDES[index];
  return (
    <div
      className="opacity-0"
      ref={useSceneNode<HTMLDivElement>(`ow${index}`)}
      data-tilt="1"
    >
      <ProductCard
        product={product}
        variant="side"
        tilt={index % 2 === 0 ? 'a' : 'b'}
        media={<SideThumb product={product} />}
      />
    </div>
  );
}

export function SidesSection({ tiltEnabled }: { tiltEnabled: boolean }) {
  const onAdd = useAddToOrder();
  const tilt = useCardTilt(tiltEnabled);

  return (
    <section
      className="relative z-[1] -mt-[14vh] overflow-hidden px-[clamp(20px,6vw,80px)] pb-[clamp(130px,26vh,320px)] pt-[clamp(120px,24vh,300px)]"
      id="sides"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[24vh] bg-linear-to-b from-sea from-0% via-sea/80 via-38% to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[24vh] bg-linear-to-t from-sea from-0% via-sea/80 via-38% to-transparent" aria-hidden="true" />
      <img
        className="photo-mask absolute inset-0 size-full object-cover object-[50%_60%]"
        src={dining}
        alt=""
        loading="lazy"
        decoding="async"
      />
      <div className="scrim-sides absolute inset-0" />

      <div className="relative z-[2] mx-auto max-w-[1320px]">
        <div
          className="mx-auto mb-[clamp(34px,5vh,60px)] max-w-[760px] text-center opacity-0"
          ref={useSceneNode('sidesHead')}
        >
          <Eyebrow>Also on the board</Eyebrow>
          <SectionTitle>Other menu you can order</SectionTitle>
          <Lede>Sides, shakes and everything the fry cook can reach without leaving the grill.</Lede>
        </div>

        <div
          className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-[clamp(16px,2.2vw,28px)] [perspective:1000px]"
          onClick={onAdd}
          {...tilt}
        >
          {INDEXES.map((index) => (
            <SideCell key={SIDES[index].id} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
