import { useMemo } from 'react';
import { MOTION } from '../motion';

interface Bubble {
  readonly left: string;
  readonly size: number;
  readonly rise: string;
  readonly riseDelay: string;
  readonly sway: string;
  readonly swayDelay: string;
}

function makeBubbles(count: number): Bubble[] {
  return Array.from({ length: count }, (_, i) => {
    const rand = (k: number) => {
      const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    return {
      left: `${(4 + rand(2) * 92).toFixed(1)}%`,
      size: Math.round(10 + rand(1) * 26),
      rise: `${(6 + rand(3) * 7).toFixed(1)}s`,
      riseDelay: `${(-rand(4) * 12).toFixed(1)}s`,
      sway: `${(2 + rand(5) * 2.5).toFixed(1)}s`,
      swayDelay: `${(-rand(6) * 3).toFixed(1)}s`,
    };
  });
}

export function BubbleField({ isMobile }: { isMobile: boolean }) {
  const bubbles = useMemo(
    () => makeBubbles(isMobile ? MOTION.bubblesMobile : MOTION.bubbles),
    [isMobile],
  );

  return (
    <>
      {bubbles.map((bubble, i) => (
        <div
          key={i}
          className="absolute -bottom-[50px]"
          style={{
            left: bubble.left,
            width: bubble.size,
            height: bubble.size,
            animation: `rise ${bubble.rise} linear ${bubble.riseDelay} infinite`,
          }}
        >
          <div
            className="size-full rounded-full border-[3px] border-cream/85 bg-cream/12"
            style={{ animation: `sway ${bubble.sway} ease-in-out ${bubble.swayDelay} infinite alternate` }}
          />
        </div>
      ))}
    </>
  );
}
