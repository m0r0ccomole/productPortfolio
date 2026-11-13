# Content authoring

How to add or revise content without touching code. Start here for blog posts, case studies, industry page copy, testimonials, and image updates.

> **Voice.** If `personal/voice.md` exists, read it before drafting anything in the first person. The voice guide overrides any default tone. `sample/voice-guide-template.md` is a starting point for writing one.

> **Your content vs the sample.** Edit files in `content/`. If that folder doesn't exist yet, copy `sample/content/` to `content/` first. Never edit `sample/`; it belongs to the upstream project and gets replaced on updates.

## Content files at a glance

| File | Holds |
|---|---|
| `content/global-elements.xml` | Owner name, site URL, contact email, scheduling link, site title, navigation, CTA button text, email subjects, global images, SEO (default description, keywords, per-page titles) |
| `content/pages.xml` | Static pages: home, about, projects, privacy, 404 (`not-found`) |
| `content/industry-pages.xml` | Industry landing pages (one per `<page id>`) + the `/hello` email-signature landing |
| `content/deep-dives.xml` | Case studies and product briefs (same schema, differentiated by `type` attribute) |
| `content/testimonials.xml` | Every testimonial in one place; pages opt-in by ID |
| `content/blog-markdown/*.md` | Blog posts — frontmatter is metadata, body is content |
| `content/theme.js` | Color palette and gradients (see `design-system.md`) |

After any content change, the build regenerates static pages. See [`development.md`](development.md).

## Global settings

`content/global-elements.xml` holds everything that identifies the site owner. Code never hardcodes these.

| Element | Required | Used for |
|---|---|---|
| `<site-title>` | yes | Navigation brand and default `<title>` |
| `<tagline>` | yes | Site tagline |
| `<owner-name>` | yes | Page titles, author meta, footer copyright |
| `<site-url>` | yes | Social share URLs. The `SITE_URL` env var overrides it per deploy. No trailing slash. |
| `<contact-email>` | yes | Every "contact me" / `mailto:` button |
| `<scheduling-url>` | no | Calendar booking link. Omit it and calendar buttons disappear. |
| `<credit href="…">` | no | Footer link to the template project, e.g. `Built with productPortfolio`. Omit it to hide the link. |
| `<global-images>` | no | `<headshot>`, `<headshot-alt>`, `<favicon>`, `<og-image>` (social share image, ideally 1200×630). Omitted images are simply not rendered. |
| `<seo>` | recommended | `<default-description>`, `<default-keywords>`, and one `<page id="…">` per static page with `<title>` and `<description>`. Page ids: `about`, `projects`, `hello`, `privacy`, `blog`, `not-found`. A page without an entry uses the site title and default description. |
| `<navigation>`, `<buttons>`, `<cta-content>` | yes | Nav links and CTA copy |
| `<ui-labels>` | no | Small UI labels shared across pages, one `<label key="…">` per label. See below. |

**UI labels.** `<ui-labels>` holds generic interface text that is not tied to one page:

```xml
<ui-labels>
  <label key="read-more">Read more →</label>
</ui-labels>
```

| Key | Used for |
|---|---|
| `read-more` | Link text on each blog listing card |

Every key is optional. If your `content/global-elements.xml` has no `<ui-labels>` block, or leaves a key out, the build takes that label from `sample/content/global-elements.xml`. Pulling an upstream update that adds a label therefore needs no change to your content. Add the key to your own file only when you want different wording.

## Blog posts

**Blog metadata lives in the markdown frontmatter, not XML.** To add a post, create one file:

```markdown
---
title: "Post title here"
date: "2025-09-07"
category: "AI"
excerpt: "Short description shown on the listing page."
slug: "url-slug-here"
listed: true
---

# Post body

Regular markdown works as expected.

:::prompt
You are an expert analyst. {{comment: This establishes expertise upfront.}}

Context: [background] {{comment: Give the AI enough context to work with.}}

Your task:
1. Analyze the data
2. Surface insights
3. Recommend next steps
:::

More prose after the prompt block.
```

### Required frontmatter

`title`, `date`, `category`, `excerpt`. Missing any of these and the parser skips the post with a warning.

### Optional frontmatter

- `slug` — URL path. Defaults to the filename (minus `.md`).
- `listed` — `true` (default) shows on the blog index; `false` is a direct-link-only post.

### Prompt blocks

Wrap AI-ready prompts in `:::prompt` … `:::`. The UI renders these as copyable blocks. Keep the syntax exact — parsing is literal.

### Inline comments

Inside a prompt block, use `{{comment: explanation text}}` to add educational annotations. These:

- Render inline in the rendered post for the reader
- Are **stripped** from the text when the reader clicks "copy prompt"
- Are the reason prompt blocks look clean when pasted into an AI tool

Do not move `{{comment: …}}` outside prompt blocks — they have no effect there.

## Deep dives (case studies and product briefs)

Both live in `content/deep-dives.xml`. The differentiator is `type`:

- `type="case-study"` (default) — full `<process>` with phases, metrics, multiple images
- `type="product-brief"` — simplified layout, one hero image, headline metrics, no process phases

Attributes on the `<deep-dive>` element:

- `id` — URL segment (`/deep-dives/<id>`) and referenced from industry pages' `products-built`
- `listed="true|false"` — controls appearance on `/deep-dives/` index
- `type` — see above

Schema sketch (see existing entries for the full pattern):

```xml
<deep-dive id="example" listed="true" type="case-study">
  <title>…</title>
  <context>
    <company>…</company>
    <timeframe>…</timeframe>
    <role>…</role>
    <stakes>…</stakes>
  </context>
  <problem>
    <summary>…</summary>
    <details>
      <detail>…</detail>
    </details>
  </problem>
  <process>
    <phase name="Discovery">
      <step>…</step>
    </phase>
  </process>
  <results>
    <metric>
      <value>8%</value>
      <label>Conversion lift</label>
    </metric>
  </results>
  <images>
    <image src="/images/case-studies/example.jpg" alt="…" caption="…" />
  </images>
</deep-dive>
```

For a product brief, drop `<process>` and keep `<context>`, headline metric, and one strong image.

## Industry pages

Each `<page id="…">` in `content/industry-pages.xml` (except `hello`) becomes `/resume/<id>`. Add or remove pages freely; routes follow the XML. Each has:

- `display-name` — industry name used in titles
- `hero` — `<headline>` and `<hook>`
- `relevance` — `<statement>`: why you fit this industry
- `featured-achievements` — `<achievement>` entries with `<metric>` and `<context>`
- `relevant-skills` — `<skill>` list
- `products-built` *(optional)* — product cards (`id`, `name`, `year`, `metric`, `metric-label`, `image`, `image-alt`), each `id` referencing a deep dive
- `testimonials` *(optional)* — `<selected-ids>` list referencing entries in `testimonials.xml`

The `hello` page in the same file drives `/hello`, the email-signature landing. It is personalized via the `?name=` URL param (`{firstName}` in `<personalized-greeting>` is replaced). It also takes `<read-more-label>` for the quick-link badges and `<email-subject>` inside `<closing-hook>`.

## Testimonials

Add once to `content/testimonials.xml`:

```xml
<testimonial id="unique-id">
  <quote>…</quote>
  <name>…</name>
  <title>…</title>
  <company>…</company>
  <image>/images/testimonials/headshot.jpg</image>  <!-- optional -->
  <image-alt>…</image-alt>                          <!-- optional -->
</testimonial>
```

Only publish testimonials you have permission to use, and only with the person's consent for their name and photo.

Then reference by ID from industry pages via `<selected-ids><id>unique-id</id></selected-ids>`. Missing images fall back to initials.

## About, projects, privacy and 404 pages

All live in `content/pages.xml`.

**About timeline.** `<timeline-heading>` titles the section. Each `<event>` takes an optional `url` on `<company>`. When present, the company name links out in a new tab. Leave it off for entries that shouldn't link (e.g. "Your Company?").

```xml
<company url="https://www.example.com">Example Corp</company>
```

**Projects labels.** `<project-labels>` (`tech-stack`, `key-features`, `retired`, `post-mortem`) and `<closing-cta>` (`heading`, `<primary-button href="…">`) hold the page's fixed labels.

**Privacy.** `<title>` plus `<content>` with one `<section>` (`<h2>`, `<p>`) per heading. Write a policy that matches the analytics you actually enable.

**404.** `page id="not-found"` with `<not-found>`: `heading`, `message`, `primary-button` (goes home), `secondary-button` (goes to /about).

**Retired projects.** Abandoned projects go in a `<retired-projects>` block on the projects page, below the active `<project>` entries. Each takes the same fields as an active project plus an optional `<retired>` date and a `<post-mortem>` of one or more paragraphs. `<tech-stack>` and `<highlights>` are optional here.

```xml
<retired-projects>
  <heading>Retired Projects</heading>
  <description>Optional intro line.</description>
  <project id="unique-id">
    <title>…</title>
    <description>What it was.</description>
    <retired>2025</retired>
    <tech-stack><tech>…</tech></tech-stack>
    <post-mortem>
      <p>Why it was retired.</p>
    </post-mortem>
  </project>
</retired-projects>
```

## Images

Place images under `/public/images/<category>/`:

- `profile/` — headshot, hero images
- `case-studies/` — product screenshots, UI evidence
- `products/` — product interface shots for product-brief cards
- `testimonials/` — circular headshots for social proof

Reference with root-relative paths (`/images/case-studies/foo.jpg`). Every image element takes `alt`; most take an optional `caption`. Components fall back gracefully if the file is missing but the build console will log warnings — clean them up.

## Freshness

The footer freshness indicator shows the build date by default, so every deploy looks fresh. To pin a date instead, set the `LAST_UPDATED` env var (see `development.md`).

## What to avoid

- Hardcoding copy in `.tsx` files. Copy belongs in XML or markdown.
- Inventing new XML elements without updating `lib/types.ts` and the parser. They will be silently ignored.
- Touching `:::prompt` or `{{comment: …}}` delimiters — even a stray space breaks parsing.
- Adding a new content type (sibling to case-study / product-brief) without asking first.
