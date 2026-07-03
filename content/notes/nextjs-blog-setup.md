---
title: Start Up
excerpt: Clone or fork ccblog from GitHub, configure the site, build locally, and deploy to production.
date: 2010-04-10
coverLabel: nextjs
tags:
  - nextjs
  - meta
  - web
  - deploy
---

This guide walks through the full path from **forking the repo** to **a live deployment** of [ccblog](https://github.com/crazycloudcc/ccblog) — a terminal-themed personal blog built with Next.js 16, TypeScript, and Tailwind CSS v4.

## Prerequisites

- **Node.js 20** (matches CI)
- **npm** 9+
- A **GitHub** account (to fork or clone)
- For deployment: a [Vercel](https://vercel.com) account (recommended) or any host that runs `next start`

Optional:

- [GitHub CLI](https://cli.github.com/) (`gh`) if you publish Playground toolchain releases yourself
- Your own **Apple Developer ID** if you want `/apps` to list your App Store titles

## 1. Get the project

### Option A — Fork (recommended for your own blog)

1. Open [github.com/crazycloudcc/ccblog](https://github.com/crazycloudcc/ccblog) and click **Fork**.
2. Clone your fork:

```bash
git clone git@github.com:<your-username>/ccblog.git
cd ccblog
```

### Option B — Clone directly

```bash
git clone git@github.com:crazycloudcc/ccblog.git
cd ccblog
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure the site

Edit `lib/site.ts` with your name, description, and production URL:

```ts
export const SITE_NAME = "your name's blog";
export const SITE_DESCRIPTION = "Your tagline here.";
export const SITE_AUTHOR = "your-handle";
```

Set the canonical site URL via environment variable (used for RSS, sitemap, Open Graph, and JSON-LD):

```bash
# .env.local (not committed)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical URL for metadata and feeds |
| `APPLE_DEVELOPER_ID` | Optional | iTunes Lookup API ID for `/apps` sync (default: crazycloudcc's ID) |

If you fork the repo, change `APPLE_DEVELOPER_ID` to your own developer ID, or remove the `/apps` nav item if you do not ship iOS apps.

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

The filename becomes the URL slug: `/blog/my-post`.

Supported extras in the body:

- Fenced code blocks (with copy buttons)
- `::video[Caption](url)` for inline video
- `ogImage` in frontmatter for custom social cards

## 6. Production build

```bash
npm run build
```

The build runs three phases automatically:

| Phase | Script | What it does |
|-------|--------|--------------|
| prebuild | `scripts/sync-apps.mjs` | Fetches App Store apps from iTunes API → `lib/apps.ts` |
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

Vercel runs `npm run build` on each push to `main`. The `prebuild` and `postbuild` hooks run as part of that command — no extra build-step configuration needed.

6. After deploy, attach your custom domain under **Project → Settings → Domains**.
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

`/playground` compiles C/C++ in the browser (~108 MB of WASM assets).

| Environment | Source |
|-------------|--------|
| **Development** | `/api/toolchain` → `node_modules/browsercc/dist` |
| **Production** | [unpkg](https://unpkg.com/browsercc@0.1.1/dist/) CDN (default) |

Production does **not** bundle toolchain files into the Vercel deployment (Hobby upload limit is 100 MB). The browser fetches directly from unpkg with CORS enabled.

To self-host instead, set:

```bash
NEXT_PUBLIC_TOOLCHAIN_BASE=https://your-cdn.example/toolchain
```

Optional: publish a [GitHub Release](https://github.com/crazycloudcc/ccblog/releases) for backup hosting (`./scripts/publish-toolchain.sh`). GitHub assets cannot be fetched directly from the browser due to CORS — use a proxy or CDN if you go that route.

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

- [ ] `/` — home boot animation and notes feed
- [ ] `/blog` — post list and `grep -R` search
- [ ] `/blog/<slug>` — article renders, prev/next links work
- [ ] `/feed.xml` — RSS contains your posts
- [ ] `/sitemap.xml` — all routes listed
- [ ] `/opengraph-image` — default OG card
- [ ] `/playground` — compile and run a hello-world snippet
- [ ] Theme toggle (light / dark / system) persists across reloads

## Project layout

```bash
app/                 # Next.js App Router pages and API routes
content/notes/       # Markdown posts
components/          # UI (terminal shell, blog, playground)
lib/                 # posts, metadata, apps, playground helpers
public/              # static assets; pagefind/ generated at build
scripts/             # sync-apps.mjs, publish-toolchain.sh
```

## Quick reference

```bash
npm run dev          # local development
npm run build        # production build (+ apps sync + search index)
npm run start        # serve production build
npm run sync:apps    # refresh App Store list only
npm run lint         # ESLint
```

That is the full loop: **fork → configure → write → build → deploy → verify**.
