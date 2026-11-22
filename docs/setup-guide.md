# Setup guide

This guide takes you from nothing to a live portfolio site with working analytics. It is written for a person doing each step with a few browser tabs open. You do not need to have used git, a terminal, Netlify or Google Tag Manager before.

Working with an AI coding agent (Claude Code, Cursor, Copilot and similar)? The agent follows its own runbook, [`agent-setup-guide.md`](agent-setup-guide.md), and sends you back here for the parts only you can do. See [Choose your path](#choose-your-path).

## What you are building

A website at your own address that backs up your resume. When it is done you will have:

- A home page with your headline numbers and best case studies.
- A landing page for each kind of role you apply for, at `/resume/<id>` (for example `/resume/fintech`). You put the matching link on each version of your resume.
- A page for people you email, at `/hello`, that can greet them by first name.
- Case studies, product briefs, an About page, a projects page and an optional blog.
- Optional analytics that tell you which links get visits and whether visitors press the contact button.

All of your text lives in a folder of XML and markdown files called `content/`. You change the site by editing those files. You never edit code.

Until you add your own content, the site shows a fictional sample person, Riley Carter, so you can see every feature first.

## What you need

### Accounts

| Service | What it does | Cost | Required? |
|---|---|---|---|
| [GitHub](https://github.com/) | Stores your site's files and their history | Free | Yes |
| [Netlify](https://www.netlify.com/) | Builds the site and puts it online | The free plan is enough. See [Free plan limits](#free-plan-limits) | Yes |
| A domain registrar (any) | Sells you an address such as `yourname.com` | Roughly $10 to $20 a year for a `.com` | No. Without one, your address is `something.netlify.app`, which works but looks less polished on a resume |
| [Google Analytics 4](https://analytics.google.com/) and [Google Tag Manager](https://tagmanager.google.com/) | Count visits per page and per link, and record contact button clicks | Free | No. Without them you cannot tell which resume links get opened |
| [Microsoft Clarity](https://clarity.microsoft.com/) | Records anonymized sessions and heatmaps so you can watch how visitors move through a page | Free | No. Without it you get counts but cannot see what people did |

Prices and plan limits change. Check each service's pricing page before you rely on the numbers here.

### On your computer

- git and Node.js 24 ([Install git and Node](#install-git-and-node)).
- A text editor. [Visual Studio Code](https://code.visualstudio.com/) is free and colors XML so mistakes are easier to spot.

### Material

- Your resume, or a LinkedIn profile export.
- Three or four numbers you can defend in an interview.
- Two to six projects you can write up: the situation, the problem, what you did, the result.
- A headshot, and any screenshots you have the right to publish.
- Testimonials, if the people quoted have agreed.

### Time

| Part | Realistic time |
|---|---|
| Accounts, installs, repo, first look at the sample | 1 to 2 hours |
| Writing your content | Several evenings. This is most of the work |
| Netlify deploy | 30 minutes |
| Custom domain | 30 minutes of clicking, then a wait of minutes to 48 hours for DNS |
| Analytics | 1 to 2 hours, including checking that it works |

## Choose your path

**Path A: with an AI coding agent.** The agent runs the commands, interviews you about your career and drafts the content files. You review everything it writes. Open the agent in an empty folder and say:

> Clone https://github.com/m0r0ccomole/productPortfolio into this folder, read `CLAUDE.md` and `docs/agent-setup-guide.md`, then set up my portfolio site with me. Start with the orientation step.

**Path B: by hand.** Follow this guide top to bottom.

Either way, some sections can only be done by you, because they involve your accounts, your money or your DNS. The agent will stop and send you to them.

| Section | Path A | Path B |
|---|---|---|
| [Install git and Node](#install-git-and-node) | You install, the agent checks | You |
| [Create your private repo](#create-your-private-repo) | You create the repo on GitHub, the agent runs the commands | You |
| [Preview the sample site](#preview-the-sample-site) | Agent | You |
| [Make the content yours](#make-the-content-yours) | Agent drafts from your answers, you review | You |
| [Publish your changes](#publish-your-changes) | Agent, after you say go | You |
| [Deploy on Netlify](#deploy-on-netlify) | **You** | You |
| [Custom domain](#custom-domain) | **You** | You |
| [Analytics](#analytics) | **You** | You |
| [Resume and email signature links](#resume-and-email-signature-links) | You | You |
| [Turn on update pull requests](#turn-on-update-pull-requests) | **You** | You |

## Install git and Node

**git** tracks every change to your files and sends them to GitHub. **Node.js** runs the program that turns your content files into web pages.

You type commands for both into a **terminal**, a window where you type a line of text and press Enter to run it.

| OS | Open a terminal | Install |
|---|---|---|
| Windows | After installing Git for Windows, open the Start menu and run **Git Bash**. Use Git Bash, not Command Prompt or PowerShell; the commands in this guide are written for it | [Git for Windows](https://git-scm.com/download/win) (accept the installer defaults), then the Node 24 installer from [nodejs.org](https://nodejs.org/) |
| macOS | Press Cmd+Space, type **Terminal**, press Enter | Run `xcode-select --install` in Terminal for git, then the Node 24 installer from [nodejs.org](https://nodejs.org/) (or `brew install node@24`) |
| Linux | Your distribution's terminal app | git from your package manager, Node 24 from [nodejs.org](https://nodejs.org/) or a version manager such as `nvm` |

Close and reopen the terminal after installing, then run:

```bash
git --version     # any recent version
node --version    # v24 or later
npm --version
```

Tell git who you are. This name and email are recorded on each change you save:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

**It worked if** all three version commands print a version number and the Node one is `v24` or later.

*No terminal at all?* See the note at the end of [Create your private repo](#create-your-private-repo).

## Create your private repo

A **repo** (repository) is a folder of files plus its history, stored on GitHub. Your site lives in your own private repo. It keeps a link to this project, called the **upstream**, so you can pull in improvements later. GitHub does not allow private forks of public repos, so you clone the project and point it at your own repo instead.

1. Sign up at [github.com](https://github.com/) if you do not have an account.
2. Go to [github.com/new](https://github.com/new). The goal is an empty private repo.
   - **Repository name:** anything, for example `portfolio`.
   - Visibility: **Private**.
   - Leave every "initialize" option off: no README, no .gitignore, no license. The repo must be empty.
   - Select **Create repository**.
3. Copy the repo's address from the page that appears. It looks like `https://github.com/YOU/YOUR-REPO.git`.
4. In your terminal, move to the folder where you keep projects (for example `cd ~/Documents`), then run these one at a time, replacing `YOU/YOUR-REPO`:

   ```bash
   git clone https://github.com/m0r0ccomole/productPortfolio.git my-site
   cd my-site
   git remote rename origin upstream
   git remote add origin https://github.com/YOU/YOUR-REPO.git
   git push -u origin main
   ```

   The last command sends the files to your repo. The first time, git asks you to sign in to GitHub. On Windows a browser window opens for this. If you are asked for a password in the terminal instead, your GitHub account password will not work; see [Troubleshooting](#troubleshooting).

**It worked if** `git remote -v` lists `origin` pointing at your repo and `upstream` pointing at `m0r0ccomole/productPortfolio`, and your repo's page on GitHub now shows the files.

From here on, run every command from inside the `my-site` folder.

*No terminal?* On the [upstream repo page](https://github.com/m0r0ccomole/productPortfolio), choose **Use this template**, then **Create a new repository**, and make it private. This skips the commands above. Updates still work; the update workflow handles the one difference for you. To edit files you can either clone the repo later, or use GitHub's web editor (open your repo and press the `.` key). With the web editor you cannot preview the site on your own computer, and every change you save to `main` goes straight to the live site.

## Preview the sample site

In the terminal, inside `my-site`:

```bash
npm install
npm run dev
```

The first command downloads the project's dependencies and takes a minute or two. The second starts a preview that runs on your computer only. Open http://localhost:3000 in your browser.

Click through the home page, a case study, `/resume/fintech`, `/hello?name=Sam` and the blog, so you know what each part is for before you write your own.

To stop the preview, click the terminal and press Ctrl+C. To start it again, run `npm run dev`.

**It worked if** you see Riley Carter's site, and the terminal shows `No content/ folder found, building from sample/content`. That message is expected for now.

## Make the content yours

### Copy the sample content

```bash
cp -r sample/content content
```

This gives you a `content/` folder to edit. From now on, edit only `content/`. Never edit `sample/`; it belongs to the upstream project and is replaced by updates.

**It worked if**, after you stop and restart `npm run dev`, the warning is gone and the site still shows Riley, now read from your `content/` folder.

### Edit the files in this order

Open the `my-site` folder in your editor. Work through the files in the order below. The files refer to each other by id, so finishing one file at a time keeps errors easy to find.

After each file, check your work:

```bash
npm run build
```

**It worked if** the build finishes with a list of pages and no error. See [What a build error looks like](#what-a-build-error-looks-like) if it does not.

Field-by-field detail for every file is in [`content-authoring.md`](content-authoring.md). The tables here cover what you need for a first pass.

**1. `content/global-elements.xml`**

| Element | What to put |
|---|---|
| `<site-title>` | `Name | Short descriptor`, shown in the nav and default page title |
| `<tagline>` | One line |
| `<owner-name>` | Full name; used in page titles, author meta and the footer |
| `<site-url>` | Your final address with no trailing slash. Come back to this in [Custom domain](#custom-domain) |
| `<contact-email>` | Email for every contact button |
| `<scheduling-url>` | Booking link, or delete the line to hide calendar buttons |
| `<credit>` | Footer link back to this project. Keep it if you'd like to say thanks; commercial users are asked to keep it |
| `<global-images>` | Headshot path and alt text, favicon, optional social share image (1200×630 PNG or JPG) |
| `<seo>` | Default description and keywords, plus a title and description per page |
| `<navigation>`, `<buttons>`, `<cta-content>` | Usually fine as is; adjust the wording to taste |

**2. `content/pages.xml`**

- `home`: hero headline and subheading, the 4 headline metrics, featured case studies (each `href` must match a deep dive id), and featured industries (each id must match a page in `industry-pages.xml`).
- `about`: greeting, summary, hero image, timeline events, and the "My Approach" and "Beyond Work" sections.
- `projects`: active projects, then retired projects with a short post-mortem.
- `privacy`: update the contact email in the last section. Revisit the rest once you decide on analytics; see [Keep the privacy page accurate](#keep-the-privacy-page-accurate).
- `blog` and `deep-dives`: the headings, intro and button text of the blog index and the Work & Impact index, as `<label key="…">` entries inside `<labels>`. Keys are listed in [content-authoring.md](content-authoring.md#about-projects-privacy-and-404-pages).
- `not-found`: the 404 page heading, message and button text, inside `<not-found>`.

**3. `content/deep-dives.xml`**

One `<deep-dive>` per write-up. Add `type="product-brief"` for products you launched; leave it off for case studies about problems you solved. `listed="false"` keeps an entry reachable by link but out of the index. Delete every Riley entry you do not replace.

**4. `content/industry-pages.xml`**

One `<page id="…">` per kind of role you apply for. Two to four is typical. The id becomes the address: `/resume/<id>`. Each page has a hero, a relevance statement, three achievements, optional product cards (whose ids must match product-brief deep dives), optional testimonials and a skills list. The `hello` page at the bottom is the email landing page.

**5. `content/testimonials.xml`**

Only real quotes, used with the person's permission. `<image>` is optional.

### Where each string lives

| You want to change… | Edit this file |
|---|---|
| Name, site URL, email, calendar link, site title, tagline, nav, CTA copy, email subjects | `content/global-elements.xml` |
| Page `<title>`s and meta descriptions | `content/global-elements.xml` (`<seo>`) |
| Homepage hero, metrics, featured case studies, industry tiles | `content/pages.xml` (`page id="home"`) |
| About page, timeline | `content/pages.xml` (`page id="about"`) |
| Projects | `content/pages.xml` (`page id="projects"`) |
| Privacy policy | `content/pages.xml` (`page id="privacy"`) |
| Blog index and Work & Impact index headings, intros, buttons | `content/pages.xml` (`page id="blog"`, `page id="deep-dives"`, inside `<labels>`) |
| 404 page | `content/pages.xml` (`page id="not-found"`) |
| Small shared interface text ("Read more", section headings, screen-reader labels) | `content/global-elements.xml` (`<ui-labels>`) |
| Industry landing pages, `/hello` | `content/industry-pages.xml` |
| Case studies, product briefs | `content/deep-dives.xml` |
| Testimonials | `content/testimonials.xml` |
| Blog posts | `content/blog-markdown/*.md` |

### What a build error looks like

When `npm run build` fails, it stops and prints an error instead of the list of pages. Scroll up to the first error. There are two common kinds.

| What you see | What it means | Fix |
|---|---|---|
| A line such as `Error parsing pages XML content:` followed by a message with `Line:` and `Column:` numbers | The named file is not valid XML | Go to that line. Usually it is a bare `&` (write `&amp;`), a `<` in text (write `&lt;`), or a tag that was opened and never closed |
| An error that mentions `undefined` while building a page | A required element is missing, or an id points at something that does not exist | Compare the section you edited with the same section in `sample/content/` and put back whatever is missing |

A blog post with missing front matter does not stop the build. The post is skipped and the output includes a warning that names the file.

Netlify runs the same build. If it fails there, the deploy log shows the same error and your previous version stays online.

### Add images

Put images under `public/images/`, then point the XML at them with paths that start at `/images/`.

| Folder | For | Suggested size |
|---|---|---|
| `public/images/profile/` | Headshot (square), About hero (square) | 800×800 |
| `public/images/products/` | Product card and product brief images (4:3) | 1200×900 |
| `public/images/case-studies/` | Case study images (shown square, open full size on click) | 1200×1200 or larger |
| `public/images/testimonials/` | Testimonial headshots (square) | 200×200 |

Paths are case-sensitive on Netlify even when they work on Windows. Use lowercase file names with hyphens and no spaces. Delete references to `/sample/…` images once you have replaced them.

Only publish screenshots you own or have permission to use. Be careful with anything from a past employer.

**It worked if** `npm run build` passes and the pages with images show them in `npm run dev`.

### Recolor

Edit `content/theme.js`.

| Token | Key | What it controls |
|---|---|---|
| `primary` (50–900) | `colors.primary` | Brand color: buttons, links, accents, focus outline (400). Ten hex codes, light to dark |
| `accent` (50–900) | `colors.accent` | Secondary color: badges, retired-project cards. Ten hex codes |
| Gradients | `gradients` | `bg-gradient-primary`, `-accent`, `-warning`, `-success` |

Pick one or two colors you like and build each ten-step scale from them, with 500 as the base color. Any "Tailwind color scale generator" will do this from a single hex code. Keep the 400 shade dark enough to show as an outline on white.

**It worked if**, after restarting `npm run dev`, buttons, links and the nav underline use your color. More: [`design-system.md`](design-system.md).

### Write the blog (optional)

Replace the posts in `content/blog-markdown/`. Each post is one markdown file that starts with front matter: `title`, `date` (YYYY-MM-DD), `category`, `excerpt`, `slug` (must match the file name), and `listed` (`false` hides a post from the index). Copyable prompts go between `:::prompt` and `:::`. Full syntax: [`content-authoring.md`](content-authoring.md#blog-posts).

It is fine to have no posts. Delete the sample ones and the blog index shows an empty-state message.

### Voice guide (optional)

If an AI agent will draft or revise your copy, give it a description of how you write so the result sounds like you:

```bash
mkdir -p personal
cp sample/voice-guide-template.md personal/voice.md
```

Fill it in from your own writing samples. The sample post "Build a Voice Guide Your AI Will Actually Follow" has a prompt that drafts most of it. The `personal/` folder is never uploaded to GitHub.

## Publish your changes

Saving a file changes it on your computer only. To send your work to GitHub:

```bash
git add -A
git commit -m "My content"
git push
```

`git add` stages every change, `git commit` saves them as one named step in the history, and `git push` uploads them. Once Netlify is connected, every push to `main` also rebuilds and updates the live site.

**It worked if** `git status` says there is nothing to commit, and `content/` and `public/images/` appear in your repo on GitHub.

## Deploy on Netlify

Netlify watches your GitHub repo. Each time you push, it runs the build and puts the result online. The build settings are already in the repo, in `netlify.toml`, so there is very little to configure.

Netlify's dashboard changes from time to time. Each step below names the goal first so you can find the control if a label has moved.

### Sign up and import the repo

1. **Create a Netlify account using GitHub.** Go to [app.netlify.com/signup](https://app.netlify.com/signup) and choose the GitHub sign-up option. GitHub asks you to authorize Netlify to see your account identity. Answer any onboarding questions; the answers do not affect the site.
2. **Start an import.** On your team's dashboard, select **Add new project**, then **Import an existing project**. Choose **GitHub** as the Git provider.
3. **Give Netlify access to this one repo.** GitHub opens a window asking where to install the Netlify app. Pick your account, choose the option to grant access to **only select repositories**, pick your portfolio repo from the list, and confirm. Netlify does not need access to anything else you own.
4. **Pick the repo.** Back in Netlify, select your portfolio repo from the list. If the list is empty or the repo is missing, look for a link named roughly **Configure the Netlify app on GitHub** and add the repo there.
5. **Check the build settings.** Netlify shows a settings screen with values already filled in from `netlify.toml`. Confirm they read:

   | Setting | Value |
   |---|---|
   | Branch to deploy | `main` |
   | Build command | `npm run build` |
   | Publish directory | `out` |

   Do not change them. If they are blank, type those values in. You can add environment variables later.
6. **Deploy.** Select the button at the bottom of the screen. It is labelled something like **Deploy** followed by your project name, or **Publish**.

**It worked if** the **Deploys** page shows a new deploy that goes from building to a successful, published state within a few minutes. Open the deploy to read its log if you want to watch.

### Open the site and make it public

1. On the project overview, find the address ending in `.netlify.app` and open it.
2. If you see a banner saying the project is private, or a friend sees a Netlify page saying they do not have access, the project is in private mode. New Netlify accounts start projects that way. Select **Make public**, or go to **Project configuration > General > Visitor access > Project visibility** and set production deploys to public.

**It worked if** the site opens in a private browser window, where you are not signed in to Netlify, and shows your content rather than Riley's.

### Rename the site address

Netlify gives the project a random name such as `stellar-otter-12ab34`. That name is your address until you add a custom domain.

1. Go to **Project configuration > General > Project details > Project information**.
2. Select the option to manage the project name (labelled roughly **Manage project name and cover image**) and enter a name such as `yourname`.

**It worked if** the site now opens at `https://yourname.netlify.app`.

### Deploy previews

When someone opens a pull request on your repo (a proposed change that is not yet on `main`), Netlify builds a preview copy at an address like `deploy-preview-42--yourname.netlify.app` and posts the status on the pull request in GitHub. This is on by default. You will use it for [update pull requests](#turn-on-update-pull-requests): look at the preview, and if it looks right, merge.

### Environment variables

An environment variable is a named setting that lives in Netlify rather than in your files. This site uses them for analytics IDs so that the IDs never sit in your repo.

To add one:

1. Go to **Project configuration > Environment variables**.
2. Select **Add a variable** and choose to add a single variable.
3. Enter the key exactly as written in this guide (capitals and underscores matter) and the value. Use the same value for all deploy contexts.
4. Save.

| Key | Value | Set it in |
|---|---|---|
| `NEXT_PUBLIC_GTM_ID` | Your Google Tag Manager container ID, `GTM-XXXXXXX` | [Analytics](#analytics) |
| `MICROSOFT_CLARITY_ID` | Your Clarity project ID | [Microsoft Clarity](#microsoft-clarity) |
| `SITE_URL` | Optional. Overrides `<site-url>` | [Custom domain](#custom-domain) |
| `LAST_UPDATED` | Optional. Pins the footer date, `YYYY-MM-DD` | Any time |

**A variable does nothing until the next deploy.** The values are built into the pages when the site is built. After adding or changing one, [redeploy](#redeploy).

**It worked if** the variable appears in the list with the right key. You confirm the effect after the redeploy.

### Redeploy

To rebuild the site without changing any files:

1. Open the **Deploys** page.
2. Select **Trigger deploy** at the top of the list, then the option that deploys the project (labelled roughly **Deploy project**).

**It worked if** a new deploy appears at the top of the list and finishes successfully.

### Free plan limits

At the time of writing, Netlify's free plan gives 300 credits a month, and each successful production deploy uses 15. That is about 20 pushes to `main` a month, before counting the smaller amounts that visits use. Deploy previews and failed builds are free. If the credits run out, Netlify pauses the site until the next month.

So do your editing with `npm run dev` on your own computer, and push when a batch of changes is ready, not after every sentence. Check [Netlify's pricing page](https://www.netlify.com/pricing/) for the current numbers.

## Custom domain

Optional, and worth it for a link that goes on a resume. If you skip it, set `<site-url>` to your `https://yourname.netlify.app` address ([Tell the site its address](#tell-the-site-its-address)) and move on.

### Buy a domain

Buy from any registrar (Namecheap, Cloudflare, Porkbun, Squarespace and many others), or buy one inside Netlify in the next step. A short version of your name on `.com` is the safe choice. Decline any add-ons for hosting or site builders; you only need the domain.

### Add it to Netlify

1. In your Netlify project, open **Domain management**. In the production domains section, select **Add a domain**.
2. Choose **Add a domain you already own** and enter the domain without `www`, for example `yourname.com`. (Or choose **Buy a new domain** and follow the prompts. Netlify then manages the DNS for you and you can skip to [Wait, then check HTTPS](#wait-then-check-https).)
3. Confirm. Netlify lists the domain and its `www` version, marked as waiting for DNS.

### Point the domain at Netlify

DNS is the address book that tells browsers which server answers for `yourname.com`. Right now your registrar holds that address book. You have two ways to send the domain to Netlify.

| | Netlify DNS | External DNS |
|---|---|---|
| What you do | Hand the whole address book to Netlify by changing the **name servers** at your registrar | Keep the address book at your registrar and add two records there |
| Good when | The domain is new and used for nothing else | The domain already has email or other services on it |
| Watch out for | Existing records (such as MX records for email) stop working unless you copy them into Netlify first | Certificate setup can take a little longer |

**Option 1: Netlify DNS.**

1. In **Domain management**, open the options next to your domain and choose **Set up Netlify DNS**. Follow the prompts.
2. Netlify shows four name servers. Copy them.
3. In your registrar's dashboard, find the name server setting for the domain (often under "DNS" or "Nameservers"), switch it to custom name servers, and replace what is there with Netlify's four. Save.

**Option 2: External DNS.** In your registrar's DNS settings, add the records Netlify shows on screen for your domain. Use Netlify's on-screen values if they differ from this table.

| Type | Name / host | Value |
|---|---|---|
| `A` | `@` (the bare domain) | `75.2.60.5` |
| `CNAME` | `www` | `yourname.netlify.app` (your project's address, without `https://`) |

Some DNS providers offer an `ALIAS`, `ANAME` or flattened `CNAME` record for the bare domain. If yours does, Netlify recommends pointing that at `apex-loadbalancer.netlify.com` instead of using the `A` record. Remove any old `A` or `CNAME` records for `@` and `www` that the registrar created as placeholders.

### Wait, then check HTTPS

DNS changes often take effect within an hour and can take up to 48 hours. You cannot speed this up.

Once the domain resolves, Netlify issues a free certificate so the site loads over `https://`. This is automatic. You can watch the status under **Domain management > HTTPS**.

**It worked if** `https://yourname.com` opens your site with a padlock in the address bar, and **Domain management** shows the domain without a pending-DNS warning. Check both the bare domain and `www`.

### Tell the site its address

The site uses its own address in the tags that control link previews.

1. Open `content/global-elements.xml` and set `<site-url>` to the final address, for example `https://yourname.com`, with no trailing slash.
2. [Publish the change](#publish-your-changes).

`SITE_URL` in Netlify is an optional override for the same value. You do not need it. If you do set it, make it match `<site-url>` and redeploy.

**It worked if**, on the live site, right-clicking the page, choosing **View page source** and searching for `og:url` shows your final address.

## Analytics

Optional. The site's job is to turn resume clicks into conversations, and analytics is how you find out whether that is happening. Both tools are off until you set their variable in Netlify.

### How tracking works on this site

- **Google Tag Manager (GTM)** is a container. The site loads it on every page when `NEXT_PUBLIC_GTM_ID` is set. On its own it measures nothing; you add tags inside it.
- **Google Analytics 4 (GA4)** is where the numbers and reports live. You connect it by adding one tag inside GTM.
- **Microsoft Clarity** is separate. The site loads it directly when `MICROSOFT_CLARITY_ID` is set.

You never paste a code snippet into the site. Both dashboards will offer you a snippet to install; skip that every time. The site already contains the code and only needs the IDs.

The order matters: GA4 first (to get a Measurement ID), then GTM, then Netlify, then verify.

### Create a GA4 property

The goal is a property with one web data stream, and its Measurement ID.

1. Go to [analytics.google.com](https://analytics.google.com/) and sign in with a Google account. If you have never used Analytics, select **Start measuring**. Otherwise open **Admin** (the gear icon), select **Create**, then **Account**.
2. **Account:** enter an account name (your own name is fine) and set the data sharing options as you prefer.
3. **Property:** enter a property name such as `Portfolio`, and choose your reporting time zone and currency.
4. **Business details and objectives:** pick the closest options. They only change which default reports you see.
5. Select **Create** and accept the terms.
6. **Data stream:** choose **Web**. Enter your site's address and a stream name, leave **Enhanced measurement** on, and select **Create stream**. If you were not prompted, find this under **Admin > Data collection and modification > Data streams > Add stream**.
7. Analytics now offers instructions for installing a Google tag. Close them.
8. On the stream's details page, copy the **Measurement ID**. It starts with `G-`.

**It worked if** you have a `G-XXXXXXXXXX` ID written down. You can find it again under **Admin > Data streams** by opening the stream.

### Create a GTM container

The goal is a web container and its container ID.

1. Go to [tagmanager.google.com](https://tagmanager.google.com/) and sign in with the same Google account.
2. Select **Create Account**.
3. **Account setup:** enter an account name and your country.
4. **Container setup:** enter a container name (your domain is a good choice) and choose **Web** as the type.
5. Select **Create** and accept the terms of service.
6. Tag Manager shows two code snippets to install. Close that window.
7. Copy the container ID shown near the top of the workspace. It looks like `GTM-XXXXXXX`.

**It worked if** you have a `GTM-` ID written down, separate from the `G-` ID. People mix these up: `GTM-` goes into Netlify, `G-` goes inside Tag Manager.

### Add the Google tag and publish

The goal is one tag in the container that sends page views to your GA4 property, published so the live site uses it.

1. In your container's workspace, open **Tags** and select **New**.
2. Name the tag, for example `Google tag - GA4`.
3. Select the **Tag Configuration** box and choose the tag type **Google Tag**. In some accounts the same thing is listed under **Google Analytics**.
4. In **Tag ID**, paste your `G-` Measurement ID.
5. Select the **Triggering** box and choose the built-in initialization trigger that covers all pages (named roughly **Initialization - All Pages**).
6. **Save**.
7. **Publish.** Select **Submit** at the top right, give the version a name such as `Add GA4`, and select **Publish**.

Step 7 is the one people forget. Until you publish, the tag exists only in your draft workspace and the live site sends nothing. Every later change inside GTM needs another publish.

**It worked if** the workspace shows no unpublished changes and the **Versions** tab lists your new version.

### Set the container ID in Netlify

1. Add an [environment variable](#environment-variables) with key `NEXT_PUBLIC_GTM_ID` and your `GTM-XXXXXXX` ID as the value.
2. [Redeploy](#redeploy).

**It worked if**, on the live site, **View page source** contains your `GTM-` ID.

### Verify

Use a browser without an ad blocker for this. Ad blockers and some privacy browsers block Tag Manager, which is also why your numbers will always undercount a little.

1. **GTM Preview.** In Tag Manager, select **Preview**. Enter your live site's address and connect. Your site opens in a new window with a debug badge, and the Tag Assistant tab lists the tags that fired. Your Google tag should be in the fired list.
2. **GA4 Realtime.** In Analytics, open the **Realtime** report under **Reports**. With your site open in another tab, you should appear as a user within a minute or two. Click to another page on your site and a second page view should appear.

**It worked if** both checks pass. Standard reports, as opposed to Realtime, take 24 to 48 hours to fill in.

### Contact button clicks

The site sends an event named `cta_click` to Tag Manager every time a visitor presses a button, the footer **Contact** link, or one of the link cards on `/hello`. Tag Manager receives it but does nothing with it until you tell it to forward the event to Analytics. That takes three pieces inside Tag Manager: variables to read the event's details, a trigger that listens for it, and a tag that sends it to GA4.

The event carries these parameters:

| Parameter | Contains |
|---|---|
| `destination` | Where the click leads. Contact buttons and the footer link start with `mailto:`. The calendar button is your scheduling link |
| `event_label` | A label such as `CTA Section - Primary`, `Footer - Contact` or `Hello - ` followed by the card title, or the destination when the button has no label |
| `action_type` | `navigation` for buttons that lead somewhere |
| `page_path` | The page the visitor was on, without the address's `?` part, so a `?name=` value is never included |
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` | The UTM values in the page address at the moment of the click, or empty |

**1. Variables.** In Tag Manager, open **Variables**. Under **User-Defined Variables**, select **New**, choose the type **Data Layer Variable**, and enter `destination` as the **Data Layer Variable Name**. Leave the version at 2. Name the variable `dlv - destination` and **Save**. Repeat for `event_label`, `action_type` and `page_path`. The `utm_*` ones are optional; GA4 already credits each visit to its tagged link (see the last point below).

**2. Trigger.** Open **Triggers** and select **New**. Choose the type **Custom Event**, enter `cta_click` as the **Event name**, leave it firing on **All Custom Events**, name it `cta_click`, and **Save**.

**3. Tag.** Open **Tags** and select **New**. Name it `GA4 - cta_click`.

1. Choose the tag type **Google Analytics: GA4 Event** and paste your `G-` Measurement ID.
2. Enter `cta_click` as the **Event Name**.
3. Under **Event Parameters**, add one row per variable: `destination` with the value `{{dlv - destination}}`, then the same for `event_label`, `action_type` and `page_path`. Select the variable icon next to the value box to pick them instead of typing.
4. For **Triggering**, choose the `cta_click` trigger.
5. **Save**, then **Submit** and **Publish**.

Then check it:

1. Start **Preview** and click a contact button on your site. In Tag Assistant, `cta_click` appears in the event list on the left. Select it: your `GA4 - cta_click` tag should be under **Tags Fired**, and the **Variables** tab shows the values it read. A mail window may open; close it.
2. In Analytics, open **Admin > Data display > DebugView** while Preview is running. `cta_click` shows up with its parameters. The **Realtime** report lists it by name within a minute or two.

**It worked if** `cta_click` shows up in DebugView or Realtime after you click a button.

**To see the parameters in reports,** register the ones you care about as custom dimensions. In Analytics, go to **Admin > Data display > Custom definitions**, select **Create custom dimension**, choose event scope, and enter the parameter name exactly (for example `destination`). `destination` and `event_label` are the two worth registering. Data for a new dimension starts from the day you create it and takes 24 to 48 hours to show.

Two limits to know about:

- `cta_click` fires for every button on the site, including ones that only move between pages. Contact attempts are the ones whose `destination` starts with `mailto:` or matches your calendar link.
- The `utm_*` parameters on the event are read from the address bar when the button is pressed. If a visitor lands on a tagged link and then moves to another page before pressing a contact button, those parameters are empty. GA4 still credits the whole visit to the tagged link in its own session reports, so use those for attribution (see [What to look at](#what-to-look-at)).

### Microsoft Clarity

The goal is a Clarity project and its project ID.

1. Go to [clarity.microsoft.com](https://clarity.microsoft.com/), select **Sign up**, and choose a sign-in method.
2. Select **New project**. Enter a name and your site's address, then select **Add new project**.
3. Clarity shows installation methods, including a Google Tag Manager option. Skip all of them. The site loads Clarity itself; installing it a second way would load it twice.
4. Open **Settings > Overview** and copy the **Project ID**, a short string of letters and numbers.
5. In Netlify, add an [environment variable](#environment-variables) with key `MICROSOFT_CLARITY_ID` and the project ID as the value. Then [redeploy](#redeploy).

**It worked if**, after you browse a few pages of the live site with no ad blocker, the Clarity dashboard shows a live user. Recordings of finished visits follow shortly after. You can also **View page source** on the live site and search for `clarity.ms/tag/` followed by your ID.

Two things to know. Clarity records what visitors do on the page, with content it considers sensitive masked by default. And for visitors from the EEA, the UK and Switzerland, Clarity sets no cookies unless the site sends it a consent signal. This site has no consent banner, so expect partial data from those regions.

### What to look at

Give it a couple of weeks of real applications before you read anything into the numbers. Then:

| Question | Where to look |
|---|---|
| Which resume landing pages get visits? | GA4: **Reports > Engagement > Pages and screens**. Look at the rows for `/resume/…` and `/hello` |
| Which of my links work? | GA4: **Reports > Acquisition > Traffic acquisition**. Switch the dimension to session source / medium or session campaign to see visits per tagged link |
| Do visitors press the contact button? | GA4: **Reports > Engagement > Events**, then `cta_click`. With the `destination` custom dimension registered, filter to values starting with `mailto:` |
| What do visitors do before they leave? | Clarity: **Recordings**, filtered to a landing page address. Watch five or six. Look for where people stop scrolling |
| Is anything being ignored? | Clarity: **Heatmaps** for the home page and each `/resume/…` page |

Report names in GA4 move around. If a path above does not match, use the search box at the top of Analytics and type the report name.

At job-search volumes, the numbers will be small. Ten visits to `/resume/fintech` in the week after you sent eight applications is a useful signal. A conversion rate is not.

### Tag your links

GA4 can only tell your links apart if each one says where it came from. You do that by adding UTM parameters to the end of the address. GA4 reads them automatically.

| Parameter | Meaning | Examples |
|---|---|---|
| `utm_source` | Where the link sits | `resume`, `email`, `linkedin` |
| `utm_medium` | What kind of placement | `pdf`, `signature`, `profile`, `message` |
| `utm_campaign` | Which batch or target | `fintech-2026-11`, `acme-senior-pm` |

Examples:

```text
https://yourname.com/resume/fintech?utm_source=resume&utm_medium=pdf&utm_campaign=fintech-2026-11
https://yourname.com/hello?utm_source=email&utm_medium=signature
https://yourname.com/hello?name=Sam&utm_source=email&utm_medium=message&utm_campaign=acme-senior-pm
https://yourname.com/?utm_source=linkedin&utm_medium=profile
```

Rules that keep the reports clean:

- Use lowercase and hyphens. `Resume` and `resume` are counted as two different sources.
- The first parameter starts with `?`, the rest with `&`.
- Decide on your values once and write them down. A short list you reuse beats a clever scheme.
- In a PDF resume or an email, put the tagged address behind link text such as `yourname.com` so the visible text stays short.
- Do not tag links between pages of your own site.

Click each tagged link once yourself, then check Realtime to confirm the source shows up.

### Keep the privacy page accurate

The sample privacy text in `content/pages.xml` (`page id="privacy"`) describes basic analytics and says no personal information is collected. Rewrite it to match what you turned on:

- **GA4:** sets cookies and records pages viewed, approximate location, device and referral source.
- **Clarity:** sets cookies and records clicks, scrolling and mouse movement as session replays.
- **`/hello?name=` links:** the first name in the link is part of the page address, so it is recorded by GA4 and Clarity along with the visit. If you use named links, say so, or do not combine them with analytics.
- **No analytics:** remove the analytics and cookie sections.

Two things the site does on its own, which your privacy page can state:

- **Visitors from the EEA, the UK and Switzerland:** analytics cookies are off by default. The site sets Google's consent mode to "denied" for those regions before Tag Manager loads, and the GA4 tag respects it with no setting on your side. GA4 then sends cookieless pings for those visitors, which Google uses to estimate their numbers. Clarity sets no cookies for those regions on its own.
- **Global Privacy Control:** when a visitor's browser sends this signal (Firefox, Brave and DuckDuckGo support it), neither Tag Manager nor Clarity loads at all.

The site has no consent banner, so EEA, UK and Swiss visitors can't opt in. If you need more than these defaults, find out what applies to you. This guide is not legal advice.

The "Last updated" date on the privacy page is the same date as the footer: the build date, or `LAST_UPDATED` if you set it. If your privacy text refers to that date as its effective date, set `LAST_UPDATED` in Netlify to the day you last changed the policy, or accept that every deploy moves it.

## Resume and email signature links

The site has two kinds of entry page, and each is meant for a specific place.

**`/resume/<id>`: one per version of your resume.** If you keep a fintech resume and a platform resume, each links to its own page, where the headline, achievements and case studies match what that reader is hiring for. Put the link in the resume header next to your email, and in the application form's "website" field. The ids come from `content/industry-pages.xml`.

**`/hello`: for people you email.** It thanks the reader for clicking through and points them at your best proof.

- In your email signature, link to `/hello`. Signatures are the same for everyone, so this shows the general greeting.
- In a one-to-one email to a recruiter or hiring manager, link to `/hello?name=Sam`. The page then greets Sam by name. The name is whatever follows `name=`; write a space as `%20` (`?name=Mary%20Ann`). Use first names only.
- The greeting text, the links offered and the closing line are in `content/industry-pages.xml` under `page id="hello"`.

Add UTM parameters to all of these as shown in [Tag your links](#tag-your-links).

**It worked if** `/hello?name=Test` on the live site greets "Test", `/hello` shows the general greeting, and every `/resume/<id>` link you plan to use opens the right page.

## Turn on update pull requests

The upstream project keeps improving. Your repo includes a workflow that checks for updates every Monday and, when there are any, opens a **pull request**: a proposed set of changes you can inspect before accepting. Your `content/` and `public/images/` are never part of an update.

Turn it on once:

1. In your repo on GitHub, go to **Settings > Actions > General**.
2. Scroll to **Workflow permissions** and tick **Allow GitHub Actions to create and approve pull requests**. Save.

When a pull request titled "Updates from …" appears:

1. Open it and wait for the Netlify deploy preview check to finish.
2. Open the preview link and click around your site.
3. If it looks right, select **Merge pull request**. Merging updates `main`, which redeploys the live site.

**It worked if**, under the **Actions** tab, you can open the **Sync upstream** workflow, select **Run workflow**, and the run finishes with a green tick. If there was nothing new, the log says so and no pull request is opened.

To update by hand instead:

```bash
git pull upstream main
```

Your content never conflicts. A conflict only happens in a code file you changed yourself. Details, including the optional `SYNC_TOKEN`: [`development.md`](development.md#getting-upstream-updates).

## Pre-launch checklist

Content:

- [ ] No Riley Carter text left: `grep -ri "riley\|example.com" content/` prints nothing
- [ ] No sample image paths left: `grep -r "/sample/" content/` prints nothing
- [ ] Sample blog posts you don't want are deleted from `content/blog-markdown/`, including `draft-example.md`, which is unlisted but still reachable by link
- [ ] Every number on the site is one you can defend in an interview
- [ ] Every testimonial is real and approved by the person quoted
- [ ] `npm run build` passes with no warnings about missing content

Live site:

- [ ] The site opens in a private browser window (the Netlify project is public)
- [ ] The address uses `https://` and both the bare domain and `www` work
- [ ] `<site-url>` matches the final address
- [ ] Contact buttons open an email to the right address
- [ ] `/hello?name=Test` greets "Test"
- [ ] Each `/resume/<id>` page loads and links to real case studies
- [ ] The site reads well on a phone

Analytics, if you use it:

- [ ] The GTM container is published and your own visit shows in GA4 Realtime
- [ ] A button click shows as `cta_click` in Realtime
- [ ] Clarity shows a session
- [ ] The privacy page names the right email and matches the analytics in use
- [ ] Each link on your resume and in your signature carries UTM parameters, and you have clicked each one

## Troubleshooting

| Symptom | Fix |
|---|---|
| `git push` asks for a password and rejects it | GitHub does not accept account passwords from the terminal. Install the [GitHub CLI](https://cli.github.com/), run `gh auth login`, choose HTTPS and sign in through the browser, then push again |
| `node` errors on `npm install` | Node is not version 24. Check with `node --version` |
| Build error mentioning XML | A bare `&` (use `&amp;`), an unclosed tag, or a missing required element in the named file. See [What a build error looks like](#what-a-build-error-looks-like) |
| Site still shows Riley | There is no `content/` folder at the top level of the repo, or it was not pushed. Redo [Copy the sample content](#copy-the-sample-content), then [publish](#publish-your-changes) |
| Netlify cannot find the repo during import | The Netlify GitHub app was not given access to it. Use the configure link on the import screen and add the repo |
| Netlify deploy fails but the build works on your computer | Open the deploy log and read the first error. Often a file name's capital letters do not match the path in the XML |
| Visitors see a Netlify "no access" page | The project is private. See [Open the site and make it public](#open-the-site-and-make-it-public) |
| The site says it is paused or unavailable | The month's Netlify credits ran out. See [Free plan limits](#free-plan-limits) |
| Custom domain does not load after a day | Compare the records at your registrar with the ones Netlify shows. Remove leftover placeholder records for `@` and `www` |
| Browser warns the site is not secure | The certificate has not been issued yet. Check **Domain management > HTTPS** once DNS has taken effect |
| An image is missing on Netlify but fine locally | The file name's capital letters do not match the XML path |
| A product card or link goes to a 404 | Its id does not match any `<deep-dive id>` or industry `<page id>` |
| Blog post missing from the index | `listed: false`, or a required front matter key is missing (the build prints a warning) |
| Calendar button missing | There is no `<scheduling-url>` in `global-elements.xml` |
| GA4 Realtime shows nothing | In order: the variable is named exactly `NEXT_PUBLIC_GTM_ID`; you redeployed after setting it; the page source contains your `GTM-` ID; the GTM container is published; the tag holds the `G-` ID, not the `GTM-` one; your ad blocker is off |
| Page views work but `cta_click` never appears | The `cta_click` trigger or GA4 event tag is missing, or the container was not published after adding them. See [Contact button clicks](#contact-button-clicks) |
| Clarity shows nothing | The variable is named exactly `MICROSOFT_CLARITY_ID`, you redeployed, and your ad blocker is off |
| No update pull requests | The permission in [Turn on update pull requests](#turn-on-update-pull-requests) is not enabled, or the workflow opened an issue instead. Check the repo's Issues tab |

More: [`development.md`](development.md#troubleshooting).

## Going further

- **New page with an existing shape:** add an entry to `industry-pages.xml` or `deep-dives.xml`. The address is created automatically.
- **One-off page layout:** copy `pages/index.tsx` (read its `// ROLE:` header). Layout can be unique; strings still come from XML. This is a code change, so consider sending it upstream ([CONTRIBUTING.md](../CONTRIBUTING.md)).
- **Restyling:** [`design-system.md`](design-system.md).

For a content change, leave these alone: `sample/` (replaced on updates), `lib/contentParser.ts`, `lib/motion.ts`, `styles/globals.css` and `components/templates/`. Every code file you edit is a place where a future update might conflict.
