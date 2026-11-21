# Development

Local setup, build, deploy, upstream updates, and operational notes.

## Scripts

```bash
npm install       # install deps
npm run dev       # local dev server → http://localhost:3000
npm run build     # production build → /out/ (static export)
npm run lint      # eslint
```

`next build` emits the static site to `/out/` because `next.config.js` sets `output: 'export'`. There is no separate export step. `npm run start` exists but does not serve a static export; to preview the production build, serve `/out/` with any static file server.

## Stack versions

- Node 24 (`engines` in `package.json`, `NODE_VERSION` in `netlify.toml`)
- Next.js 16 (pages router, SSG + static export), React 19, TypeScript strict
- Tailwind CSS 4 via `@tailwindcss/postcss`, with `@tailwindcss/typography` for blog prose
- `motion` for animations
- `gray-matter` + `remark` + `remark-html` for blog markdown, `xml2js` for XML content

## Environment variables

All are optional. Local: copy `.env.example` to `.env.local`. Production: set them in the Netlify dashboard (Project configuration → Environment variables; click-by-click in [`setup-guide.md`](setup-guide.md#environment-variables)). They are read at build time through `next.config.js` (or the `NEXT_PUBLIC_` prefix).

| Variable | Purpose | If unset |
|---|---|---|
| `SITE_URL` | Canonical base URL for social share tags | Uses `<site-url>` from `content/global-elements.xml` |
| `LAST_UPDATED` | Footer freshness date, `YYYY-MM-DD` | The build date |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container (`GTM-XXXXXXX`). Configure GA4 and other tags inside GTM. | GTM not loaded |
| `MICROSOFT_CLARITY_ID` | Microsoft Clarity project ID | Clarity not loaded |

**CTA click tracking:** `lib/analytics.ts` pushes a `cta_click` event (destination, label, any `utm_*` params from the current URL, and the page path without its query string) to `window.dataLayer`. `components/FloatingButton.tsx`, the footer Contact link in `components/Layout.tsx`, and the link cards on `pages/hello.tsx` call it. The GTM snippet in `pages/_document.tsx` reads `dataLayer`; without a container nothing reads it and the push is harmless. GA4 only receives the event once the container has a Custom Event trigger and a GA4 Event tag for it. Steps: [`setup-guide.md`](setup-guide.md#contact-button-clicks).

Never put these values in XML, markdown, or code. They are deployment settings, not content.

## Deployment (Netlify)

Config is in `netlify.toml`:

- Build command `npm run build`, publish directory `out`, `NODE_VERSION = "24"`
- Security headers and long-lived caching for CSS/JS
- A status-404 fallback rule pointing at `/404/index.html`. Next.js exports the 404 page there (not `/404.html`) because it loads site content; the rule only applies when no real file matches.

Push to `main` → Netlify builds and deploys automatically. Pull requests get deploy previews. SSL is handled by Netlify.

## Getting upstream updates

This project is meant to be copied. Your copy's `content/` and `public/images/` folders are yours; the upstream repo ([m0r0ccomole/productPortfolio](https://github.com/m0r0ccomole/productPortfolio)) never contains them, so pulling upstream changes never touches your content.

Your repo should have two remotes:

- `origin`: your own repo (Netlify deploys from it)
- `upstream`: `https://github.com/m0r0ccomole/productPortfolio.git`

Check with `git remote -v`. To pull updates by hand:

```bash
git fetch upstream
git merge upstream/main
```

If you created your repo with GitHub's "Use this template" button, the first merge needs `--allow-unrelated-histories`.

### Automatic updates

`.github/workflows/sync-upstream.yml` checks for updates every Monday (or on demand from the Actions tab) and opens an "Updates from …" pull request. Netlify builds a deploy preview of it; look at the preview, then merge. One-time setup:

1. Settings → Actions → General → Workflow permissions: enable **Allow GitHub Actions to create and approve pull requests**.
2. Optional: add a repo secret `SYNC_TOKEN`, a fine-grained personal access token for your repo with Contents, Pull requests and Workflows set to read and write. Without it, an update that changes a file in `.github/workflows/` can't be pushed by the default token.
3. Optional: set a repo variable `UPSTREAM_REPO` (`owner/name`) to follow a different upstream.

When the workflow can't merge on its own (you changed a code file upstream also changed, or the token problem above), it opens an issue with the commands to run instead.

## Sending improvements upstream

Feature changes (code, docs, config, `sample/`) are welcome upstream. Content is not. See [CONTRIBUTING.md](../CONTRIBUTING.md) for the steps. Pull requests that touch `content/` or `public/images/` are rejected automatically.

## Static export constraints

Because the site exports statically, the following do **not** work:

- `getServerSideProps` or any runtime server code
- API routes (`pages/api/`)
- Runtime `process.env` reads in the browser; values must be exposed through `next.config.js` at build time
- Dynamic routes without a matching `getStaticPaths`

If you need something dynamic, it must be client-side JavaScript inside a component.

## Build-time validation

Strict TypeScript + structured XML parsing means most content mistakes fail the build early:

- Missing required XML fields → parser throws
- Missing required blog frontmatter (`title`, `date`, `category`, `excerpt`) → post is skipped with a warning
- Type mismatch between XML shape and `lib/types.ts` → compile error
- No `content/` folder → build succeeds using `sample/content/` and prints a warning

The build is the integration test. Run it when you touch content or types.

## Troubleshooting

**Build fails after content edit**: almost always a malformed XML element (unescaped `&`, unclosed tag) or a missing required field. Check the parser error in the output. Write `&amp;` for `&` in XML.

**Site shows the sample persona instead of my content**: there is no `content/` folder at the repo root, or it is named differently. Copy `sample/content/` to `content/`.

**Content didn't update**: restart the dev server. For production, confirm the commit reached `main` and the Netlify deploy finished.

**Images not showing**: verify the path under `/public/` matches the XML reference exactly. Paths are case-sensitive on Netlify even when they work on Windows locally.

**TypeScript errors after changing types.ts**: walk through the listed files. Consumer components usually need a small update; the error messages are precise in strict mode.

**Env var not available at runtime**: confirm it's exposed in `next.config.js` or has the `NEXT_PUBLIC_` prefix, then rebuild. Env changes in Netlify need a new deploy.

## Conventions

- Don't commit `.env*` files (except `.env.example`), `CLAUDE.local.md`, or anything under `/personal/`.
- Don't add `package.json` scripts casually; the script list is minimal on purpose.
- Dependency upgrades: prefer minor/patch bumps; coordinate major bumps (especially Next.js) explicitly.
