# ccblog

A terminal-themed personal blog and small web lab — markdown notes, in-browser search, and a C/C++ playground that runs entirely in the browser.

Live site: [crazycloud.cc](https://crazycloud.cc) · [中文文档](README.zh-CN.md)

**License:** [MIT](LICENSE)

---

## What it is

**ccblog** is a Next.js site styled like a macOS terminal session. Posts live as markdown files; the UI leans into `cd`, `cat`, `grep`, and panel chrome rather than a conventional blog layout.

It is meant to be forked: edit `ccblog.config.ts`, write your own notes under `content/notes/`, and deploy.

### Highlights

| Area | What you get |
|------|----------------|
| **Blog** | Markdown + frontmatter, tag & series filters, reading time, prev/next, related posts |
| **Search** | [Pagefind](https://pagefind.app/) static index, built on `postbuild` |
| **Playground** | C11 / C++17 compile & run via [browsercc](https://www.npmjs.com/package/browsercc) WASM — Monaco editor, stdin, share links, compile timeline |
| **Apps** | Optional App Store catalog synced from the iTunes Lookup API at build time |
| **Content blocks** | `:::trace`, `:::bench`, `:::annotate`, `:::playground` directives in posts |
| **Meta** | RSS, sitemap, JSON-LD, Open Graph image |

The home page opens with a short boot sequence (notes type in, then settle). Theme follows light / dark / system, with reduced-motion respected throughout.

---

## Stack

- [Next.js 16](https://nextjs.org) (App Router) · React 19 · TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [gray-matter](https://github.com/jonschlinkert/gray-matter) for post frontmatter
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) + browsercc for `/playground`
- Pagefind for client-side search

---

## Quick start

**Requirements:** Node.js 20+, npm 9+

```bash
git clone https://github.com/crazycloudcc/ccblog.git
cd ccblog
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Configure

Edit `ccblog.config.ts` at the repo root - name, author, social links, feature flags, and App Store ID all live there. That single file is all you need to rebrand after a fork. Prefer a clean slate? `cp ccblog.config.example.ts ccblog.config.ts` for a blank, commented template. `npm run build` validates the config and fails fast with clear errors if a field is missing or invalid. Set the production URL:

```bash
# .env.local (not committed)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

| Variable | When | Purpose |
|----------|------|---------|
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical URL for RSS, sitemap, Open Graph |
| `NEXT_PUBLIC_CCBLOG_BRANCH` | Optional | Git branch shown in the terminal status bar |
| `APPLE_DEVELOPER_ID` | Optional | Overrides `apps.developerId` for `/apps` sync |
| `NEXT_PUBLIC_TOOLCHAIN_BASE` | Optional | Override Playground WASM CDN in production |

Feature flags in `ccblog.config.ts` (`features.blog`, `features.apps`, `features.playground`, `features.about`) toggle whole routes. `/apps` defaults to **off** - the nav item, sitemap entry, and prebuild App Store sync are all skipped when `features.apps` is false, so a fork with no iOS apps needs no extra cleanup.

A full fork → deploy walkthrough lives in the **Start Up** post (`content/notes/nextjs-blog-setup.md`) on the site.

---

## Scripts

```bash
npm run dev          # local dev (webpack)
npm run build        # sync apps → build → pagefind index
npm run start        # production server
npm run lint         # eslint
npm run sync:apps    # refresh lib/apps.ts from iTunes API
```

`npm run build` runs three steps:

1. **prebuild** — sync App Store metadata (if configured)
2. **build** — Next.js static generation
3. **postbuild** — Pagefind index into `public/pagefind/`

Search on `/blog` needs a production build; `next dev` alone does not generate the index.

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Home — boot sequence + recent notes |
| `/blog` | Notes list, tag/series filters, search |
| `/blog/[slug]` | Post detail |
| `/playground` | In-browser C/C++ editor & runner |
| `/apps` | App Store releases (optional) |
| `/about` | About & contact |
| `/feed.xml` | RSS |

---

## Playground toolchain

| Environment | Source |
|-------------|--------|
| **Development** | `/api/toolchain` — serves WASM from `node_modules/browsercc` |
| **Production** | [unpkg](https://unpkg.com) CDN (`browsercc@0.1.1`), overridable via `NEXT_PUBLIC_TOOLCHAIN_BASE` |

Toolchain files are not bundled into the deployment package (keeps Vercel Hobby under size limits). The browser caches them after the first load.

---

## Writing posts

Add markdown files under `content/notes/`:

```yaml
---
title: My Post
excerpt: One-line summary for lists and RSS.
date: 2026-07-08
tags:
  - nextjs
series: my-series        # optional
difficulty: intermediate # optional
---
```

Body supports standard markdown, fenced code, images, and custom blocks (`:::trace`, `:::bench`, `:::annotate`, `:::playground`, …). See `content/notes/monospace-on-the-web.md` for examples.

---

## Deploy

CI (`.github/workflows/ci.yml`) runs lint + build on push and PR. [Vercel](https://vercel.com) is the path of least resistance; any host that runs `next start` works.

Set `NEXT_PUBLIC_SITE_URL` in the host environment before the first production deploy.

---

## Project layout

```
app/              # Next.js routes & API
components/       # UI (terminal shell, blog, playground, …)
content/notes/    # Markdown posts
lib/              # Site config, posts parser, playground core
public/           # Static assets (pagefind index generated at build)
scripts/          # Build helpers (apps sync, toolchain publish)
```

---

## Author

Built and maintained by [crazycloudcc](https://github.com/crazycloudcc).

Questions or forks welcome — see `/about` on the live site for contact links.

---

## License

This project is licensed under the [MIT License](LICENSE).

Copyright (c) 2026 crazycloudcc
