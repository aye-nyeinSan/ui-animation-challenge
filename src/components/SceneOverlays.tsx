import { useSceneNode } from '../scene/sceneNodes';
import { BubbleField } from './BubbleField';
import burger from '../assets/burger.webp';

export function WaterBackdrop({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-linear-to-b from-sea from-0% via-sea-mid via-45% to-sea-bright to-100%" />
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <BubbleField isMobile={isMobile} />
      </div>
      <div
        className="pointer-events-none fixed inset-0 z-30 opacity-50 mix-blend-soft-light max-md:hidden"
        aria-hidden="true"
      >
        <div className="caustic animate-drift-a absolute -left-[10%] -top-[14%] size-[min(70vw,760px)] bg-[radial-gradient(circle,rgba(255,246,229,0.5),transparent_65%)]" />
        <div className="caustic animate-drift-b absolute -bottom-[16%] -right-[14%] size-[min(64vw,680px)] bg-[radial-gradient(circle,rgba(255,246,229,0.42),transparent_65%)]" />
      </div>
    </>
  );
}

export function SceneOverlays() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[199] overflow-hidden"
        ref={useSceneNode('trail')}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none fixed left-0 top-0 z-[200] opacity-0 will-change-transform"
        ref={useSceneNode('cursor')}
        aria-hidden="true"
      >
        <div
          className="-ml-[15px] -mt-[15px] size-[30px]"
          ref={useSceneNode('cursorInner')}
        >
          <svg viewBox="0 0 60 60" className="block size-full overflow-visible">
            <circle
              cx="30"
              cy="30"
              r="25"
              fill="rgba(255,246,229,.16)"
              stroke="rgba(255,246,229,.95)"
              strokeWidth="4"
            />
            <path d="M17 28a14 14 0 0 1 9-11" fill="none" stroke="#FFF6E5" strokeWidth="4" strokeLinecap="round" />
            <circle cx="38" cy="40" r="3" fill="rgba(255,246,229,.8)" />
          </svg>
        </div>
      </div>

      <div
        className="pointer-events-none fixed left-0 top-0 z-[39]"
        ref={useSceneNode('puff')}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none fixed left-0 top-0 z-40 aspect-[494/454] opacity-0"
        ref={useSceneNode('flyer')}
        aria-hidden="true"
      >
        <img
          className="block size-full object-contain drop-shadow-[0_18px_22px_rgba(18,48,63,0.45)]"
          src={burger}
          alt=""
        />
      </div>

      <div
        className="pointer-events-none fixed bottom-[clamp(52px,8vh,64px)] left-1/2 z-[46] flex -translate-x-1/2 items-center gap-[9px] whitespace-nowrap rounded-full border-2 border-cream/35 bg-ink/60 px-[15px] py-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-cream opacity-0 backdrop-blur-[5px]"
        ref={useSceneNode('hint')}
        aria-hidden="true"
      >
        <span>Keep scrolling</span>
        <span className="grid animate-cue place-items-center">
          <svg width="15" height="15" viewBox="0 0 24 24">
            <path
              d="M5 9l7 7 7-7"
              fill="none"
              stroke="#F2C14E"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <div
        className="pointer-events-none fixed inset-0 z-[90] bg-sea opacity-0"
        ref={useSceneNode('loopVeil')}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none fixed inset-0 z-[92] overflow-hidden opacity-0"
        ref={useSceneNode('dive')}
        aria-hidden="true"
      >
        <div
          className="absolute -inset-x-[10%] top-0 h-[60vh] bg-[linear-gradient(180deg,rgba(120,205,235,.34)_0%,rgba(120,205,235,.16)_45%,transparent_100%)] opacity-0 [transform:translateY(-62vh)]"
          ref={useSceneNode('diveSurface')}
        />
        <div className="absolute inset-0" ref={useSceneNode('diveStreaks')} />
      </div>
    </>
  );
}
