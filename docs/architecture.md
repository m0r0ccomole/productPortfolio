# Architecture

How the site is put together. Read this once; return to the subsystem table below when you need to orient on a specific feature.

## Stack

- **Framework**: Next.js 16 (pages router) with static export (`next build` → `/out/`)
- **Language**: TypeScript, strict mode
- **Styling**: Tailwind CSS 4, configured through `tailwind.config.js` (loaded with `@config` in `styles/globals.css`); palette in `content/theme.js`
- **Animation**: the `motion` package (`motion/react`) for reveals and metric animations, CSS for simpler transitions
- **Content parsing**: `xml2js` for XML, `gray-matter` + `remark` for blog markdown
- **Runtime**: Node 24
- **Hosting**: Netlify (config in `netlify.toml`)

## Content pipeline

```
content/*.xml  +  content/blog-markdown/*.md      (falls back to sample/content/ when content/ is missing)
        │
        ▼
lib/contentParser.ts  +  lib/markdownProcessor.ts
        │
        ▼
lib/types.ts  (shared TypeScript interfaces)
        │
        ▼
components/  +  components/templates/  +  pages/
```

All content is parsed at build time. There is no runtime content fetching. Adding a new content field means: update type → update parser → add to XML (yours and the sample) → consume in component.

### Content root

`lib/contentParser.ts` resolves every content path through `contentPath()`. If a `content/` folder exists at the repo root it is used; otherwise the parser reads `sample/content/` and logs a one-time warning. `tailwind.config.js` does the same for `theme.js`. This is what lets the upstream repo ship without anyone's real content while a fresh copy still builds.

## Component architecture

- **Templates** (`components/templates/`): large page-shape components that take parsed content and render a full page body. Three exist: `IndustryLanding`, `DeepDive`, `BlogPost`. Prefer extending these over adding new templates.
- **Atomic components** (`components/`): small, composable pieces (buttons, cards, images, metrics, navigation). They accept content fragments as props rather than fetching anything.
- **Pages** (`pages/`): Next.js entry points that call the parser in `getStaticProps`, pass content to a template or bespoke layout, and handle dynamic routing (`resume/[industry]`, `deep-dives/[id]`, `blog/[slug]`).
- **Layout** (`components/Layout.tsx`): wraps every page. Builds `<head>` meta from `GlobalContent` (owner name, site URL, SEO defaults, per-page titles via the `metaKey` prop), renders navigation and footer, and injects Microsoft Clarity when configured.

## Types

Everything content-side flows through interfaces in `lib/types.ts`:

- `GlobalContent`: owner name, site URL, contact email, scheduling link, navigation, CTA strings, global images, SEO defaults and per-page meta
- `PageContent`, `IndustryPageContent`, `DeepDiveContent`, `BlogPost`: page-level shapes
- `Testimonial`, `ProductCard`, `CTAContent`, `CodeBlock`, `CommentBlock`: reusable fragments
- `GlobalImages`: headshot, favicon, social share image

**When adding a field, update `types.ts` first.** The parser and consumers will fail to compile until they match.

## Subsystem → files map

Orientation aid, not a checklist. Grep is authoritative for "what references X."

| Subsystem | Primary files | Notes |
|---|---|---|
| Content parsing | `lib/contentParser.ts`, `lib/types.ts`, `content/*.xml` | Types first, then parser, then consumers. |
| Markdown + prompts | `lib/markdownProcessor.ts`, `lib/copyToClipboard.ts`, `components/BlogContent.tsx`, `components/PromptBlock.tsx`, `content/blog-markdown/` | Preserve `:::prompt` and `{{comment: …}}` syntax exactly. |
| Navigation + layout + SEO | `components/Layout.tsx`, `components/Navigation.tsx`, `components/Headshot.tsx`, `content/global-elements.xml` | Page titles/descriptions come from `<seo>` in global-elements, looked up by `metaKey`. |
| Images | `components/Headshot.tsx`, `components/HeroImage.tsx`, `components/CaseStudyImage.tsx`, `public/images/` | Image components fall back gracefully when a file is missing. |
| Industry landing pages | `pages/resume/[industry].tsx`, `components/templates/IndustryLanding.tsx`, `content/industry-pages.xml` | One page per `<page id>`; routes are generated from the XML. |
| Deep dives (case studies + product briefs) | `pages/deep-dives/[id].tsx`, `pages/deep-dives/index.tsx`, `components/templates/DeepDive.tsx`, `content/deep-dives.xml` | `type="case-study"` (default) vs `type="product-brief"`; `listed="true/false"` controls index visibility. |
| Products built | `components/ProductCard.tsx`, `content/industry-pages.xml` (inside each industry) | Product cards link to product-brief deep dives. |
| Blog | `pages/blog/index.tsx`, `pages/blog/[slug].tsx`, `components/templates/BlogPost.tsx`, `components/BlogPostCard.tsx`, `content/blog-markdown/` | Markdown frontmatter is the source for metadata. Blog pages are `noindex`. |
| Testimonials | `components/Testimonials.tsx`, `content/testimonials.xml`, `content/industry-pages.xml` (`selected-ids`) | Global collection; pages opt in by ID. |
| CTAs | `components/CTASection.tsx`, `components/FloatingButton.tsx`, `content/global-elements.xml` (`cta-content`) | Industry pages and deep dives pass context to generate email subjects. |
| Email signature landing | `pages/hello.tsx`, `content/industry-pages.xml` (`page id="hello"`) | Personalized via `?name=`. Calendar button appears only when `<scheduling-url>` is set. |
| Static pages | `pages/about.tsx`, `pages/projects.tsx`, `pages/privacy.tsx`, `pages/404.tsx`, `content/pages.xml` | All copy, including labels, comes from `pages.xml`. |
| Design tokens | `content/theme.js`, `tailwind.config.js`, `lib/motion.ts`, `styles/globals.css` | See `design-system.md`. |
| Analytics | `pages/_document.tsx` (GTM), `components/Layout.tsx` (Clarity), `components/FloatingButton.tsx` (CTA click events), `next.config.js` | All IDs come from env vars; unset disables the integration. |
| Freshness indicator | `components/FreshnessIndicator.tsx`, `next.config.js` (`LAST_UPDATED`) | Defaults to the build date. |
| Upstream sync | `.github/workflows/` | See `development.md` → "Getting upstream updates." |

## Conventions

- **Content lives in `/content/`, never hardcoded** in components. If you're about to write copy inside a `.tsx` file, stop and find where it belongs in XML.
- **Images live in `/public/images/<category>/`** where `<category>` is `profile`, `case-studies`, `products`, or `testimonials`.
- **Required fields fail the build.** Most XML fields are required by the parser; a missing one throws at build time. Optional fields are noted in `content-authoring.md`.
- **Animations respect `prefers-reduced-motion`**; see `styles/globals.css`.
- **Error boundaries are minimal**: static export + strict types catch most classes of failure at build time.
