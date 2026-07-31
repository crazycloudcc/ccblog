---
title: Start Up
excerpt: Fork ccblog, configure it, build locally, and deploy to production.
date: 2026-07-03
coverLabel: nextjs
tags:
  - nextjs
  - meta
  - web
  - deploy
---

This guide walks the full path from **forking the repo** to **a live deployment** of [ccblog](https://github.com/crazycloudcc/ccblog) - a terminal-themed personal blog built with Next.js 16, TypeScript, and Tailwind CSS v4.

## Prerequisites

- **Node.js 20** (matches CI)
- **npm** 9+
- A **GitHub** account (to fork or clone)
- For deployment: a [Vercel](https://vercel.com) account (recommended) or any host that runs `next start`

Optional:

- [GitHub CLI](https://cli.github.com/) (`gh`) if you publish Playground toolchain releases yourself
- Your own **Apple Developer ID** if you want `/apps` to list your App Store titles

## 1. Get the project

### Option A - Fork (recommended for your own blog)

1. Open [github.com/crazycloudcc/ccblog](https://github.com/crazycloudcc/ccblog) and click **Fork**.
2. Clone your fork:

```bash
git clone git@github.com:<your-username>/ccblog.git
cd ccblog
```

### Option B - Clone directly

```bash
git clone git@github.com:crazycloudcc/ccblog.git
cd ccblog
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure the site

All identity, social links, and feature flags live in `ccblog.config.ts` at the repo root - that one file is the whole rebrand surface. Edit it directly, or start from a blank template:

```bash
cp ccblog.config.example.ts ccblog.config.ts
```

Then set your production URL:

```bash
# .env.local (not committed)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical URL for metadata and feeds |
| `NEXT_PUBLIC_CCBLOG_BRANCH` | Optional | Git branch shown in the terminal status bar |
| `APPLE_DEVELOPER_ID` | Optional | Overrides `apps.developerId` for `/apps` sync |
| `NEXT_PUBLIC_TOOLCHAIN_BASE` | Optional | Override Playground WASM CDN in production |

Feature flags in `ccblog.config.ts` (`features.blog`, `features.apps`, `features.playground`, `features.about`) toggle whole routes. `/apps` defaults to **off** - when `features.apps` is false, the nav item, sitemap entry, and prebuild sync are all skipped, so a fork with no iOS apps needs no extra cleanup.

`npm run build` validates `ccblog.config.ts` and fails fast with clear errors if a field is missing or invalid.

## 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Search note:** Pagefind indexes are generated at build time. `grep -R` on `/blog` needs a prior `npm run build` to populate `public/pagefind/`. Dev mode works for everything else without a full build.

## 5. Write notes

Posts live as Markdown files under `content/notes/`:

```bash
content/notes/my-post.md
```

Minimal frontmatter:

```yaml
---
title: My Post Title
excerpt: One-line summary for lists and RSS.
date: 2026-07-03
coverLabel: topic
tags:
  - nextjs
  - deploy
---
```

The filename becomes the URL slug: `/blog/my-post`. The body supports fenced code, images, `::video[Caption](url)`, and the custom `:::` directives shown in `content/notes/content-blocks.md`.

## 6. Production build

```bash
npm run build
```

The build runs three phases automatically:

| Phase | Script | What it does |
|-------|--------|--------------|
| prebuild | `scripts/validate-config.mjs` | Validates `ccblog.config.ts`, then syncs apps (skipped when `features.apps` is false) via `scripts/sync-apps.mjs` |
| build | `next build --webpack` | Static pages, blog routes, API routes |
| postbuild | `pagefind` | Generates `public/pagefind/` search index |

Run a quick smoke test:

```bash
npm run start
```

Lint before you push:

```bash
npm run lint
```

## 7. Deploy

### Vercel (recommended)

1. Push your fork to GitHub.
2. In [Vercel](https://vercel.com/new), **Import** the repository.
3. Framework preset: **Next.js** (auto-detected).
4. Add environment variable:
   - `NEXT_PUBLIC_SITE_URL` = `https://your-domain.com`
5. Deploy.

Vercel runs `npm run build` on each push to `main`. The `prebuild` and `postbuild` hooks run as part of that command - no extra build-step configuration needed.

6. After deploy, attach your custom domain under **Project -> Settings -> Domains**.
7. Update `NEXT_PUBLIC_SITE_URL` to match the final domain and redeploy if you changed it.

### Other Node hosts

Any platform that supports Next.js 16:

```bash
npm ci
npm run build
npm run start   # listens on port 3000
```

Set `NEXT_PUBLIC_SITE_URL` in the host's environment panel.

## 8. Playground toolchain

`/playground` compiles C/C++ in the browser (WASM assets loaded on demand).

| Environment | Source |
|-------------|--------|
| **Development** | `/api/toolchain` -> GitHub release, falling back to `node_modules/browsercc/dist` |
| **Production** | [unpkg](https://unpkg.com/browsercc@0.1.1/dist/) CDN (default) |

Production does **not** bundle toolchain files into the deployment. The browser fetches them directly from unpkg with CORS enabled.

To self-host instead, set:

```bash
NEXT_PUBLIC_TOOLCHAIN_BASE=https://your-cdn.example/toolchain
```

## 9. CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every push and pull request:

```bash
npm ci
npm run lint
npm run build
```

Forks inherit this workflow. Set `NEXT_PUBLIC_SITE_URL` in the workflow `env` block or in GitHub Actions secrets if your production URL differs.

## 10. Verify after deploy

Checklist:

- [ ] `/` - home boot animation and notes feed
- [ ] `/blog` - post list and `grep -R` search
- [ ] `/blog/<slug>` - article renders, prev/next links work
- [ ] `/feed.xml` - RSS contains your posts
- [ ] `/sitemap.xml` - all routes listed
- [ ] `/opengraph-image` - default OG card
- [ ] `/playground` - compile and run a hello-world snippet
- [ ] Theme toggle (light / dark / system) persists across reloads

## Quick reference

```bash
npm run dev          # local development
npm run build        # production build (validate + apps sync + search index)
npm run start        # serve production build
npm run sync:apps    # refresh App Store list only
npm run lint         # ESLint
```

That is the full loop: **fork -> configure -> write -> build -> deploy -> verify**.
