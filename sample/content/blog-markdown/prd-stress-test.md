---
title: "Stress-Test Your PRD Before Engineering Does"
date: "2026-10-05"
category: "Product"
excerpt: "A prompt that reads your requirements doc like a skeptical tech lead and tells you what's missing."
slug: "prd-stress-test"
listed: true
---

# Stress-test your PRD

The worst time to find a hole in a requirements doc is sprint planning. The second worst is a week into the build. I now run every PRD past a model playing the most skeptical engineer I've worked with before anyone else sees it.

:::prompt
You are a senior tech lead reviewing a product requirements document before it goes to the team. {{comment: Naming a role gets you sharper questions than "review this".}}

Read the attached PRD and list:
1. Requirements that two engineers could reasonably build two different ways {{comment: Ambiguity is the most common gap, so it goes first.}}
2. Edge cases and failure states the document doesn't cover
3. Dependencies on other teams, vendors or data that aren't called out
4. Success metrics that can't be measured with the data we have today {{comment: Delete this item if your PRD has no metrics section yet.}}

For each item, quote the line from the PRD it refers to and suggest one question I should answer. Don't rewrite the document.
:::

Run it, answer the questions, and run it again. Two rounds usually catches the gaps that would otherwise surface on day three of the build.
