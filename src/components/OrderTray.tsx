import { useEffect, useRef, useState } from 'react';
import {
  formatMoney,
  selectHasOpenOrder,
  selectItemCount,
  selectSubtotal,
  selectTrayVisible,
} from '../order/orderReducer';
import { useOrder } from '../hooks/order/useOrder';
import { useSceneNode } from '../scene/sceneNodes';

const STEP =
  'grid size-10 flex-none cursor-pointer touch-manipulation place-items-center rounded-full border-[3px] border-ink p-0 font-display text-xl leading-none text-ink';

export function OrderTray() {
  const { state, dispatch } = useOrder();
  const count = selectItemCount(state);
  const subtotal = selectSubtotal(state);
  const open = selectTrayVisible(state);
  const [popping, setPopping] = useState(false);
  const previousCount = useRef(count);

  useEffect(() => {
    const grew = count > previousCount.current;
    previousCount.current = count;
    if (!grew) return;
    setPopping(true);
    const timer = setTimeout(() => setPopping(false), 450);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div
      className="pointer-events-none fixed bottom-[clamp(14px,2.4vw,32px)] right-[clamp(14px,2.4vw,32px)] z-[45] flex origin-center flex-col items-end gap-2.5"
      ref={useSceneNode('trayWrap')}
    >
      {open && (
        <div className="pointer-events-auto w-[min(320px,84vw)] rounded-3xl border-4 border-ink bg-cream px-[18px] py-4 text-ink shadow-[0_10px_0_var(--color-ink),0_26px_44px_rgba(18,48,63,0.4)]">
          <div className="flex items-center justify-between gap-3">
            <div className="font-display text-[22px] leading-none">Your order</div>
            <button
              className="-mx-1.5 -my-2.5 cursor-pointer touch-manipulation border-none bg-transparent px-1.5 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-brick"
              type="button"
              onClick={() => dispatch({ type: 'clear' })}
            >
              Clear All
            </button>
          </div>

          <div className="mt-3 grid max-h-[min(42vh,340px)] gap-2 overflow-auto overscroll-contain">
            {state.order.map((line) => (
              <div
                className="flex flex-wrap items-center justify-between gap-2 border-t-[3px] border-ink/15 pt-[9px]"
                key={line.name}
              >
                <div className="min-w-0 flex-auto">
                  <div className="text-sm font-extrabold leading-tight">{line.name}</div>
                  <div className="text-xs font-bold opacity-70">{formatMoney(line.price)} each</div>
                </div>
                <div className="flex flex-none items-center gap-1.5">
                  <button
                    className={`${STEP} bg-cream hover:bg-gold`}
                    type="button"
                    aria-label={`One fewer ${line.name}`}
                    onClick={() => dispatch({ type: 'step', name: line.name, delta: -1 })}
                  >
                    &minus;
                  </button>
                  <span className="min-w-5 text-center font-display text-[17px]">{line.qty}</span>
                  <button
                    className={`${STEP} bg-gold hover:bg-gold-soft`}
                    type="button"
                    aria-label={`One more ${line.name}`}
                    onClick={() => dispatch({ type: 'step', name: line.name, delta: 1 })}
                  >
                    +
                  </button>
                </div>
                <span className="min-w-12 flex-none text-right font-display text-base">
                  {formatMoney(line.qty * line.price)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3.5 flex items-baseline justify-between gap-3 border-t-4 border-ink pt-2.5">
            <span className="text-xs font-extrabold uppercase tracking-[0.18em]">Total</span>
            <span className="font-display text-[26px] text-brick">{formatMoney(subtotal)}</span>
          </div>
        </div>
      )}

      <button
        className={`flex min-h-12 translate-y-6 scale-75 cursor-pointer touch-manipulation items-center gap-2.5 rounded-full border-4 border-ink bg-gold px-5 py-[13px] font-display text-lg text-ink opacity-0 shadow-[0_6px_0_var(--color-ink)] transition-[opacity,translate,scale,box-shadow] duration-500 ease-pop ${
          selectHasOpenOrder(state)
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100 hover:-translate-y-[3px] hover:shadow-[0_9px_0_var(--color-ink)] active:translate-y-[2px] active:shadow-[0_3px_0_var(--color-ink)]'
            : 'pointer-events-none'
        }`}
        type="button"
        aria-expanded={open}
        onClick={() => dispatch({ type: 'toggleTray' })}
      >
        <span>Order</span>
        <span
          className={`grid h-[26px] min-w-[26px] place-items-center rounded-full border-[3px] border-ink bg-salmon px-1.5 text-sm text-cream ${
            popping ? 'animate-count-pop' : ''
          }`}
          ref={useSceneNode<HTMLSpanElement>('trayCount')}
        >
          {count}
        </span>
      </button>
    </div>
  );
}
