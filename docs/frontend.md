# Front end

How the page is built and why. The texts are in `src/content/site.ts`; the tokens and shared styles in
`src/styles/global.css`; each section's layout in the `<style>` block of its component in `src/components/`.

## Look

A small-batch gelateria rather than a template: a cream page (`--color-cream`), cocoa text, one raspberry accent and a
colour per flavour that takes over the cone scene while it is current. Headings are **Fraunces** (variable, with its
`SOFT` axis at 100 for rounded, creamy letterforms; italic for the accent word), body text is **DM Sans**. Both are
self-hosted through `@fontsource-variable`, with `font-display: swap`. A faint paper grain lies over the page
(`body::after`, 5 % opacity, never takes clicks).

| Token                                         | Value                | Use                                     |
| --------------------------------------------- | -------------------- | --------------------------------------- |
| `--color-cream`, `--color-cream-deep`         | `#fff8f1`, `#fbeee0` | page and alternate sections             |
| `--color-cocoa`, `--color-cocoa-soft`         | `#2a1a1f`, `#6b5560` | text and secondary text                 |
| `--color-raspberry`, `--color-raspberry-deep` | `#d31342`, `#a30f33` | buttons, accent word, eyebrows          |
| `--color-blush`, `--color-candy`              | `#ffd3dd`, `#ff9db4` | tints; accent on the dark band          |
| flavour colours                               | in `site.ts`         | the cone scene background, review tints |

There is one palette and no theme switch: the brand is its flavour colours. The axe test runs in the light and the dark
colour scheme anyway, so a dark mode added later is checked from day one.

## Contrast (WCAG 2.2 AA)

Measured with the WCAG formula; every pair used for text is above 4.5:1.

| Pair                                              | Ratio                  |
| ------------------------------------------------- | ---------------------- |
| cocoa on cream                                    | 15.76:1                |
| cocoa-soft on cream                               | 6.45:1                 |
| raspberry on cream                                | 5.06:1                 |
| raspberry-deep on cream                           | 7.46:1                 |
| white on raspberry (buttons)                      | 5.33:1                 |
| cream on cocoa (dark band, footer)                | 15.76:1                |
| candy on cocoa (numbers, footer accent)           | 8.48:1                 |
| cocoa-soft on the raspberry / caramel / mint tint | 5.05:1, 5.18:1, 5.45:1 |
| raspberry-deep on the pistachio tint              | 6.34:1                 |
| food-truck chip `#7a4100` on `#ffe7c2`            | 6.76:1                 |

A colour change needs the pair measured again; `pnpm test:e2e` fails on any axe contrast violation.

## Motion

- The `motion` class is set on `<html>` by a tiny inline script **before the first paint**, only when
  `prefers-reduced-motion` is `no-preference`. Every scroll layout (the tall, pinned cone track, the drifting ingredient
  rows) is written under `.motion`; without it the same content is a plain, complete layout.
- `src/scripts/motion.ts` (GSAP, ScrollTrigger, Lenis) is imported by `main.ts` when the browser is idle, so it never
  delays the first paint. If it fails to load, `motion` is removed and the plain layout comes back.
- **Cone scene:** the track is `steps × 70svh + 100svh` tall and the stage sticks. The scroll progress picks the
  frame of the rendered sequence drawn on a canvas (`frameAt`) and the current scoop (`stepAt`, both unit-tested in
  `src/lib/steps.ts`); the scoops fall, squash and settle in the render itself, and the background moves to the
  flavour's colour.
- **Menu:** the cards stack with CSS `position: sticky` (no script); with motion a card sinks back to 93 % while the
  next one slides over it.
- **Story, reviews, shops:** a rail fills while the steps are read; cards rise in once.
- **Numbers:** count up once; the ingredient rows move only with the scroll, never by themselves.
- Smooth scrolling (Lenis) leaves touch scrolling native and stays out of open dialogs. In-page links glide to their
  section and give it the focus.
- Nothing moves by itself for more than 5 s (the hero's scroll cue nudges three times), nothing flashes.

## Accessibility decisions

- Landmarks (`header`, two named `nav`s, `main#main`, `footer`), one `h1`, headings in order, `aria-labelledby` on every
  section, a skip link.
- A 3 px focus ring (`--focus`: cocoa on light sections, cream on the dark ones).
- Native `<dialog>` with `showModal()` for the phone menu, the product details and the map: the focus moves in, stays
  inside, Escape closes, the focus returns to the opener.
- The phone menu button and every main action are at least 44 × 44 px.
- The reviews row scrolls sideways on a phone; it is focusable and named, so a keyboard can scroll it.
- Google Maps is an `<iframe>` created only after "Show … on the map" is pressed, and removed when the dialog closes.
- Links that open a new tab (social) say so in their name.

## Performance decisions

- Static HTML from Astro, no client framework. `main.ts` is a few kilobytes; GSAP and Lenis load after the first paint.
- Images go through `astro:assets`: WebP in a few widths with hashed names, `width` and `height` set; the hero cone is
  `loading="eager"` and `fetchpriority="high"`, everything else is lazy.
- Fonts: two variable files per family at most, the subsets the text needs.

## Graphics

The cone, its frame sequence and the three products are rendered in Blender 5.2 from code, in
`blender-projects/gelato-brand-website` (`build_cone.py`, `render_products.py`; see that folder's README). The site holds
only the finished files:

| File                               | What                                                                        | Made by                        |
| ---------------------------------- | --------------------------------------------------------------------------- | ------------------------------ |
| `public/cone/desktop/f_01…96.webp` | the cone scene, 96 frames, 450 × 900 with alpha (about 1.25 MB in all)      | `scripts/cone-frames.mjs`      |
| `public/cone/mobile/f_01…96.webp`  | the same at 300 × 600 for screens under 1024 px (about 0.75 MB)             | `scripts/cone-frames.mjs`      |
| `src/assets/hero/cone.png`         | the finished cone, trimmed, 1400 px tall: hero and the static cone scene    | `scripts/cone-frames.mjs`      |
| `src/assets/menu/*.png`            | cup of ice cream, iced coffee, milkshake (1000 px, alpha)                   | `render_products.py`           |
| `public/brand/velluto-logo*.svg`   | the logo lockup with the word outlined (dark and light), and the mark alone | Fraunces 700, SOFT 100, WONK 1 |
| `public/og.jpg`                    | the Open Graph image (1200 × 630) with the rendered cone                    | sharp, by hand                 |

The frames are fetched only when the cone scene comes within one and a half screens, the first, the last and every
eighth frame first (`loadOrder` in `src/lib/steps.ts`), four at a time; until a frame is in, its nearest loaded
neighbour is drawn. Without motion the page never loads them.

To change the cone: edit the Blender scripts, render the frames and the still, then from this repo
`node scripts/cone-frames.mjs <frames folder> <cone-still.png>`.
