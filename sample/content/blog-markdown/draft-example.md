---
title: "An Unlisted Draft"
date: "2026-10-20"
category: "Meta"
excerpt: "Reachable by direct link, hidden from the blog index."
slug: "draft-example"
listed: false
---

# An unlisted draft

Setting `listed: false` in the front matter keeps a post out of the `/blog` index while it stays reachable at `/blog/draft-example`. Use it to share a draft for review, or for a post you only want people to find from a specific link.

Everything else works the same, including prompt blocks:

:::prompt
Summarize this draft in three bullet points. {{comment: Comments like this one show on the page but are left out when someone copies the prompt.}}
:::
