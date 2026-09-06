import { useSceneNode } from '../scene/sceneNodes';
import { HeroOrnaments } from './HeroOrnaments';
import burger from '../assets/burger.webp';
import burst from '../assets/burst.webp';
import diner from '../assets/diner.webp';

const TITLE_LINES = ['The Best', 'Burger', 'in Bikini Bottom'] as const;

export function Hero() {
  return (
    <section className="relative h-[440vh]" id="top" ref={useSceneNode('hero')}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0" ref={useSceneNode('heroBgParallax')}>
          <img
            className="absolute -left-[1%] -top-[1%] h-[102%] w-[102%] max-w-none origin-[50%_40%] object-cover object-[50%_100%]"
            ref={useSceneNode('heroBg')}
            src={diner}
            alt=""
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="scrim-hero-x pointer-events-none absolute inset-0" />
        <div className="scrim-hero-y pointer-events-none absolute inset-0" />
        <div className="caustic animate-drift-a absolute -left-[8%] -top-[10%] size-[min(60vw,620px)] bg-[radial-gradient(circle,rgba(255,246,229,0.22),transparent_65%)] blur-[24px] [--drift-dur:24s]" />
        <div className="caustic animate-drift-b absolute -bottom-[14%] -right-[12%] size-[min(56vw,560px)] bg-[radial-gradient(circle,rgba(255,246,229,0.18),transparent_65%)] blur-[24px] [--drift-dur:29s]" />

        <div className="absolute inset-0 bg-[#2a5fe6] opacity-0" ref={useSceneNode('burst')}>
          <img
            className="absolute left-1/2 top-[46%] size-[max(160vw,160vh)] max-w-none animate-turn object-cover [margin:calc(max(160vw,160vh)/-2)_0_0_calc(max(160vw,160vh)/-2)] [transform-origin:50%_50%]"
            src={burst}
            alt=""
          />
        </div>

        <div
          className="absolute inset-x-0 top-[clamp(96px,14vh,150px)] px-[clamp(20px,6vw,80px)] text-left max-[899px]:text-center"
          ref={useSceneNode('beatA')}
        >
          <div className="inline-block max-w-[min(620px,50vw)] text-[inherit] max-[899px]:max-w-[620px]">
            <h1 className="m-0 font-display text-[clamp(40px,min(6.4vw,8vh),100px)] font-normal leading-[1.12] tracking-[0.005em] [text-shadow:5px_5px_0_var(--color-ink)]">
              {TITLE_LINES.map((line, i) => (
                <span className="block overflow-hidden pb-[0.06em] pt-[0.1em]" key={line}>
                  <HeroTitleLine index={i as 0 | 1 | 2} accent={i === 1}>
                    {line}
                  </HeroTitleLine>
                </span>
              ))}
            </h1>
            <p
              className="mt-[18px] max-w-[46ch] text-[clamp(15px,min(1.4vw,2.6vh),20px)] font-semibold leading-normal opacity-0 text-pretty [transform:translateY(24px)]"
              ref={useSceneNode('sub')}
            >
              Flame-grilled two fathoms down and served with a side of sea foam. One secret recipe, zero
              substitutions, no refunds.
            </p>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-[clamp(20px,5vh,56px)] px-[clamp(20px,6vw,80px)] text-center opacity-0"
          ref={useSceneNode('beatB')}
        >
          <div className="inline-block max-w-[900px]">
            <div className="mb-2.5 text-[clamp(11px,1.1vw,13px)] font-extrabold uppercase tracking-[0.26em] text-cream [text-shadow:0_2px_0_var(--color-ink)]">
              Now serving
            </div>
            <h2 className="text-outline m-0 font-display text-[clamp(48px,min(9vw,13vh),136px)] font-normal leading-[0.9] tracking-[0.01em] text-gold [text-shadow:6px_6px_0_var(--color-ink),0_0_40px_rgba(255,255,255,0.55)]">
              Krabby Patty
            </h2>
            <p className="mx-auto mt-3.5 max-w-[44ch] text-[clamp(14px,1.3vw,19px)] font-extrabold leading-normal text-cream [text-shadow:0_2px_0_var(--color-ink)]">
              The original. Two dollars. One secret formula, locked in a safe, inside a safe.
            </p>
          </div>
        </div>

        <div
          className="absolute left-[38%] top-[82%] aspect-[494/454] w-[clamp(180px,26vw,360px)] -translate-x-1/2 -translate-y-1/2"
          ref={useSceneNode('burgerWrap')}
        >
          <div
            className="absolute inset-0 origin-center"
            ref={useSceneNode('burgerScale')}
          >
            <div className="absolute inset-0" ref={useSceneNode('burgerParallax')}>
              <div
                className="absolute inset-0 opacity-0 [transform:scale(0.55)_translateY(50px)]"
                ref={useSceneNode('burgerEnter')}
              >
                <div className="size-full animate-bob">
                  <img
                    className="block size-full object-contain drop-shadow-[0_18px_22px_rgba(18,48,63,0.45)]"
                    src={burger}
                    alt="Krabby Patty"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <HeroOrnaments />

        <div
          className="pointer-events-none absolute bottom-[26px] left-[clamp(20px,6vw,80px)] flex flex-col items-center gap-1 text-[11px] font-extrabold uppercase tracking-[0.24em] opacity-0"
          ref={useSceneNode('cue')}
          aria-hidden="true"
        >
          <span>Scroll down</span>
          <div className="animate-cue">
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path
                d="M5 9l7 7 7-7"
                fill="none"
                stroke="#FFF6E5"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroTitleLine({
  index,
  accent,
  children,
}: {
  index: 0 | 1 | 2;
  accent: boolean;
  children: string;
}) {
  return (
    <span

      className={`block [clip-path:inset(0_0_var(--line-clip,100%)_0)] [transform:translateY(110%)]${accent ? ' text-gold' : ''}`}
      ref={useSceneNode<HTMLSpanElement>(`line${index}`)}
    >
      {children}
    </span>
  );
}
