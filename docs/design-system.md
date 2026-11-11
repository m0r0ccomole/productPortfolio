# Design system

How design decisions are organized so a redesign edits **tokens**, not pages. If you are changing how the site *looks* (not what it *says*), you are in redesign mode — start here.

## Token map

Design tokens have one home each. Colors and gradients live in `content/theme.js`, which `tailwind.config.js` reads at build time. Shadows, keyframes and timing curves live in `tailwind.config.js`; motion timing in `lib/motion.ts`. `styles/globals.css` holds only behavior.

The palette sits in `content/` (the site owner's folder) rather than in `tailwind.config.js` so that recoloring a site never conflicts with upstream changes to the Tailwind config. This is a file location, not a theme system: there is still one palette, compiled at build time.

| Token | Where it lives | Used via |
|---|---|---|
| Color — `primary`, `accent` (50–900) | `content/theme.js` `colors` | `bg-primary-500`, `text-accent-700`, etc. |
| Gradients | `content/theme.js` `gradients` | `bg-gradient-primary` / `-accent` / `-warning` / `-success` |
| Shadows | `tailwind.config.js` boxShadow | `shadow-float`, `shadow-float-hover` |
| Float keyframe | `tailwind.config.js` animation/keyframes | `animate-float` |
| Smooth transition | `tailwind.config.js` transitionTimingFunction/Duration | `ease-smooth`, `duration-smooth` |
| Focus-outline color | `styles/globals.css` (`*:focus`) | Resolves `primary-400` via `theme(colors.primary.400)`; recolors automatically |
| Behaviors (skip-link, `.floating-element`, reduced-motion, resets) | `styles/globals.css` | Global |

No brand hex is hardcoded outside `content/theme.js`. Recoloring the palette recolors the whole site, including the focus outline.

## Motion vocabulary

All animation comes from **`lib/motion.ts`**. Five patterns cover the site. Retune the constants there; don't reintroduce inline `initial/animate/transition` literals.

| Token | When to use |
|---|---|
| `fadeUp` | Hero text, section headings, single-shot reveals |
| `fadeUpStagger(i)` | Grid items, lists, sequential reveals (index from 0) |
| `slideInLeft(i)` | Supporting copy, bullet lists beside a hero |
| `carouselSlide` | Testimonial slides, horizontal transitions |
| `hoverScale` | Button / card micro-interactions |

Plus `MOTION_DURATION` (`fast` 0.2 / `base` 0.5 / `medium` 0.6 / `slow` 0.8) and `MOTION_STAGGER` (0.2). Four animations that don't fit any token stay inline and are marked with a `// MOTION:` comment (Navigation underline + mobile menu, Testimonials conditional carousel, IndustryLanding skills grid).

## Bespoke vs templated

Two first-class ways to build a page. Neither is a fallback.

- **Templated** — a data-driven renderer in `components/templates/` (`DeepDive`, `IndustryLanding`, `BlogPost`) takes a typed content object and produces a full page. Add content to XML; the template renders it. Use when the shape already exists.
- **Bespoke** — hand-written one-off layout (the homepage, about, projects, hello). Layout JSX is unique to the page; **strings still come from `/content/`**. Use when the layout is genuinely one-off.

> Every theme and template system falls apart because every real use case has something unique. So one-off hardcoding of *layout* is supported and expected — but it plays by the rules: content stays in XML, colors stay tokenized, motion stays in `lib/motion.ts`. `pages/index.tsx` is the canonical bespoke example; copy it when you need another.

## Role comment legend

Every restyleable file opens with a five-line `// ROLE:` header. Grep `// ROLE:` to enumerate them.

| Role | Meaning |
|---|---|
| `bespoke page` | One-off layout; strings from XML |
| `template` | Data-driven page renderer; no JSX slot props |
| `building block` | Reusable prop-driven UI fragment; no content fetching |
| `primitive` | Visual-only, content-unaware (`FloatingButton`, `lib/motion.ts`) |

Header fields: `PURPOSE`, `CONTENT` (where its strings come from), `SAFE TO RESTYLE`, `DO NOT`. A `NOTE:` line flags any residual inline copy still to be externalized; keep those in sync with `docs/todo.md`.

## Where to make a redesign change

| Goal | Change |
|---|---|
| Recolor the whole site | `content/theme.js` colors (ten shades each of `primary` and `accent`) |
| Tweak gradients | `content/theme.js` gradients |
| Tweak shadows / keyframes | `tailwind.config.js` |
| Change motion timing / feel | `lib/motion.ts` (retune constants — don't add variants) |
| Change a heading or body copy | `/content/*.xml` — this is content mode, not redesign |
| Restructure a one-off section | Bespoke page JSX (read its `// ROLE:` header) |
| Add a new repeated page shape | New template in `components/templates/` |
| Add a new one-off page | Copy `pages/index.tsx` |
