import { TAX_RATE } from '../data/menu';
import { formatMoney, selectBilled, selectSubtotal } from '../order/orderReducer';
import { useOrder } from '../order/useOrder';
import { useSceneNode } from '../scene/sceneNodes';
import { Eyebrow, SectionTitle } from './Headings';
import register from '../assets/register.webp';

export function CheckoutSection() {
  const { state, dispatch } = useOrder();
  const billed = selectBilled(state);
  const subtotal = selectSubtotal(state);

  return (
    <section
      className="relative z-[1] -mt-[14vh] overflow-hidden px-[clamp(20px,6vw,80px)] py-[clamp(150px,34vh,400px)]"
      id="checkout"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[24vh] bg-linear-to-b from-sea from-0% via-sea/80 via-38% to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[24vh] bg-linear-to-t from-sea from-0% via-sea/80 via-38% to-transparent" aria-hidden="true" />
      <img
        className="photo-mask absolute inset-0 size-full object-cover object-[50%_100%]"
        src={register}
        alt=""
        loading="lazy"
        decoding="async"
      />
      <div className="scrim-checkout absolute inset-0" />

      <div className="relative z-[2] mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-center gap-[clamp(28px,4vw,60px)]">
        <div className="opacity-0" ref={useSceneNode('checkoutHead')}>
          <Eyebrow>Order here</Eyebrow>
          <SectionTitle>Ring it up</SectionTitle>
          <p className="mt-4 max-w-[42ch] text-[clamp(15px,1.3vw,19px)] font-bold leading-normal text-pretty">
            Everything you added lands on the receipt. The register only speaks in whole cents, and the
            cashier only speaks when he must.
          </p>
        </div>

        <div
          className="w-[min(420px,100%)] justify-self-center opacity-0"
          ref={useSceneNode('registerCard')}
        >
          <div className="relative z-[2] -mx-2.5 -mb-2.5 h-[34px] w-[calc(100%+20px)] rounded-xl border-4 border-ink bg-linear-to-b from-[#DCE6EA] from-0% via-[#AEBFC6] via-55% to-[#8CA2AB] to-100% shadow-[0_6px_0_var(--color-ink)]">
            <div className="absolute inset-x-[8%] bottom-[5px] h-[9px] rounded-md bg-ink shadow-[inset_0_3px_4px_rgba(0,0,0,0.6)]" />
          </div>

          <div
            className="-mt-4 [clip-path:inset(0_0_var(--print,100%)_0)] [transform:translateY(-10px)]"
            ref={useSceneNode('registerPaper')}
          >
            <div className="relative rounded-lg border-4 border-ink bg-cream p-[clamp(20px,2.6vw,30px)] text-ink shadow-[0_10px_0_var(--color-ink),0_30px_50px_rgba(18,48,63,0.4)]">
              <div className="border-b-4 border-dashed border-ink/30 pb-3.5 text-center">
                <div className="font-display text-[clamp(26px,2.6vw,34px)] leading-none">The Krusty Krab</div>
                <div className="mt-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-brick">
                  831 Bottom Feeder Lane
                </div>
              </div>

              <div className="mt-3.5 grid min-h-24 gap-[9px]">
                {billed.length === 0 ? (
                  <div className="grid min-h-24 place-items-center text-center text-sm font-bold leading-normal opacity-70">
                    Nothing on the receipt yet. Add something from the board above.
                  </div>
                ) : (
                  billed.map((line) => (
                    <div className="flex items-baseline justify-between gap-3 text-sm font-bold" key={line.name}>
                      <span>
                        {line.qty} &times; {line.name}
                      </span>
                      <span className="flex-none font-display text-base">
                        {formatMoney(line.qty * line.price)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-3.5 grid gap-2 border-t-4 border-dashed border-ink/30 pt-3 text-sm font-bold">
                <div className="flex justify-between gap-3">
                  <span>Subtotal</span>
                  <span>{formatMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Sea salt tax</span>
                  <span>{formatMoney(subtotal * TAX_RATE)}</span>
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between gap-3 border-t-4 border-ink pt-3">
                <span className="text-xs font-extrabold uppercase tracking-[0.18em]">Total due</span>
                <span className="font-display text-[clamp(28px,3vw,38px)] text-brick">
                  {formatMoney(subtotal * (1 + TAX_RATE))}
                </span>
              </div>

              <button
                className="mt-[18px] min-h-12 w-full cursor-pointer touch-manipulation rounded-full border-4 border-ink bg-salmon px-[18px] py-3.5 font-display text-[19px] text-cream shadow-[0_6px_0_var(--color-ink)] transition-[translate,box-shadow] duration-300 ease-pop hover:-translate-y-[3px] hover:shadow-[0_9px_0_var(--color-ink)] active:translate-y-[2px] active:shadow-[0_3px_0_var(--color-ink)] disabled:translate-y-0 disabled:cursor-default disabled:opacity-85 disabled:shadow-[0_6px_0_var(--color-ink)]"
                type="button"
                disabled={state.order.length === 0}
                onClick={() => dispatch({ type: 'place' })}
              >
                {state.paid ? 'Order placed' : 'Place order'}
              </button>

              {state.paid && (
                <div className="pointer-events-none absolute left-1/2 top-[46%] animate-stamp">
                  <div className="rounded-[14px] border-[6px] border-brick/85 px-[18px] py-1.5 font-display text-[clamp(38px,5vw,62px)] tracking-[0.06em] text-brick/85">
                    PAID
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
