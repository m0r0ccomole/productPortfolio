# Agent setup guide

A runbook for an AI coding agent (Claude Code, Cursor, Copilot and similar) setting up this portfolio site together with its owner. The owner is usually a product manager who is job hunting and may never have used git, a terminal or Netlify.

The owner's companion document is [`setup-guide.md`](setup-guide.md). It has the click-by-click steps for every external service. You do not repeat those steps; you send the person to the named section and check the result afterwards.

## How to work

Read [`CLAUDE.md`](../CLAUDE.md) before editing anything. Then follow the steps in order.

- **Check** means run it and do not move on until it passes.
- **Ask the human** means stop and wait for an answer. Ask a few questions at a time, never the whole list.
- **Hand off** means the step needs the person's own accounts. Send them to the linked section, tell them what to bring back, and verify once they return.

Rules, with the reason for each:

- **Never invent experience, metrics, employers, quotes or contact details.** The person will be asked about every line in an interview, and one number they cannot explain costs them the offer. A missing answer stays as sample text and goes on the open items list.
- **Content goes in `content/`, never in `sample/` or code.** `sample/` and the code are replaced by upstream updates; edits there are lost or cause merge conflicts.
- **Analytics IDs go in Netlify environment variables, never in XML, markdown or code.** The person sets them. The code already reads them at build time.
- **Never enter credentials, create accounts, accept terms, buy anything or change DNS.** Those are the person's decisions and the person's logins.
- **Never commit `.env`, `.env.local` or anything in `personal/`.** `personal/` holds private notes and is gitignored.
- **Ask before every push to `main`.** Once Netlify is connected, a push deploys the live site and uses one of a limited number of monthly deploys on the free plan. Batch changes.

## 1. Orient

Before any command, find out who you are working with.

> **Ask the human:**
> 1. How comfortable are you with git and the terminal: never used them, used them a little, or use them regularly?
> 2. Which of these do you already have: a GitHub account, a Netlify account, a domain name?
> 3. Do you have a current resume or a LinkedIn profile export you can paste or drop into this folder?
> 4. What kinds of roles are you applying for right now?
> 5. Do you want visit tracking (Google Analytics, Microsoft Clarity), or would you prefer none?
> 6. How do you want to work: one long session, or short sessions over several days?

Adapt to the answers:

- **New to the terminal:** run commands yourself where you can, say in one sentence what each does, and never paste a block of five commands for them to run unexplained.
- **Experienced:** skip explanations, move fast, confirm only the decisions.
- **Has a resume:** ask for it now. Step 5 starts from it.
- **Several sessions:** end each session by updating `personal/notes.md` (step 5) with what is done and what is next, and start each session by reading it.

Tell the person the shape of the work: setup (about an hour), interview and drafting (most of the time), then deploy, domain and analytics, which they do in their own browser with you checking.

## 2. Check the prerequisites

```bash
git --version     # any recent version
node --version    # must start with v24
npm --version
```

**Check:** all three print a version and Node starts with `v24`.

If anything is missing, **hand off** to [Install git and Node](setup-guide.md#install-git-and-node) and re-run the check when they return. Do not install system software yourself unless the person asks you to.

## 3. Create the private repo

The site lives in the person's own private repo, with this project kept as the `upstream` remote so updates can be pulled later.

> **Hand off:** ask the person to follow steps 1 to 3 of [Create your private repo](setup-guide.md#create-your-private-repo): create an **empty, private** GitHub repo with no README, license or .gitignore.
> **Bring back:** the repo URL, for example `https://github.com/YOU/YOUR-REPO`.

Then, replacing `YOU/YOUR-REPO`. Skip the first two lines if you are already inside a clone of this project:

```bash
git clone https://github.com/m0r0ccomole/productPortfolio.git my-site
cd my-site
git remote rename origin upstream
git remote add origin https://github.com/YOU/YOUR-REPO.git
git push -u origin main
```

The push may open a browser sign-in for the person. Tell them to expect it. If it asks for a password in the terminal, stop and point them to the first row of [Troubleshooting](setup-guide.md#troubleshooting); do not handle tokens yourself.

**Check:** `git remote -v` lists `origin` at their repo and `upstream` at `m0r0ccomole/productPortfolio`. `git ls-remote origin main` returns a commit.

If the repo was created with **Use this template** instead, there is no shared history with upstream. Add the remote with `git remote add upstream https://github.com/m0r0ccomole/productPortfolio.git`; the first manual pull needs `--allow-unrelated-histories`.

## 4. Preview the sample

```bash
npm install
npm run dev
```

**Check:** the dev server output includes `No content/ folder found, building from sample/content`, and http://localhost:3000 responds.

> **Ask the human:** open http://localhost:3000 and click through the home page, one case study, `/resume/fintech`, `/hello?name=Sam` and the blog. Which parts do you want on your site, and is there anything you would rather leave out (blog, projects page, testimonials)?

Their answer sets the scope of the interview. Record it in the notes file.

Then copy the sample so there is something to edit:

```bash
cp -r sample/content content
```

**Check:** restart the dev server. The warning is gone and the site still renders.

## 5. Interview

This step decides how good the site is. The goal is specific, defensible material: numbers with a baseline and a timeframe, the person's own part in the work, and the story of how a decision got made.

### Start from what exists

If the person has a resume or LinkedIn export, read it first and do three things before asking anything:

1. Fill `personal/notes.md` with every fact it states (see the format below), each marked `source: resume`.
2. Propose a plan: which roles become timeline events, which 2 to 4 role types become `/resume/<id>` pages, which 2 to 6 projects look like case studies or product briefs.
3. List the gaps. A resume line such as "improved onboarding conversion" has no number, no baseline and no story.

Show the plan and the gap list to the person, get corrections, then interview only for the gaps. Do not make them retype what the resume already says.

If there is no resume, work through the question bank in order.

### Keep notes

Create `personal/notes.md` (the `personal/` folder is never committed). Update it after every answer, not at the end of the session.

```markdown
# Setup notes

## Status
Done: …
Next: …

## Facts
- Brightwater Lending, Product Manager, 2016 to 2021. source: resume
- Fraud losses down 85% in 6 months, from a baseline of about $1.2M a year. source: session 2, confirmed

## Projects
### <working title>
Context / problem / what they did / result / what they would change

## Open items
- [ ] Baseline for the conversion lift number
- [ ] Permission from J. Doe for the testimonial
```

Mark a fact `confirmed` only when the person has said it or approved it in so many words. Anything you inferred is not a fact; put it under open items as a question.

### Question bank

> **Ask the human**, a few at a time:
>
> **Identity**
> 1. Full name as it should appear on the site.
> 2. Contact email for the site's "get in touch" buttons.
> 3. A calendar booking link, if you use one (optional).
> 4. The domain you plan to use, if any (optional; Netlify provides a free address).
> 5. A one-line tagline. If they have none, draft three from their own words and let them pick or rewrite.
>
> **Career**
> 6. Every role worth showing: company, title, years, and the proudest result in each.
> 7. Your 3 to 4 headline numbers, the ones you would lead with in an interview.
> 8. The kinds of roles you are applying for. Each becomes a landing page at `/resume/<id>` (for example fintech, healthcare, platform). Pick 2 to 4.
>
> **Proof**
> 9. 2 to 6 projects or problems to write up. For each: the situation, the problem, what you did in phases, and the results.
> 10. Which of those were products you launched (product briefs) and which were problems you solved (case studies).
> 11. Testimonials: the exact quote, the person's name, title and company, and whether they have agreed to be quoted.
> 12. A headshot, and screenshots or photos you have the right to publish.
>
> **Personal**
> 13. A few sentences on how you work, and a few on life outside work, for the About page.
> 14. Side projects, including abandoned ones and why you stopped.
> 15. Two or three samples of your own writing, if you want a voice guide (step 6).

### Follow-up prompts

First answers from product managers tend to be team-level and abstract ("we improved retention"). Use these to get to something usable. Pick the one that fits; do not run all of them on every answer.

| The answer is missing… | Ask |
|---|---|
| The number | "What was the number? If you can't share the exact figure, what range or percentage can you stand behind?" |
| The baseline | "What was it before you started, and what was it after?" |
| The timeframe | "Over what period? When did you measure it?" |
| How it was measured | "How do you know? Was that an A/B test, a before-and-after comparison, or an estimate?" |
| Their own part | "What did you personally do, as opposed to the team? What would not have happened if you had been on holiday that quarter?" |
| The decision | "What were the options on the table, and why did you pick this one?" |
| The opposition | "Who disagreed, and what was their objection? What changed their mind: data, a prototype, a conversation?" |
| The constraint | "What made this hard? Budget, a deadline, a regulation, legacy systems?" |
| The stakes | "What would have happened if nothing had been done?" |
| The honest part | "What went wrong along the way? What would you do differently now?" |
| Scale | "How many users, how much revenue, how big was the team?" |
| A human detail | "Is there a moment from this project you still remember? A customer call, a number on a dashboard?" |

For headline numbers, add one more check:

> "If an interviewer asked you to walk through how you got to this number, could you? Which of these would you rather drop than defend?"

Guidance:

- **Ask once, rephrase once, then move on.** If the person does not have the number, write the claim without one or leave it on the open items list. Do not round, estimate or supply a "typical" figure for them.
- **Confidential figures:** offer forms they may be able to share: a percentage change, a range, an order of magnitude, or a relative statement ("the largest product line"). The choice is theirs.
- **Reflect back before you file it.** "So: fraud losses fell 85% over six months after you added the verification step, measured against the prior six months. Is that right?" Write it to the notes only after a yes.
- **One project per sitting.** A good case study takes 15 to 20 minutes of questions. Stop when the person tires and pick up next session from the notes.
- **Testimonials are verbatim.** Never tidy a quote, and never draft one for someone to "approve later".

## 6. Voice guide (optional, before drafting)

If the person gave writing samples, set this up before you draft any first-person copy, so the first drafts already sound like them:

```bash
mkdir -p personal
cp sample/voice-guide-template.md personal/voice.md
```

Fill it in from their samples. The sample post "Build a Voice Guide Your AI Will Actually Follow" contains a prompt for this.

> **Ask the human:** read `personal/voice.md`. Does this describe how you write? What would you never say?

From here on, read `personal/voice.md` before drafting or revising anything in the first person, as `CLAUDE.md` requires. Without a voice guide, write plainly and reuse the person's own phrases from the notes.

## 7. Draft the content

Work through the files in this order. Field detail is in [`content-authoring.md`](content-authoring.md); the element tables are in [Edit the files in this order](setup-guide.md#edit-the-files-in-this-order).

1. `content/global-elements.xml`: name, email, site title, tagline, scheduling link (delete the line if none), SEO titles and descriptions. Leave `<site-url>` until the domain is settled.
2. `content/pages.xml`: home hero and metrics, About, projects, privacy contact email, labels.
3. `content/deep-dives.xml`: one `<deep-dive>` per write-up. Delete every sample entry you do not replace.
4. `content/industry-pages.xml`: one `<page id>` per role type, plus the `hello` page.
5. `content/testimonials.xml`: real, approved quotes only. If there are none, remove the sample entries and every `<selected-ids>` reference to them.

Ids must line up across files: `featured-case-studies` hrefs and product card ids point at `<deep-dive id>`s, and `featured-industries` ids point at industry `<page id>`s.

**Check (after every file):** `npm run build` finishes without errors. Most failures are an unescaped `&` (write `&amp;`) or a missing required element; the error names the file.

### Review each file with the person

After each file builds, stop and show the work. Do not ask them to read XML.

> **Ask the human:** I have drafted `<file>`. Here is what it says, in plain text: `<the headline, each paragraph, each number, in page order>`. It is also live in the preview at `<local URL of the page>`.
> 1. Is every fact and number correct?
> 2. Is there anything you would not say in an interview?
> 3. Does it sound like you? Point at any sentence that does not.
> 4. Is anything important missing?

Then:

- Apply corrections, rebuild, and show only what changed.
- List every place where sample text is still standing in for a missing answer, and add each to the open items in the notes.
- For each case study, read the results section back as a list of claims and get an explicit yes on each number.

Move to the next file only when the person has approved this one.

## 8. Images

Images go under `public/images/` (`profile/`, `products/`, `case-studies/`, `testimonials/`), referenced from XML with paths starting `/images/`. Sizes: [Add images](setup-guide.md#add-images). Use lowercase file names with hyphens; paths are case-sensitive on Netlify.

> **Ask the human:** please put your headshot and any screenshots in this folder, or tell me where they are. For each screenshot: do you own it or have permission to publish it? Does it show customer data, internal figures or anything a past employer would object to?

Do not use an image the person has not cleared. Remove references to `/sample/…` images once replaced, and write alt text that describes what the image shows.

**Check:** `npm run build` passes, `grep -r "/sample/" content/` returns nothing, and every referenced file exists under `public/`.

## 9. Recolor

Colors live in `content/theme.js`: `colors.primary` and `colors.accent` (ten shades each, 50 to 900) and `gradients`.

> **Ask the human:** name one or two colors you like, as a hex code, a brand you like the look of, or a plain description. Or keep the sample palette.

Generate the scales with 500 as the base color. Keep the 400 shade dark enough to show as a focus outline on white.

**Check:** restart the dev server and ask the person to look at buttons, links and the nav underline.

## 10. Blog

Replace or delete the posts in `content/blog-markdown/`. Front matter: `title`, `date` (YYYY-MM-DD), `category`, `excerpt`, `slug` (matches the file name), `listed`. Keep `:::prompt … :::` blocks and `{{comment: …}}` annotations exactly as the syntax requires ([`content-authoring.md`](content-authoring.md#blog-posts)).

> **Ask the human:** do you want a blog at launch? If yes, which topic first, and do you have notes or a draft to start from?

An empty blog is fine; the index shows an empty-state message. Do not write posts from nothing in the person's name. Draft from their notes and review as in step 7.

## 11. Commit and push

```bash
git status
git add -A
git commit -m "My content"
```

**Check:** `git status` is clean and nothing under `personal/` or any `.env` file is in the commit (`git show --stat HEAD`).

> **Ask the human:** the content is committed locally. Shall I push it to GitHub? If Netlify is already connected, this publishes the site.

Push only after a yes.

## 12. Deploy on Netlify

> **Hand off:** ask the person to follow [Deploy on Netlify](setup-guide.md#deploy-on-netlify) through "Rename the site address": sign up with GitHub, import the one repo, confirm the build settings, deploy, make the project public, rename it.
> **Bring back:** the site's `https://….netlify.app` address, and whether the first deploy succeeded. If it failed, the first error in the deploy log.

**Check:**

```bash
curl -sI https://THEIR-SITE.netlify.app/ | head -n 1     # expect 200
curl -s https://THEIR-SITE.netlify.app/ | grep -c "OWNER NAME"   # expect 1 or more
```

A response that is not the site (for example a Netlify access page) usually means the project is still private; point them to [Open the site and make it public](setup-guide.md#open-the-site-and-make-it-public). If the page still shows Riley Carter, `content/` did not reach `main`.

If the deploy failed, reproduce it with `npm run build` locally. A build that passes locally and fails on Netlify is most often a file name whose case does not match its XML path.

Mention the deploy limit once: on the free plan each push to `main` uses credits, so you will batch changes from here on ([Free plan limits](setup-guide.md#free-plan-limits)).

## 13. Custom domain

> **Ask the human:** do you want a custom domain now, later or not at all? If you already own one, is it used for anything else, such as email?

If not now: set `<site-url>` to the `netlify.app` address, build, and include it in the next push.

> **Hand off:** [Custom domain](setup-guide.md#custom-domain). If the domain carries email, tell them to choose the external DNS option so their mail records are left alone.
> **Bring back:** the final address, and confirmation that it loads with `https://`.

**Check:** `curl -sI https://THEIR-DOMAIN/ | head -n 1` returns 200. If it does not resolve yet, that is normal for up to 48 hours; note it as an open item and continue.

Then set `<site-url>` in `content/global-elements.xml` to the final address with no trailing slash, build, and include it in the next approved push. After that deploy, **check** that the live page source contains the address in its `og:url` tag.

## 14. Analytics

Skip this step if the person said no in step 1.

Explain the one thing that is not obvious: the site loads Google Tag Manager and Clarity only when their IDs are set as Netlify environment variables, and a variable takes effect only after a redeploy.

> **Hand off (Google):** [Analytics](setup-guide.md#analytics), from "Create a GA4 property" through "Contact button clicks". They create the GA4 property and GTM container, add and publish the Google tag, set `NEXT_PUBLIC_GTM_ID` in Netlify, redeploy, and verify in GTM Preview and GA4 Realtime.
> **Bring back:** the `GTM-…` container ID, and whether they saw their own visit in GA4 Realtime.

> **Hand off (Clarity):** [Microsoft Clarity](setup-guide.md#microsoft-clarity).
> **Bring back:** the Clarity project ID, and whether the Clarity dashboard shows a session.

**Check:**

```bash
curl -s https://THEIR-SITE/ | grep -o "GTM-[A-Z0-9]*" | sort -u     # matches the ID they reported
curl -s https://THEIR-SITE/ | grep -o "clarity.ms/tag/[a-z0-9]*"    # matches the Clarity ID
```

If an ID is absent from the page source, the variable name is misspelled or the site was not redeployed after it was set. You cannot see their GA4 or Clarity dashboards, so the Realtime confirmation has to come from them.

Things to tell them, because the human guide's detail is easy to skim past:

- The site pushes `cta_click` to Tag Manager on its own, but GA4 sees nothing until they add the trigger, variables and GA4 event tag in [Contact button clicks](setup-guide.md#contact-button-clicks) and publish. Ask them to confirm `cta_click` in DebugView or Realtime.
- Each change inside GTM needs a publish.

Then update the privacy page. Draft `page id="privacy"` in `content/pages.xml` to match what is switched on, using [Keep the privacy page accurate](setup-guide.md#keep-the-privacy-page-accurate), and review it with the person as in step 7. This is their statement to visitors; they approve the wording.

Finally, help with links. Using [Tag your links](setup-guide.md#tag-your-links), produce a short table of ready-to-paste addresses: one per `/resume/<id>` page for each resume version, one `/hello` link for the email signature, and a `/hello?name=` pattern for one-to-one emails. Save it in `personal/notes.md`.

## 15. Pre-launch check and walkthrough

Run the mechanical checks yourself:

```bash
grep -ri "riley\|example.com" content/     # expect nothing
grep -r "/sample/" content/                # expect nothing
npm run build                              # expect no errors or missing-content warnings
```

Then go through the live site together. Ask the person to open it on their phone as well as their computer.

> **Ask the human**, page by page:
> 1. **Home:** read the headline and the four numbers aloud. Would you say each one to a hiring manager?
> 2. **Each `/resume/<id>` page:** imagine the hiring manager for that role. Is the first screen about them? Do the case study links go to the right write-ups?
> 3. **Each case study and product brief:** any number, name or screenshot you want removed before this is public?
> 4. **About:** are the dates, titles and company names correct?
> 5. **`/hello?name=Test`:** does it greet "Test"? Does `/hello` with no name read well?
> 6. **Contact buttons:** press one. Does it open an email to the right address with a sensible subject? Does the calendar button go to your booking page?
> 7. **Privacy page:** does it match the tracking you turned on?
> 8. **Phone:** is anything cut off or hard to tap?

Fix what they find, rebuild, and push once with their go-ahead.

Close out with the open items list from `personal/notes.md`. Read it to them. Each item is either answered now, deliberately left as is, or removed from the site. Nothing with sample or placeholder text ships.

The person's own checklist is [Pre-launch checklist](setup-guide.md#pre-launch-checklist).

## 16. Updates

> **Hand off:** [Turn on update pull requests](setup-guide.md#turn-on-update-pull-requests). One setting in the repo's GitHub settings.
> **Bring back:** confirmation that the **Sync upstream** workflow ran from the Actions tab.

Explain what to expect: a pull request on Mondays when upstream has changed, with a Netlify preview to look at before merging. Their content is never part of it.

## Hand-off summary

| Step | Send the person to | Bring back | You verify with |
|---|---|---|---|
| 2 | [Install git and Node](setup-guide.md#install-git-and-node) | "Installed" | `git --version`, `node --version` |
| 3 | [Create your private repo](setup-guide.md#create-your-private-repo) | Repo URL | `git remote -v`, `git ls-remote origin main` |
| 12 | [Deploy on Netlify](setup-guide.md#deploy-on-netlify) | `netlify.app` address, deploy result | `curl` for a 200 and the owner's name |
| 13 | [Custom domain](setup-guide.md#custom-domain) | Final address | `curl` for a 200 over HTTPS; `og:url` in page source |
| 14 | [Analytics](setup-guide.md#analytics) | `GTM-…` ID, Realtime confirmation | `GTM-` ID in page source |
| 14 | [Microsoft Clarity](setup-guide.md#microsoft-clarity) | Project ID, session confirmation | `clarity.ms/tag/` ID in page source |
| 16 | [Turn on update pull requests](setup-guide.md#turn-on-update-pull-requests) | Workflow ran | Their confirmation |

## Hard rules

These repeat the rules at the top, as a final check before you finish any session.

- Nothing on the site is invented. Every fact traces to a `confirmed` line in `personal/notes.md`, and every gap is on the open items list.
- No edits to `sample/` or to code files for a content change.
- No `.env`, `.env.local` or `personal/` files in any commit.
- No analytics IDs, secrets or API keys in XML, markdown or code.
- No credentials entered, accounts created, terms accepted, purchases made or DNS changed by you.
- No push to `main` without the owner's go-ahead for that push.
