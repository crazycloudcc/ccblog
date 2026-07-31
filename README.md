# ccblog

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Next.js](https://img.shields.io/badge/Next.js_16-000?logo=next.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)
![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

A terminal-themed personal blog and small web lab - markdown notes, in-browser search, and a C/C++ playground that runs entirely in the browser.

**Live site:** [crazycloud.cc](https://crazycloud.cc) · **中文文档:** [README.zh-CN.md](README.zh-CN.md)

---

## What it is

**ccblog** is a Next.js site styled like a macOS terminal session. Posts live as markdown files; the UI leans into `cd`, `cat`, `grep`, and panel chrome rather than a conventional blog layout.

It is built to be forked: edit one config file, drop in your notes, deploy.

### Highlights

| Area | What you get |
|------|----------------|
| **Blog** | Markdown + frontmatter, tag & series filters, reading time, prev/next, related posts |
| **Search** | [Pagefind](https://pagefind.app/) static index, built on `postbuild` |
| **Playground** | C11 / C++17 compile & run via [browsercc](https://www.npmjs.com/package/browsercc) WASM - Monaco editor, stdin, share links, compile timeline |
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
- [Pagefind](https://pagefind.app) for client-side search

---

## Fork & deploy

**Requirements:** Node.js 20+, npm 9+.

```bash
# 1. Fork on GitHub, then clone your fork
git clone https://github.com/<your-username>/ccblog.git
cd ccblog
npm install

# 2. Make it yours
cp ccblog.config.example.ts ccblog.config.ts   # optional: blank, commented template
#    edit ccblog.config.ts -> name, author, social links, url, feature flags

# 3. Run locally
npm run dev    # http://localhost:3000

# 4. Deploy on Vercel
#    Import the repo at https://vercel.com/new, set NEXT_PUBLIC_SITE_URL, deploy.
```

That is the whole loop. `npm run build` validates `ccblog.config.ts` and skips the optional App Store sync when `/apps` is off - a fork with no iOS apps needs no extra cleanup. For a detailed walkthrough, see the **Start Up** post (`content/notes/nextjs-blog-setup.md`).

---

## Configure

`ccblog.config.ts` at the repo root is the single rebrand surface - identity, social links, feature flags, and the App Store ID all live there. Everything works with zero environment variables on `npm run dev`; in production set the canonical URL:

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

Feature flags in `ccblog.config.ts` (`features.blog`, `features.apps`, `features.playground`, `features.about`) toggle whole routes - nav, sitemap, and the apps sync all respect them. `/apps` defaults to **off**.

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

The filename becomes the URL (`/blog/my-post`). The body supports standard markdown, fenced code, images, and custom blocks (`:::trace`, `:::bench`, `:::annotate`, `:::playground`, …) - see `content/notes/content-blocks.md` for examples.

---

## Scripts

```bash
npm run dev          # local dev (webpack)
npm run build        # validate config -> sync apps -> build -> pagefind index
npm run start        # serve the production build
npm run lint         # eslint
npm run sync:apps    # refresh lib/apps.ts from the iTunes API
```

`npm run build` runs:

1. **prebuild** - `validate-config.mjs` checks `ccblog.config.ts`, then `sync-apps.mjs` syncs App Store metadata (skipped when `features.apps` is false)
2. **build** - Next.js static generation
3. **postbuild** - Pagefind search index into `public/pagefind/`

Search on `/blog` needs a production build; `next dev` alone does not generate the index.

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Home - boot sequence + recent notes |
| `/blog` | Notes list, tag/series filters, search |
| `/blog/[slug]` | Post detail |
| `/playground` | In-browser C/C++ editor & runner |
| `/apps` | App Store releases (optional, off by default) |
| `/about` | About & contact |
| `/feed.xml` | RSS |

---

## Playground toolchain

| Environment | Source |
|-------------|--------|
| **Development** | `/api/toolchain` - local proxy (GitHub release, falls back to `node_modules/browsercc`) |
| **Production** | [unpkg](https://unpkg.com) CDN (`browsercc@0.1.1`), overridable via `NEXT_PUBLIC_TOOLCHAIN_BASE` |

Toolchain files are not bundled into the deployment (keeps Vercel Hobby under size limits). The browser fetches and caches them on first load.

---

## Project layout

```
app/              # Next.js routes & API
components/       # UI (terminal shell, blog, playground, …)
content/notes/    # Markdown posts
lib/              # Site config adapter, posts parser, playground core
ccblog.config.ts  # the single rebrand surface
scripts/          # Build helpers (config validation, apps sync)
public/           # Static assets (pagefind index generated at build)
```

---

## Contributing

Bug fixes, new content-block directives, social icons, and docs are all welcome - see [CONTRIBUTING.md](CONTRIBUTING.md). The golden rule: never hardcode identity into a component; route it through `ccblog.config.ts` via `lib/site.ts`.

## Author

Built and maintained by [crazycloudcc](https://github.com/crazycloudcc). Questions or forks welcome - see `/about` on the live site for contact links.

---

## License

[MIT](LICENSE) © 2026 crazycloudcc
