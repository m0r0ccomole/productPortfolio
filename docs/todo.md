# Project TODO

Known open work on this project. Check items off or add to the list as work happens; don't let debt live only in commit messages or chat history.

Related: a `NOTE:` line in a file's `// ROLE:` header is the file-local version of an entry here. Keep both in sync when an item is resolved.

## Content/design separation

Goal: a site owner fills in `content/` and `content/theme.js` without touching `/components/` or `/pages/`.

Done: the generic UI labels that were inline in JSX now live in `<ui-labels>` in `global-elements.xml` and in per-page `<labels>` in `pages.xml`, with defaults read from `sample/content`. See `content-authoring.md`. Still open:

- [ ] `components/templates/IndustryLanding.tsx`: `generateIndustryCTA` hardcodes CTA button text and email subjects for four industry keys (`fintech`, `consumer`, `iot`, `platform`) plus a generic default. This is per-industry copy, so it belongs in `industry-pages.xml` as optional per-page fields, with `<cta-content>` in `global-elements.xml` as the default. Moving it changes what existing sites render, so it needs a decision first.
- [ ] Dates are formatted for `en-US` in code (`components/BlogPostCard.tsx`, `components/templates/BlogPost.tsx`, `components/FreshnessIndicator.tsx`, `pages/privacy.tsx`), and `<Html lang="en">` is fixed in `pages/_document.tsx`. A site in another language needs a locale setting.

## Lint warnings (non-blocking)

- [ ] `@next/next/no-img-element` in the image components. `next/image` needs a loader under static export; `<img>` is intentional for now.
- [ ] `@next/next/next-script-for-ga` in `pages/_document.tsx`. Consider `@next/third-parties/google` for GTM.
