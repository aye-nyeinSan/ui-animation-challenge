import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, CustomEase);

ScrollTrigger.defaults({ markers: false });

export const EASE = {
  pop: CustomEase.create('kkPop', 'M0,0 C0.34,1.56 0.64,1 1,1'),
  settle: CustomEase.create('kkSettle', 'M0,0 C0.22,1 0.36,1 1,1'),
  scrub: 'power2.inOut',
} as const;

export { gsap, ScrollTrigger };
