import type { CSSProperties, ReactNode } from 'react';
import { useSceneNode } from '../scene/sceneNodes';

interface Ornament {
  readonly art: ReactNode;
  readonly place: string;
  readonly float: CSSProperties;
  readonly desktopOnly?: boolean;
}

const ORNAMENTS: readonly Ornament[] = [
  {
    place: 'left-[88%] top-[86%] w-[clamp(48px,6vw,90px)]',
    float: { '--float-dur': '5.2s', '--float-delay': '0.3s' } as CSSProperties,
    art: (
      <svg viewBox="0 0 80 80" className="block h-auto w-full overflow-visible">
        <ellipse cx="40" cy="40" rx="34" ry="21" transform="rotate(-28 40 40)" fill="#7BC950" stroke="#12303F" strokeWidth="5" />
        <ellipse cx="40" cy="40" rx="24" ry="13" transform="rotate(-28 40 40)" fill="#A6DE7A" />
        <circle cx="30" cy="42" r="3" fill="#5E9B3A" />
        <circle cx="44" cy="34" r="3" fill="#5E9B3A" />
        <circle cx="52" cy="44" r="2.5" fill="#5E9B3A" />
      </svg>
    ),
  },
  {
    desktopOnly: true,
    place: 'left-[70%] top-[38%] w-[clamp(56px,7vw,104px)]',
    float: { '--float-dur': '6.4s', '--float-delay': '1.1s', '--float-dir': 'reverse' } as CSSProperties,
    art: (
      <svg viewBox="0 0 80 80" className="block h-auto w-full overflow-visible">
        <circle cx="40" cy="40" r="34" fill="#F26B5E" stroke="#12303F" strokeWidth="5" />
        <circle cx="40" cy="40" r="24" fill="#FF8F82" />
        <ellipse cx="40" cy="24" rx="3" ry="6" fill="#FFF6E5" />
        <ellipse cx="54" cy="34" rx="3" ry="6" transform="rotate(70 54 34)" fill="#FFF6E5" />
        <ellipse cx="26" cy="34" rx="3" ry="6" transform="rotate(-70 26 34)" fill="#FFF6E5" />
        <ellipse cx="32" cy="52" rx="3" ry="6" transform="rotate(-150 32 52)" fill="#FFF6E5" />
        <ellipse cx="48" cy="52" rx="3" ry="6" transform="rotate(150 48 52)" fill="#FFF6E5" />
      </svg>
    ),
  },
  {
    desktopOnly: true,
    place: 'left-[6%] top-[76%] w-[clamp(48px,5.5vw,84px)]',
    float: { '--float-dur': '7.1s', '--float-delay': '0.7s' } as CSSProperties,
    art: (
      <svg viewBox="0 0 80 60" className="block h-auto w-full overflow-visible">
        <ellipse cx="26" cy="30" rx="13" ry="7" transform="rotate(-30 26 30)" fill="#FFF6E5" stroke="#12303F" strokeWidth="4" />
        <ellipse cx="52" cy="22" rx="13" ry="7" transform="rotate(15 52 22)" fill="#FFF6E5" stroke="#12303F" strokeWidth="4" />
        <ellipse cx="46" cy="44" rx="13" ry="7" transform="rotate(-10 46 44)" fill="#FFF6E5" stroke="#12303F" strokeWidth="4" />
      </svg>
    ),
  },
  {
    place: 'left-[64%] top-[20%] w-[clamp(36px,4.4vw,68px)]',
    float: { '--float-dur': '5.8s', '--float-delay': '1.6s' } as CSSProperties,
    art: (
      <svg viewBox="0 0 60 60" className="block h-auto w-full overflow-visible">
        <circle cx="30" cy="30" r="25" fill="rgba(255,246,229,.14)" stroke="rgba(255,246,229,.9)" strokeWidth="4" />
        <path d="M17 28a14 14 0 0 1 9-11" fill="none" stroke="#FFF6E5" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    desktopOnly: true,
    place: 'left-[88%] top-[62%] w-[clamp(30px,3.6vw,56px)]',
    float: { '--float-dur': '4.3s', '--float-delay': '2.2s', '--float-dir': 'reverse' } as CSSProperties,
    art: (
      <svg viewBox="0 0 60 60" className="block h-auto w-full overflow-visible">
        <circle cx="30" cy="30" r="25" fill="rgba(255,246,229,.14)" stroke="rgba(255,246,229,.9)" strokeWidth="4" />
        <path d="M17 28a14 14 0 0 1 9-11" fill="none" stroke="#FFF6E5" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
];

type OrnamentIndex = 0 | 1 | 2 | 3 | 4;

function Ornament({ index }: { index: OrnamentIndex }) {
  const { art, place, float, desktopOnly } = ORNAMENTS[index];
  return (
    <div
      className={`absolute ${place}${desktopOnly ? ' max-md:hidden' : ''}`}
      style={float}
      aria-hidden="true"
    >
      <div ref={useSceneNode<HTMLDivElement>(`ing${index}`)}>
        <div className="opacity-0 [transform:scale(0.4)]" ref={useSceneNode<HTMLDivElement>(`ie${index}`)}>
          <div className="animate-float">{art}</div>
        </div>
      </div>
    </div>
  );
}

export function HeroOrnaments() {
  return (
    <>
      {([0, 1, 2, 3, 4] as const).map((i) => (
        <Ornament key={i} index={i} />
      ))}
    </>
  );
}
