---
title: "Build a Voice Guide Your AI Will Actually Follow"
date: "2026-09-14"
category: "AI"
excerpt: "Feed an AI your own writing and get back a style guide it can use every time it drafts for you."
slug: "build-your-voice-guide"
listed: true
---

# Build a voice guide

Every AI draft sounds like the same polite stranger until you teach it how you write. The fix is a voice guide: a short document that describes your writing so well that a model can imitate it.

## Step 1: Gather samples

Collect as much of your own writing as you can, and sort it by situation: work email, cover letters, social posts, thank-you notes. Keep each situation in its own document. Casual writing can be messy. Anything formal should be your best work, because the model will copy whatever you give it.

## Step 2: Set up a project

Use any assistant that supports projects with uploaded files. Upload your samples, then paste in these instructions. The gray notes explain each part; they won't come along when you copy the prompt.

:::prompt
# Ground rules
{{comment: This trims the flattery most assistants default to. Keep it in every project.}}
Keep feedback factual. Don't praise my writing unless something is specifically and measurably strong, and keep any praise to one sentence.
{{comment: The pause matters. Answering its questions is where most of the useful detail comes from.}}
If you need more information, ask your questions and then stop. Wait for my answers before you continue.

# Source material
These files are samples of my writing:
{{comment: List every file you uploaded with a one-line description, e.g. "work-email.md: emails to my team and stakeholders".}}
[filename]: [what's in it]

# Task
Write a style guide that captures my voice so you can draft emails and posts that sound like me. Cover sentence length, word choice, tone in each situation, phrases I use often, and things I never do. Quote short examples from my samples for each rule.
:::

## Step 3: Save the result

When the guide looks right, save it. If you use this site's template, copy `sample/voice-guide-template.md` to `personal/voice.md` and fill it in from what the AI produced. Coding agents working in this repo read that file before they write anything in your name, and the `personal/` folder never gets committed.
