import { useSceneNode } from '../scene/sceneNodes';
import { BubbleField } from './BubbleField';
import street from '../assets/street.webp';

const DETAILS = [
  { label: 'Low tide to last bubble', value: 'Daily' },
  { label: 'Two doors past the anchor', value: 'Walk-ins' },
  { label: 'Boatmobile parking', value: 'Out back' },
] as const;

const FACE =
  'rounded-[26px] border-4 border-ink bg-cream text-ink shadow-[0_8px_0_var(--color-ink)] backface-hidden';

export function FindUsSection({ isMobile }: { isMobile: boolean }) {
  return (
    <section className="relative -mt-[14vh] h-[320vh]" id="find" ref={useSceneNode('find')}>
      <div className="sticky top-0 z-[2] h-screen overflow-hidden bg-linear-to-b from-[#57C5E8] from-0% via-[#2FA9D6] via-55% to-[#1B7FA8] to-100%">
        <div
          className="absolute -inset-x-[4%] -bottom-[6%] -top-[22%]"
          ref={useSceneNode('streetParallax')}
        >
          <div className="size-full" ref={useSceneNode('streetRise')}>
            <img
              className="photo-mask-top size-full object-cover object-[50%_70%]"
              src={street}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div className="band-find-top pointer-events-none absolute inset-x-0 top-0 z-[1] h-[26vh]" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <BubbleField isMobile={isMobile} />
        </div>
        <div className="scrim-find pointer-events-none absolute inset-0" />

        <div
          className="absolute inset-x-0 top-[clamp(76px,11vh,120px)] z-[2] px-[clamp(20px,6vw,80px)] text-center opacity-0"
          ref={useSceneNode('findHead')}
        >
          <div className="mb-2.5 text-[clamp(11px,1.1vw,13px)] font-extrabold uppercase tracking-[0.26em] text-cream [text-shadow:0_2px_0_var(--color-ink)]">
            Where to find us
          </div>
          <h2 className="m-0 font-display text-[clamp(38px,min(7vw,10vh),104px)] font-normal leading-[0.92] text-gold [text-shadow:5px_5px_0_var(--color-ink)]">
            Bikini Bottom
          </h2>
        </div>

        <div
          className="absolute left-1/2 top-1/2 z-[3] w-[min(380px,84vw)] opacity-0 [perspective:1200px]"
          ref={useSceneNode('findCard')}
        >
          <div className="relative transform-3d" ref={useSceneNode('findFlip')}>
            <div
              className={`${FACE} pointer-events-none absolute left-0 top-0 flex size-full [transform:rotateY(180deg)] flex-col items-center justify-center gap-2.5 p-[clamp(20px,2.6vw,30px)] text-center`}
            >
              <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-brick">Order up</div>
              <div className="font-display text-[clamp(28px,3vw,40px)] leading-[1.02] text-balance">
                Thank you for ordering.
              </div>
              <div className="text-sm font-bold leading-[1.45] opacity-75 text-pretty">
                Keep scrolling &mdash; the tide takes you back up.
              </div>
            </div>

            <div className={`${FACE} relative p-[clamp(18px,2.2vw,26px)]`}>
              <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-brick">The Krusty Krab</div>
              <div className="mb-3.5 mt-2 font-display text-[clamp(24px,2.4vw,32px)] leading-[1.05]">
                831 Bottom Feeder Lane
              </div>
              <div className="grid gap-2.5 text-[15px] font-bold leading-snug">
                {DETAILS.map((detail) => (
                  <div
                    className="flex justify-between gap-4 border-t-[3px] border-ink/15 pt-2.5"
                    key={detail.label}
                  >
                    <span>{detail.label}</span>
                    <span className="text-brick">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
