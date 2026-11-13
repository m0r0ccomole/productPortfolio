# CLAUDE.md

Entry point for AI assistants working in this repo. Keep it short; use the linked docs for depth.

## Project summary

A portfolio site for a product or technology professional. Next.js 16 static export, TypeScript, Tailwind 4, Motion. Content lives in structured XML and markdown under `/content/`, parsed at build time by `lib/contentParser.ts` into typed interfaces consumed by React components. Deployed on Netlify.

Primary goal: convert hiring managers arriving from resume links and email signatures into interviews.

## Who owns what

This project is shared by an upstream repo and many site owners' copies. The split keeps upstream updates from ever colliding with a site owner's content.

| Path | Owned by | Notes |
|---|---|---|
| `content/**` (XML, blog markdown, `theme.js` palette) | The site owner | Never present in the upstream repo |
| `public/images/**` | The site owner | Never present in the upstream repo |
| `sample/**`, `public/sample/**` | Upstream | Fictional sample persona; the build falls back to it when `content/` is missing |
| Everything else (code, docs, config, workflows) | Upstream | Edit only for feature work you intend to share |

If `content/` does not exist, the build uses `sample/content/` and prints a warning. Making the site yours starts with copying `sample/content/` to `content/`. Never edit `sample/` to change a real site.

## Personal instructions

- If `CLAUDE.local.md` exists, follow it. It holds the site owner's private working preferences (gitignored).
- If `personal/voice.md` exists, read it before drafting or revising any first-person writing and match that voice. Do not default to a neutral AI register. `/personal/` is gitignored; never quote its contents in commits, code, or docs.

## Three work modes

Decide which mode the request falls into before starting. If unsure, ask.

### Content mode — blog posts, case studies, industry pages, copy revisions

- **XML first, markdown second.** Content changes are edits to `content/*.xml` or `content/blog-markdown/*.md`. You will rarely need to touch `/components/` or `/lib/` for a content update; if you think you do, surface the reason before editing.
- **Don't invent new content types or layout conventions.** If existing structures don't fit, ask before introducing new ones.
- **Preserve prompt syntax exactly.** Inside blog markdown, keep `:::prompt … :::` blocks and `{{comment: …}}` annotations intact. Comments render inline in the UI and are stripped from copy-to-clipboard. See [`docs/content-authoring.md`](docs/content-authoring.md).
- **Check images.** When referencing images, verify the file exists under `/public/`. Components fall back gracefully but broken refs clutter the console.

### Feature mode — components, types, routing, build/deploy

- **Types first.** Update `lib/types.ts` before the components or parsers that consume those types. TypeScript strict mode is on; the build will tell you what else needs changing.
- **Extend before adding.** The template system (`components/templates/`) covers most page shapes. Check whether an existing component handles your case before creating a new one.
- **Find consumers before refactoring.** Use Grep/Glob to enumerate callers of a type, component, or parser function.
- **No copy in JSX.** New user-visible strings go in XML (with a parser field and type), never inline in `.tsx`. Owner-specific values (name, URLs, email) always come from `content/global-elements.xml`.
- **New fields need sample data.** When you add an XML field, add it to `sample/content/` too, so a fresh copy still builds and demonstrates it.
- **Running builds and dev is fine.** `npm run build` verifies type-correctness; `npm run dev` verifies UI. Report what you observed, not just "it built."
- **Static export constraints apply.** No server-side code, no runtime env reads outside `next.config.js` exposure, no `getServerSideProps`.

### Redesign mode — visual polish, motion timing, palette swaps, layout refactors

- **Operate on tokens.** Colors and gradients go in `content/theme.js` (read by `tailwind.config.js`). Shadows, keyframes and timing curves go in `tailwind.config.js`. Motion edits go in `lib/motion.ts`. `styles/globals.css` is behavior only (focus, reduced-motion, resets, skip-link), not tokens.
- **Never change copy.** A redesign should not change a single string in `/content/` XML. If you find yourself editing XML text, you're in content mode by mistake.
- **Read the role comments.** Every restyleable file opens with a `// ROLE:` header declaring what's safe to restyle and what isn't. `bespoke page` files are open-canvas; `template` and `building block` files are stricter. Grep `// ROLE:` to orient.
- **Bespoke pages are first-class.** Hardcoding a one-off *layout* in JSX is encouraged when the section is unique; strings still come from XML. `pages/index.tsx` is the canonical example.
- **Don't add a theme system.** The palette file plus Tailwind config is sufficient. No CSS variables for colors, no Style Dictionary, no runtime swapping. See [`docs/design-system.md`](docs/design-system.md).

## Where to find what

| You need to… | Start here |
|---|---|
| Understand the architecture and subsystem file map | [`docs/architecture.md`](docs/architecture.md) |
| Add or revise content (blog post, case study, industry page, testimonials) | [`docs/content-authoring.md`](docs/content-authoring.md) |
| Redesign: tokens, motion vocabulary, bespoke vs templated, role comments | [`docs/design-system.md`](docs/design-system.md) |
| Set up a new site with its owner (agent runbook: interview, drafting, hand-offs, checks) | [`docs/agent-setup-guide.md`](docs/agent-setup-guide.md) |
| Send the owner to account steps (GitHub, Netlify, domain, analytics) or answer how those work | [`docs/setup-guide.md`](docs/setup-guide.md) |
| Run the dev server, build, deploy, debug env vars, pull upstream updates | [`docs/development.md`](docs/development.md) |
| Understand the strategic "why" behind the site's design | [`docs/research/`](docs/research/) |
| Known open work | [`docs/todo.md`](docs/todo.md) |

## Operational notes

- **Shell is bash** on all platforms (Git Bash on Windows). Use Unix paths and syntax.
- **Don't create new documentation files** unless asked. Update existing ones.
- **Content changes require a build** to be visible; the site is statically generated.
- **Never commit secrets.** Analytics IDs and URLs belong in environment variables (`.env.local` locally, the Netlify dashboard in production), never in XML or code.
