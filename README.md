# productPortfolio

A portfolio site for product and technology professionals, built to turn hiring managers who click your resume link into interviews.

It gives you role-specific landing pages for each kind of job you apply to, case studies and product briefs, a personalized `/hello?name=` page for your email signature, and a blog with copyable AI prompts. All of the copy lives in XML and markdown, so you never touch code to update it.

Out of the box it builds with a fictional sample persona, Riley Carter, so you can see every feature before you add your own story.

Next.js 16 (static export) · React 19 · TypeScript · Tailwind CSS 4 · Motion · Netlify

## Quick start

1. **Make your own private repo.** Create an empty private repo on GitHub, then:

   ```bash
   git clone https://github.com/m0r0ccomole/productPortfolio.git my-site
   cd my-site
   git remote rename origin upstream
   git remote add origin https://github.com/YOU/YOUR-REPO.git
   git push -u origin main
   ```

   No terminal? Use the **Use this template** button instead.
2. **Copy the sample:** `cp -r sample/content content`
3. **Make it yours.** Edit the XML and markdown in `content/`, add your images under `public/images/`, and recolor in `content/theme.js`.
4. **Push:** `git add -A && git commit -m "My content" && git push`
5. **Connect Netlify.** Import the repo; `netlify.toml` already has the build settings. It builds and deploys every push to `main`.

To run it locally: `npm install`, then `npm run dev` and open http://localhost:3000.

**New to git, Netlify or analytics?** [docs/setup-guide.md](docs/setup-guide.md) walks you through every account and every click, from an empty repo to a live site with working analytics.

**Using an AI agent?** Point it at [docs/agent-setup-guide.md](docs/agent-setup-guide.md). It's a runbook that interviews you, drafts the content with you, and sends you to the setup guide for the steps only you can do.

## Getting updates

Your `content/` and `public/images/` are never part of this repo, so updates can't collide with them. A workflow opens a pull request in your repo whenever there's something new (one setting to enable; see [docs/development.md](docs/development.md#automatic-updates)). Or pull by hand:

```bash
git pull upstream main
```

## Documentation

- [docs/setup-guide.md](docs/setup-guide.md): for people. Build your site start to finish, including Netlify, a custom domain and analytics
- [docs/agent-setup-guide.md](docs/agent-setup-guide.md): for AI coding agents. The runbook for setting a site up with its owner
- [docs/content-authoring.md](docs/content-authoring.md): every XML field, blog posts, prompt blocks
- [docs/design-system.md](docs/design-system.md): colors, motion, and how to restyle
- [docs/architecture.md](docs/architecture.md): how the code fits together
- [docs/development.md](docs/development.md): commands, environment variables, deploys, updates
- [CLAUDE.md](CLAUDE.md): instructions for AI coding agents

## License

The code is licensed under [GPL-3.0-or-later](LICENSE). Your `content/` folder and your images are yours and are not covered by it.

If you use this for a business, please keep the footer credit link (the `<credit>` element in `content/global-elements.xml`). Personal sites can remove it.

The GPL doesn't require you to publish your site's source just because it's online. If you improve the code, though, please send it back: see [CONTRIBUTING.md](CONTRIBUTING.md).
