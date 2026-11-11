# Setup guide

A start-to-finish runbook for turning this project into your own portfolio site. It's written so you can follow it yourself or hand it to an AI coding agent (Claude Code, Cursor, Copilot and similar) and work through it together.

**If you are an agent:** follow the steps in order. Run every **Check** and don't move on until it passes. At each **Ask the human** checkpoint, stop and wait for answers; never invent experience, metrics, employers, quotes or contact details. Read [`CLAUDE.md`](../CLAUDE.md) before editing anything, and obey the [Hard rules](#hard-rules) at the end of this page.

Time: about an hour for the setup steps, plus however long your own writing takes.

---

## 1. Install the prerequisites

You need git and Node.js 24.

| OS | Install |
|---|---|
| Windows | [Git for Windows](https://git-scm.com/download/win), then Node 24 LTS from [nodejs.org](https://nodejs.org/) |
| macOS | `xcode-select --install` for git, then Node 24 from [nodejs.org](https://nodejs.org/) or `brew install node@24` |
| Linux | git from your package manager, Node 24 from [nodejs.org](https://nodejs.org/) or a version manager such as `nvm` |

**Check:**

```bash
git --version     # any recent version
node --version    # must start with v24
npm --version
```

You also need free accounts on [GitHub](https://github.com/) and [Netlify](https://www.netlify.com/).

## 2. Create your private repo

Your site lives in your own private repo, which keeps a link to this project (the "upstream") so you can pull improvements later. GitHub doesn't allow private forks of public repos, so you clone and repoint instead.

> **Ask the human:** What GitHub username will own the site, and what should the repo be called (for example `portfolio`)? Ask them to create an **empty, private** repo with that name on GitHub (no README, no license, no .gitignore) and confirm when it exists.

Then, replacing `YOU/YOUR-REPO`:

```bash
git clone https://github.com/m0r0ccomole/productPortfolio.git my-site
cd my-site
git remote rename origin upstream
git remote add origin https://github.com/YOU/YOUR-REPO.git
git push -u origin main
```

**Check:** `git remote -v` lists `origin` pointing at their repo and `upstream` pointing at `m0r0ccomole/productPortfolio`. The repo page on GitHub shows the files.

*No terminal?* On the upstream repo page, choose **Use this template → Create a new repository**, make it private, then clone it. Updates still work; the first one needs `--allow-unrelated-histories` (the sync workflow handles that for you).

## 3. Install and preview the sample

```bash
npm install
npm run dev
```

Open http://localhost:3000. You'll see Riley Carter, the fictional sample persona. Click through the home page, a case study, `/resume/fintech`, `/hello?name=Sam` and the blog so you know what each part is for.

**Check:** the terminal shows `No content/ folder found, building from sample/content`. That's expected for now.

## 4. Copy the sample content

```bash
cp -r sample/content content
```

From now on, edit only `content/`. Never edit `sample/`; it belongs to the upstream project and gets replaced by updates.

**Check:** restart `npm run dev`. The warning is gone and the site still shows Riley, now read from your `content/` folder.

## 5. Interview

> **Ask the human** these questions, a few at a time. Record the answers in `personal/notes.md` (the `personal/` folder is never committed) so nothing gets lost between sessions.
>
> **Identity**
> 1. Full name as it should appear on the site.
> 2. Contact email for the site's "get in touch" buttons.
> 3. A calendar booking link, if they use one (optional).
> 4. The domain they'll use, if they have one (optional; Netlify gives a free one).
> 5. A one-line tagline.
>
> **Career**
> 6. Every role worth showing: company, title, years, and the single proudest result in each.
> 7. Their 3 to 4 headline metrics (numbers they're comfortable defending in an interview).
> 8. The kinds of roles they apply for. Each becomes a landing page at `/resume/<id>` (for example fintech, healthcare, platform). Pick 2 to 4.
>
> **Proof**
> 9. 2 to 6 projects or problems to write up. For each: context, the problem, what they did in phases, and the results.
> 10. Which of those were products they launched (product briefs) versus problems they solved (case studies).
> 11. Testimonials: exact quote, name, title, company, and confirmation that the person agreed to be quoted.
> 12. Screenshots or photos they own the rights to, plus a headshot.
>
> **Personal**
> 13. A few sentences on how they work, and a few on life outside work, for the About page.
> 14. Side projects, including abandoned ones and why.
> 15. Writing samples, if they want a voice guide (step 10).

Don't fill gaps with plausible-sounding details. If an answer is missing, leave the sample text in place and list it as an open item.

## 6. Edit the content

Work through the files in this order. After each file, run `npm run build`.

**Check (after every file):** the build finishes without errors. Most failures are an unescaped `&` (write `&amp;`) or a missing required element; the error names the file.

### `content/global-elements.xml`

| Element | What to put |
|---|---|
| `<site-title>` | `Name | Short descriptor`, shown in the nav and default page title |
| `<tagline>` | One line |
| `<owner-name>` | Full name; used in page titles, author meta and the footer |
| `<site-url>` | Final URL with no trailing slash (update it once the domain is set in step 11) |
| `<contact-email>` | Email for every contact button |
| `<scheduling-url>` | Booking link, or delete the line to hide calendar buttons |
| `<credit>` | Footer link back to this project. Keep it if you'd like to say thanks; commercial users are asked to keep it |
| `<global-images>` | Headshot path and alt text, favicon, optional social share image (1200×630 PNG or JPG) |
| `<seo>` | Default description and keywords, plus a title and description per page |
| `<navigation>`, `<buttons>`, `<cta-content>` | Usually fine as is; adjust the wording to taste |

### `content/pages.xml`

- `home`: hero headline and subheading, the 4 headline metrics, featured case studies (each `href` must match a deep dive id), and featured industries (each id must match a page in `industry-pages.xml`).
- `about`: greeting, summary, hero image, timeline events, and the "My Approach" and "Beyond Work" sections.
- `projects`: active projects, then retired projects with a short post-mortem.
- `privacy`: update the contact email in the last section.
- `blog`, `deep-dives`, `not-found`: page labels; adjust wording if you like.

### `content/deep-dives.xml`

One `<deep-dive>` per write-up. Add `type="product-brief"` for launched products; leave it off for case studies. `listed="false"` keeps an entry reachable by link but out of the index. Delete every Riley entry you don't replace.

### `content/industry-pages.xml`

One `<page id="…">` per kind of role (step 5, question 8). The id becomes the URL: `/resume/<id>`. Each has a hero, a relevance statement, three achievements, optional product cards (whose ids must match product-brief deep dives), optional testimonials and a skills list. The `hello` page at the bottom is the email-signature landing page.

### `content/testimonials.xml`

Only real quotes, used with permission. `<image>` is optional.

### Where each string lives

| You want to change… | Edit this file |
|---|---|
| Name, site URL, email, calendar link, site title, tagline, nav, CTA copy, email subjects | `content/global-elements.xml` |
| Page `<title>`s and meta descriptions | `content/global-elements.xml` (`<seo>`) |
| Homepage hero, metrics, featured case studies, industry tiles | `content/pages.xml` (`page id="home"`) |
| About page, timeline | `content/pages.xml` (`page id="about"`) |
| Projects | `content/pages.xml` (`page id="projects"`) |
| Privacy policy | `content/pages.xml` (`page id="privacy"`) |
| 404 page | `content/pages.xml` (`page id="not-found"`) |
| Industry landing pages, `/hello` | `content/industry-pages.xml` |
| Case studies, product briefs | `content/deep-dives.xml` |
| Testimonials | `content/testimonials.xml` |
| Blog posts | `content/blog-markdown/*.md` |

Field-by-field detail for every file: [`content-authoring.md`](content-authoring.md).

## 7. Add images

Put images under `public/images/`, then point the XML at them with paths that start at `/images/`.

| Folder | For | Suggested size |
|---|---|---|
| `public/images/profile/` | Headshot (square), About hero (square) | 800×800 |
| `public/images/products/` | Product card and product brief images (4:3) | 1200×900 |
| `public/images/case-studies/` | Case study images (shown square, open full size on click) | 1200×1200 or larger |
| `public/images/testimonials/` | Testimonial headshots (square) | 200×200 |

Paths are case-sensitive on Netlify even when they work on Windows. Use lowercase file names with hyphens, no spaces. Delete references to `/sample/…` images once you've replaced them.

> **Ask the human:** confirm they own or have permission to publish every screenshot, especially ones from past employers.

**Check:** `npm run build`, then open the pages with images in `npm run dev` and look for broken images. The browser console lists any 404s.

## 8. Recolor

Edit `content/theme.js`.

| Token | Key | What it controls |
|---|---|---|
| `primary` (50–900) | `colors.primary` | Brand color: buttons, links, accents, focus outline (400). Ten hex codes, light to dark. |
| `accent` (50–900) | `colors.accent` | Secondary chrome: badges, retired-project cards. Ten hex codes. |
| Gradients | `gradients` | `bg-gradient-primary`, `-accent`, `-warning`, `-success` |

> **Ask the human:** one or two brand colors they like. Generate the 50–900 scales from those (500 is the base color), and keep the 400 shade dark enough to show as a focus outline on white.

**Check:** restart `npm run dev`; buttons, links and the nav underline use the new color.

## 9. Write the blog

Replace the posts in `content/blog-markdown/`. Front matter keys: `title`, `date` (YYYY-MM-DD), `category`, `excerpt`, `slug` (must match the file name), and `listed` (`false` hides a post from the index). Copyable prompts go between `:::prompt` and `:::`; `{{comment: …}}` adds a note that shows on the page but is left out when someone copies the prompt. Full syntax: [`content-authoring.md`](content-authoring.md).

It's fine to have no posts; the blog index shows an empty-state message.

## 10. Voice guide (optional)

So that AI agents write in the owner's voice rather than a generic one:

```bash
mkdir -p personal
cp sample/voice-guide-template.md personal/voice.md
```

Fill it in from their writing samples. The sample post "Build a Voice Guide Your AI Will Actually Follow" has a prompt that drafts most of it. `CLAUDE.md` tells agents to read `personal/voice.md` before writing first-person copy.

## 11. Deploy to Netlify

1. Commit and push:

   ```bash
   git add -A
   git commit -m "My content"
   git push
   ```

   **Check:** `git status` is clean, and `content/` and `public/images/` appear on GitHub.
2. In Netlify: **Add new site → Import an existing project → GitHub**, and pick the repo. Netlify reads the build settings from `netlify.toml` (build command `npm run build`, publish directory `out`, Node 24). Deploy.
3. **Check:** the deploy log ends in "Site is live". Open the `*.netlify.app` URL and click through every page.
4. Custom domain (optional): **Domain management → Add a domain**, then follow Netlify's DNS instructions. HTTPS is issued automatically once DNS resolves.

   > **Ask the human:** do they own a domain, and where is its DNS managed? Walk them through the DNS records Netlify shows; don't change DNS on their behalf.
5. Set `SITE_URL` (Site configuration → Environment variables) to the final URL, update `<site-url>` to match, and redeploy.

## 12. Analytics (optional)

Both are off unless you set them in Netlify's environment variables:

| Variable | Service |
|---|---|
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager (set up GA4 inside GTM) |
| `MICROSOFT_CLARITY_ID` | Microsoft Clarity session replay and heatmaps |

Redeploy after changing them. If you add analytics, keep the privacy page accurate. Full table: [`development.md`](development.md#environment-variables).

## 13. Pre-launch checklist

- [ ] No Riley Carter text left: `grep -ri "riley\|example.com" content/` returns nothing
- [ ] No `/sample/` image paths left: `grep -r "/sample/" content/` returns nothing
- [ ] Every number on the site is one the owner can defend in an interview
- [ ] Every testimonial is real and approved
- [ ] Contact buttons open an email to the right address
- [ ] `/hello?name=Test` greets "Test"
- [ ] Each `/resume/<id>` page loads and links to real case studies
- [ ] The privacy page names the right email and matches the analytics actually in use
- [ ] `npm run build` passes with no warnings about missing content
- [ ] The live site works on a phone

## 14. Staying up to date

Enable automatic update pull requests once: **Settings → Actions → General → Workflow permissions → Allow GitHub Actions to create and approve pull requests**. Every Monday, if the upstream project changed, you get a pull request with a Netlify deploy preview. Look at the preview, then merge. Details, including the optional `SYNC_TOKEN`: [`development.md`](development.md#getting-upstream-updates).

By hand:

```bash
git pull upstream main
```

Your content never conflicts. A conflict only happens in a code file you changed yourself.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Build error mentioning XML | Unescaped `&` (use `&amp;`), an unclosed tag, or a missing required element in the named file |
| Site still shows Riley | No `content/` folder at the repo root. Re-run step 4 |
| An image is missing on Netlify but fine locally | File name case doesn't match the XML path |
| A product card or link goes to a 404 | Its id doesn't match any `<deep-dive id>` or industry `<page id>` |
| Blog post missing from the index | `listed: false`, or a required front matter key is missing (the build warns) |
| Calendar button missing | No `<scheduling-url>` in `global-elements.xml` |
| No update pull requests | The Actions permission in step 14 isn't enabled, or the workflow opened an issue instead; check the Issues tab |
| `node` errors on install | Node isn't version 24 (`node --version`) |

More: [`development.md`](development.md#troubleshooting).

## Going further

- **New page with an existing shape:** add an entry to `industry-pages.xml` or `deep-dives.xml`. Routing is automatic.
- **One-off page layout:** copy `pages/index.tsx` (read its `// ROLE:` header). Layout can be unique; strings still come from XML. This is a code change, so consider sending it upstream ([CONTRIBUTING.md](../CONTRIBUTING.md)).
- **Restyling:** [`design-system.md`](design-system.md).

What not to touch for a content change: `sample/` (replaced on updates), `lib/contentParser.ts` (only for genuinely new XML fields), `lib/motion.ts` (retune values, don't add per-page variants), `styles/globals.css` (behavior only), `components/templates/` (extend the XML before changing a template). Every code edit is a place where an update might conflict.

## Hard rules

- Never edit `sample/` or code files to change content. Content goes in `content/`.
- Never commit `.env`, `.env.local` or anything in `personal/`.
- Never put secrets, analytics IDs or API keys in XML, markdown or code. They go in Netlify environment variables.
- Never invent experience, metrics, employers, testimonials or contact details.
- Never push to `main` or change DNS without the owner's go-ahead; pushing `main` deploys the live site.
