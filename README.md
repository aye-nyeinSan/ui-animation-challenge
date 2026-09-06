# The Krusty Krab — landing page

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # tsc -b && vite build
npm run typecheck    # tsc -b
npm run lint         # oxlint
```

## How it works

The page is one long scroll with five scenes. Most of the motion is *scrubbed* —
tied to scroll position rather than played on a timer.

1. **Preloader** — a Lottie burger and a fake progress bar, exiting through a
   split curtain and a dive-through-water transition.
2. **Hero** (`440vh`, sticky stage) — the headline clears out, a burst wipes in,
   the product name lands, and the patty lifts off the plate into an
   "advertisement" pose.
3. **Menu** (height computed at runtime) — vertical scroll scrubs the board
   sideways. The hero patty flies out of its pose and lands in the first card.
4. **Sides / Checkout** — cards reveal on intersection and tilt toward the
   pointer. Whatever is in the order tray flies into the register and prints as
   a receipt.
5. **Find us** — the shop settles into frame and the address card flips to a
   thank-you. Hitting the bottom loops you back to the top through another dive,
   so the page never ends.

### Architecture

```
src/
├─ motion.ts               Every timing and distance, lifted from the design source
├─ types.ts                Product shapes
├─ data/menu.ts            The nine patties and five sides, with their image imports
├─ order/                  Order state: reducer, selectors, context, add-to-order handler
├─ scene/
│  ├─ gsapSetup.ts         Plugin registration and the design's two signature eases
│  ├─ layout.ts            Pure geometry — where the patty sits, how long the board runs
│  └─ useSceneMotion.ts    Every timeline and ScrollTrigger on the page
├─ hooks/                  Media flags, pointer tilt
├─ components/             One file per scene, styled with Tailwind utilities
└─ styles/app.css          Theme tokens, keyframes and a few named utilities
```
Order state is ordinary React (`useReducer` + context) and re-renders normally.

### Performance

Scroll work is kept off the layout path. Every box the per-frame paints need —
the tray's resting rect, the register's document offset, the Classic disc's
pinned position — is measured once in `measure()` on ScrollTrigger's
`refreshInit`, so no frame reads `getBoundingClientRect`. The frames themselves
write only `transform`, `opacity` and `clip-path`, through `gsap.quickSetter`
rather than allocating a tween per call. The flying patty is scaled about its
centre rather than resized, since `width` is a layout property.

Art is WebP (10.5 MB of PNG became 0.81 MB, ~92% smaller). Only the hero
backdrop is eager, with `fetchpriority="high"`; the four section photographs and
the side thumbnails are `loading="lazy"`. The nine menu discs are deliberately
*not* lazy — they sit in a horizontally-scrubbed track, so the viewport
intersection test would pop them in mid-slide.

The preloader gates on real decoding: its timer runs the readout to 90 and then
waits for every eager image, capped at 8s so a broken asset can never trap you.

Order state has exactly one subscriber near the leaves (`OrderMotionBridge`), so
adding an item re-renders the tray and the receipt rather than the whole page.

`will-change` is driven by the GSAP lifecycle rather than declared in the markup.
Each promoted element holds a texture of width x height x 4 bytes x dpr², so a
full-viewport layer costs ~12 MB on a 3x phone and the menu track ~35 MB. The
hint is applied in a trigger's `onToggle` or a tween's `onStart`, and dropped
again on `onComplete` or when the section goes inactive. Only two elements keep
it permanently: the marquee, which never stops, and the bubble cursor, which
follows every mousemove.

### Accessibility and motion

`prefers-reduced-motion: reduce` disables every CSS animation and short-circuits
the engine: it sets the finished state of every entrance, builds no ScrollTriggers
at all, skips the preloader, and shows the receipt fully printed. The custom bubble cursor only engages for fine pointers on non-touch, non-reduced-motion desktops. Order controls are real `<button>`s with
labels — the delegated click handlers on the card containers are an optimisation,
not the accessible path.

### Dev query parameters

| Parameter | Effect |
| --- | --- |
| `?skipPreloader=1` | Land straight on the hero |
| `?parallaxStrength=0` | Disable pointer parallax |
| `?bubbleCursor=0` | Restore the system cursor |




