import { MENU } from "../constants/menu";
import { useAddToOrder } from "../hooks/order/useAddToOrder";
import { useSceneNode } from "../scene/sceneNodes";
import { ProductCard } from "./ProductCard";
import { ClassicDisc, MenuDisc } from "./ProductMedia";
import interior from "../assets/interior.webp";

type MenuIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
const INDEXES = [
  0, 1, 2, 3, 4, 5, 6, 7, 8,
] as const satisfies readonly MenuIndex[];

function MenuItem({ index }: { index: MenuIndex }) {
  const product = MENU[index];
  return (
    <div
      className="w-[clamp(230px,24vw,300px)] flex-none"
      ref={useSceneNode<HTMLDivElement>(`mw${index}`)}
    >
      <ProductCard
        product={product}
        variant="menu"
        tilt={index % 2 === 0 ? "a" : "b"}
        media={
          index === 0 ? (
            <ClassicDisc product={product} />
          ) : (
            <MenuDisc product={product} />
          )
        }
      />
    </div>
  );
}

export function MenuScene() {
  const onAdd = useAddToOrder();

  return (
    <section
      className="relative h-[400vh]"
      id="menu"
      ref={useSceneNode("menu")}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="fade-menu-bottom pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[20vh]"
          aria-hidden="true"
        />
        <img
          className="photo-mask-tall absolute left-0 top-0 size-full object-cover object-[50%_38%]"
          src={interior}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <div className="scrim-menu pointer-events-none absolute inset-0" />

        <div
          className="absolute left-0 top-1/2 z-[2] flex items-center gap-[clamp(18px,2.6vw,32px)] px-[clamp(20px,6vw,80px)]"
          ref={useSceneNode("track")}
          onClick={onAdd}
        >
          <div className="mr-[clamp(10px,3vw,48px)] w-[clamp(260px,30vw,400px)] flex-none">
            <div className="relative -rotate-2 rounded-[14px] border-[5px] border-[#7A4A1F] bg-gold px-[clamp(20px,3vw,40px)] py-[clamp(18px,2.4vw,30px)] text-ink shadow-[inset_0_0_0_4px_#C98B4B,0_10px_0_var(--color-ink)]">
              <div className="absolute -top-11 left-[30%] h-11 w-[5px] bg-ink" />
              <div className="absolute -top-11 left-[70%] h-11 w-[5px] bg-ink" />
              <div className="text-xs font-extrabold uppercase tracking-[0.22em] text-brick">
                Menu board
              </div>
              <h2 className="mb-2.5 mt-1.5 font-display text-[clamp(40px,5vw,68px)] font-normal leading-[0.94] tracking-[0.01em]">
                Galley Grub
              </h2>
              <p className="m-0 text-[15px] font-bold leading-normal text-pretty">
                Nine ways to serve a patty. Eight of them approved. Keep
                scrolling to read the board.
              </p>
            </div>
          </div>

          {INDEXES.map((index) => (
            <MenuItem key={MENU[index].id} index={index} />
          ))}

          <div className="w-[clamp(20px,6vw,80px)] flex-none" />
        </div>

        <div className="absolute inset-x-[clamp(20px,6vw,80px)] bottom-7 z-[2] h-2 overflow-hidden rounded-full border-[3px] border-ink bg-ink/35">
          <div
            className="size-full origin-left bg-gold [transform:scaleX(0)]"
            ref={useSceneNode("menuBar")}
          />
        </div>
      </div>
    </section>
  );
}
