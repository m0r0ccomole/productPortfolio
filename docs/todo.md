# Project TODO

Known open work on this project. Check items off or add to the list as work happens; don't let debt live only in commit messages or chat history.

Related: a `NOTE:` line in a file's `// ROLE:` header is the file-local version of an entry here. Keep both in sync when an item is resolved.

## Content/design separation — remaining inline labels

Goal: a site owner fills in `content/` and `content/theme.js` without touching `/components/` or `/pages/`. Every owner-specific value and page-level copy block is already in XML. These generic UI labels are still inline in JSX:

- [ ] `components/templates/DeepDive.tsx`: "The Problem", "The Opportunity", "Evidence you can see in action"
- [ ] `components/templates/IndustryLanding.tsx`: "Here's What I Bring", "Key Achievements", "View more of my work →", "Relevant Skills"
- [ ] `components/Testimonials.tsx`: "What Others Say"
- [ ] `components/BlogPostCard.tsx`: "Read more →"
- [ ] `components/Layout.tsx`: footer "Privacy Policy" / "Contact" links, "Skip to main content"
- [ ] `pages/privacy.tsx`: "Last updated:" prefix
- [ ] `pages/hello.tsx`: fallback "Hello there!" / "Thanks for visiting." when the hello page is missing from XML

## Lint warnings (non-blocking)

- [ ] `@next/next/no-img-element` in the image components. `next/image` needs a loader under static export; `<img>` is intentional for now.
- [ ] `@next/next/next-script-for-ga` in `pages/_document.tsx`. Consider `@next/third-parties/google` for GTM.
