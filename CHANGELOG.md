# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project aims to follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

Work on `main` after `v1.1.0` that is not yet tagged. Candidates for **v1.2.0**.

### Added

- Fork-friendly site config: `ccblog.config.ts` + `ccblog.config.example.ts`, typed in `lib/types/config.ts`
- Build-time config validation (`scripts/validate-config.mjs`, `lib/validate-config.ts`)
- `CONTRIBUTING.md` for template + live-site dual use
- Per-post Open Graph images (`app/blog/[slug]/opengraph-image.tsx`)
- Demo notes: playground, content-blocks, binary-search, quicksort, LIS
- `content/notes/content-blocks.md` documenting interactive directives
- Optional `config.source` credit in the status bar and `/about` (forks keep the upstream URL)
- README / README.zh-CN first screen: template hook, Use this template, Deploy with Vercel, quicksort demo link
- `docs/fork-dry-run.md` second-account deploy checklist
- `docs/media/README.md` shot list for the README hero GIF
- Chinese hero note `liulanqi-bianyi-cpp` (browser C++ compile, no install)
- Home page crawlable `h1` + intro (SSR, not behind the boot sequence)
- `proxy.ts` sets `X-Robots-Tag: noindex` on `/playground?z=` / `embed=1` and `/blog?tag=` / `?series=`

### Changed

- README / README.zh-CN rewritten for fork-and-deploy positioning
- Social icons extracted to a shared terminal chrome module
- Start Up note: Deploy button, Use this template, first-deploy-is-demo identity
- Quicksort note: share-oriented excerpt, default stdin on the in-article runner
- Site / home / notes / playground / about meta copy matches the real product (terminal blog + in-browser C++)
- Sitemap `lastModified` uses post `updated` or `date`, not `new Date()` at build
- RSS `<language>` follows `SITE_LANG`

### Removed

- Sample note `monospace-on-the-web.md` (replaced by stronger demo content)

## [1.1.0] — 2026-07-20

Terminal shell UX release — desktop sidebar, mobile nav, and draggable window chrome.

### Added

- `TerminalSidebar` — desktop left rail with identity, nav, theme toggle, social links
- `TerminalMobileNav` — compact navigation for small screens
- `BlogSidebar` — post-list / post-detail side panel wiring
- `useWindowDrag` — move and edge-resize the terminal window (min size + edge hit zones)

### Changed

- `TerminalTitleBar` refactored for shell layout consistency
- `TerminalShell` integrates sidebar + mobile nav + drag behavior
- Blog list / post pages adjusted for the new chrome layout
- Minor polish on status bar, code panel, and post content wrappers

## [1.0.0] — 2026-07-03

First public release of **ccblog** — a terminal-themed personal blog built with Next.js 16.

### Site & terminal UI

- macOS-style terminal shell with title bar (live clock, timezone, session geo), nav, and status bar
- Dynamic `cwd` in title bar and nav that follows the current route
- Light / dark / system theme with flash-free `theme-init` and persistent preference
- CRT desk atmosphere: grid drift, scanlines, vignette (`prefers-reduced-motion` respected)
- Unified page entry: `cd ./notes`, `cd ./playground.cc`, etc. on subpages with fade-in
- Terminal-style 404 page (`cat: page not found` → `cd ~`)
- `TerminalBackLink`, `TerminalLoadingPanel`, shared panel patterns across pages

### Home

- Boot sequence: notes start at top, session output types line-by-line and pushes notes to final position
- Stages: `last login` → `whoami` → `cat site.ts` → `ls -la` → notes feed
- Typewriter animation with reduced-motion fast path

### Blog

- Markdown posts from `content/notes/` with gray-matter frontmatter
- Post list with year groups, reading time, clickable tags, tag filter (`?tag=`)
- Pagefind search (`grep -R`) with ES module loader
- Prev / next navigation, related posts, JSON-LD, per-post OG images
- RSS feed (`/feed.xml`) with categories, sitemap, robots

### Playground (`/playground`)

- In-browser C11 / C++17 compile and run via browsercc WASM toolchain
- Monaco editor, optional stdin, 5s execution timeout
- Built-in examples (hello, a+b, sort, regex, json)
- Share links with gzip-compressed query params
- Local draft + stdin persistence
- Toolchain served from GitHub Releases (`toolchain-v0.1.1`) or local `browsercc` in dev

### Apps (`/apps`)

- App Store catalog synced from iTunes Lookup API at build time (`prebuild`)
- Configurable `APPLE_DEVELOPER_ID`

### Content

- **Start Up** — fork, configure, build, and deploy guide
- **playground.cc** — playground introduction and examples
- **Hello, World** — blog launch note

### Tooling & CI

- Next.js 16 App Router, React 19, Tailwind CSS v4, TypeScript
- `npm run build`: apps sync → static build → Pagefind index
- GitHub Actions: lint + build on push/PR
- Open Graph image generation, Pagefind postbuild indexing

### Requirements

- Node.js 20+
- `NEXT_PUBLIC_SITE_URL` for production metadata
- Optional `APPLE_DEVELOPER_ID` for `/apps` sync

[Unreleased]: https://github.com/crazycloudcc/ccblog/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/crazycloudcc/ccblog/releases/tag/v1.1.0
[1.0.0]: https://github.com/crazycloudcc/ccblog/releases/tag/v1.0.0
