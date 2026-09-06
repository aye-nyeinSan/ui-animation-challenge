import { Fragment } from 'react';

const PHRASE = 'Order here';

const PER_HALF = 5;

export function Marquee() {
  return (
    <div className="relative z-[2] overflow-hidden border-y-[5px] border-ink bg-gold py-3.5 shadow-[0_0_90px_30px_rgba(11,79,108,0.75)]">
      <div className="flex w-max animate-marquee will-change-transform">
        <div className="flex items-center gap-[34px] whitespace-nowrap pr-[34px] font-display text-[clamp(20px,2.4vw,34px)] text-ink">
          {Array.from({ length: PER_HALF * 2 }, (_, i) => (
            <Fragment key={i}>
              <span>{PHRASE}</span>
              <span className="text-brick">&#9679;</span>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
