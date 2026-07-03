---
title: Setting Up a Next.js Blog
excerpt: A minimal App Router setup with static pages and markdown-style posts.
date: 2026-05-28
coverLabel: nextjs
tags:
  - nextjs
  - meta
  - web
---

This site runs on Next.js with the App Router, TypeScript, and Tailwind CSS.

The structure is intentionally simple:

1. Static pages for home, about, and contact
2. A blog index and per-post routes
3. Post content stored as Markdown files under content/notes

## Project layout

```bash
content/notes/   # markdown posts
app/             # Next.js routes
lib/             # shared helpers
```

New posts support frontmatter tags and fenced code blocks with copy buttons.
