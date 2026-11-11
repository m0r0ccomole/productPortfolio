# Contributing

Improvements are welcome: bug fixes, new templates, better docs, accessibility, performance.

## What belongs upstream

Code, docs, config, workflows, and the sample persona in `sample/` and `public/sample/`.

What never does: anything in `content/` or `public/images/`. Those are each site owner's own files. A check on every pull request rejects changes to them.

## How to send a change

1. Branch from the upstream, not from your site's `main`, so your content can't come along:

   ```bash
   git fetch upstream
   git checkout -b my-fix upstream/main
   ```

2. Make the change. If you add an XML field, add it to `lib/types.ts` first, then the parser, then fill it in under `sample/content/` so a fresh copy still builds and shows it off.
3. Check it:

   ```bash
   npm run lint
   npm run build
   ```

4. Push the branch to your repo and open a pull request against `m0r0ccomole/productPortfolio`.

Already made the fix on your own site? Commit the code change on its own (no content files in the same commit), then `git cherry-pick` it onto a branch made from `upstream/main`.

## Ground rules

- Follow [CLAUDE.md](CLAUDE.md): types first, no copy in JSX, tokens in `theme.js` and `tailwind.config.js`.
- Keep pull requests small and focused on one change.
- By contributing, you agree your contribution is licensed under GPL-3.0-or-later, the same as the project.
