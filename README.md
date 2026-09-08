# The Krusty Krab (landing page)

Demo: [https://ui-animation-challenge-sage.vercel.app/](https://ui-animation-challenge-sage.vercel.app/)

Repo: [https://ui-animation-challenge-sage.vercel.app/](https://github.com/aye-nyeinSan/ui-animation-challenge/)
### How to Setup

```bash
npm install
npm run dev
npm run build        # tsc -b && vite build
npm run typecheck    # tsc -b
npm run lint         # oxlint
```

## How it works and which slides I've implemented

The page is one long scroll with five scenes. Most of the motion is *scrubbed*,
meaning it is tied to scroll position rather than played on a timer.

1. **Preloader**: a Lottie burger and a fake progress bar, exiting through a
   split curtain and a dive-through-water transition.
2. **Hero**: the headline clears out, a burst wipes in, the product name lands,
   and the patty lifts off the plate into an "advertisement" pose.
3. **Menu**: vertical scroll scrubs the board sideways. The hero patty flies out
   of its pose and lands in the menu board's first card.
4. **Sides / Checkout**: cards reveal on intersection and tilt toward the
   pointer. Whatever is in the order tray flies into the register and prints as
   a receipt. Clicking the "Place Order" button stamps it "PAID".
5. **Find us**: the shop settles into frame and the address card flips to a
   thank-you. Hitting the bottom loops you back to the top through another dive,
   so the page never ends.

### Architecture

```
src/
├─ motion.ts               Every timing and distance, lifted from the design source
├─ types.ts                Product shapes
├─ constants/menu.ts       The nine patties and five sides, with their image imports
├─ order/                  Order state: reducer, selectors, context, add-to-order handler
├─ scene/
│  ├─ gsapSetup.ts         Plugin registration and the design's two signature eases
│  ├─ layout.ts            Pure geometry: where the patty sits, how long the board runs
│  └─ useSceneMotion.ts    Every timeline and ScrollTrigger on the page
├─ hooks/                  Media flags, pointer tilt
├─ components/             One file per scene, styled with Tailwind utilities
└─ styles/app.css          Theme tokens, keyframes and a few named utilities
```
Order state is ordinary React (`useReducer` + context) and re-renders normally.

### Libraries chosen and why

Loading animation: I used a Lottie file for the preloader burger. A vector loop
at that complexity is smaller and sharper as Lottie than as a sprite sheet or a
video.

Scroll trigger animation: I used the GSAP library and its plugins (ScrollTrigger,
ScrollToPlugin, CustomEase) over Framer Motion. Framer Motion is excellent for
component enter and exit, but this page's motion is one continuous scroll-driven
scene rather than a set of per-component state transitions.

### Approach to animation, smooth scroll, and responsiveness

GSAP handles everything scroll-bound or measured, all in `useSceneMotion.ts`:
eight scrubbed timelines, the preloader, the hero entrance, three `once: true`
reveals, the two cross-section handoffs, parallax, the bubble cursor, and the
receipt print.

### Performance

- GSAP handles the motion CSS can't: animations whose start and end points only
  exist once the page has laid out, which in this code means the patty flying
  from the hero into a menu card and the tray landing in the register, plus
  anything tied to scroll position instead of a timer. ScrollTrigger drives that
  scrubbing and gives one place to re-measure on resize, which keeps layout reads
  out of the per-frame code.
- Image files are in WebP, which took 10.5 MB of PNG down to 0.81 MB (about 92%
  smaller).
- The hero backdrop loads eagerly with `fetchpriority="high"` since it's the
  first thing on screen, and the section photos and side thumbnails use
  `loading="lazy"`. The nine menu discs are the exception: they sit in a track
  that scrubs sideways, so the browser would judge them off-screen and pop them
  in mid-slide.
- The preloader waits for real decoding. The readout counts to 90 on a timer,
  then holds until every eager image has loaded, with an 8 second cap so a broken
  image can't leave you stuck. If loading succeeds after that 8s cap, the hero
  image pops in and `ScrollTrigger.refresh()` runs.
- Order state has one subscriber near the leaves (`OrderMotionBridge`). Adding an
  item re-renders the tray and the receipt, not the whole page.
- `will-change` is set by the GSAP lifecycle, because each promoted layer costs
  real memory, around 12 MB for a full-viewport element on mobile. It goes on
  when an animation starts and comes off when it ends, except on the marquee and
  the bubble cursor, which never stop.

### Assumptions made

- There is no backend and nothing is persisted. Order state lives in memory and
  resets on reload, and checkout doesn't charge anything.
- The Krusty Krab is a portfolio piece, not something shippable.
- Everything is either mobile or desktop. Tablets get the desktop layout. Mobile
  mostly reuses the desktop scenes with lighter effect counts and a shorter menu
  run, with one real exception: the patty flies to the centre of the screen
  rather than into the first menu card, since the card is too small to land in on
  a phone.
- **Scrolling is the only navigation.** Anchors scroll instead of routing, so
  there is no URL state and no way to link to a section. Reaching the bottom
  loops back to the top, so the page has no end on purpose.
- **Pointer devices get extras, touch gets the base experience.** The bubble
  cursor and card tilt are behind `hover: hover` and `pointer: fine`. Touch users
  get the same scenes without them, and that was treated as acceptable rather
  than something needing a touch equivalent.
- **Fonts load from Google Fonts.** Lilita One and Nunito come from a CDN with
  `display=swap`, so the first paint can show a fallback face.

## Accessibility and motion

`prefers-reduced-motion: reduce` disables every CSS animation and short-circuits
the engine: it sets the finished state of every entrance, builds no ScrollTriggers
at all, skips the preloader, and shows the receipt fully printed. The custom
bubble cursor only engages for fine pointers on non-touch, non-reduced-motion
desktops. Order controls are real `<button>`s with labels, and the delegated
click handlers on the card containers are an optimisation rather than the
accessible path.

### Dev query parameters

| Parameter | Effect |
| --- | --- |
| `?skipPreloader=1` | Land straight on the hero |
| `?parallaxStrength=0` | Disable pointer parallax |
| `?bubbleCursor=0` | Restore the system cursor |
