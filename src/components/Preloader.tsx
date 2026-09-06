import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useSceneNode } from '../scene/sceneNodes';
import { BubbleField } from './BubbleField';
import burgerLoader from '../assets/burger-loader.json?url';

export function Preloader({ isMobile }: { isMobile: boolean }) {
  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" ref={useSceneNode('pre')} aria-hidden="true">
      <div
        className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-sea to-sea-mid"
        ref={useSceneNode('preHalfTop')}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-b from-sea-mid to-sea-bright"
        ref={useSceneNode('preHalfBot')}
      />

      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-[26px] overflow-hidden"
        ref={useSceneNode('preContent')}
      >
        <div className="pointer-events-none absolute inset-0">
          <BubbleField isMobile={isMobile} />
        </div>

        <div className="relative my-[clamp(-70px,-6vh,-40px)] grid aspect-square w-[clamp(300px,52vw,560px)] place-items-center drop-shadow-[0_14px_18px_rgba(18,48,63,0.4)]">
          <DotLottieReact src={burgerLoader} autoplay loop />
        </div>

        <div className="relative flex flex-col items-center gap-3">
          <div
            className="font-display text-[clamp(40px,6vw,64px)] leading-none [text-shadow:4px_4px_0_var(--color-ink)]"
            ref={useSceneNode('preCounter')}
          >
            0%
          </div>
          <div className="h-3.5 w-[clamp(180px,30vw,300px)] overflow-hidden rounded-full border-[3px] border-ink bg-ink/35">
            <div className="size-full origin-left bg-gold [transform:scaleX(0)]" ref={useSceneNode('preBar')} />
          </div>
          <div className="text-xs font-extrabold uppercase tracking-[0.22em] opacity-90">
            Descending to the sea floor
          </div>
        </div>
      </div>
    </div>
  );
}
