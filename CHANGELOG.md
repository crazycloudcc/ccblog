# Changelog

All notable changes to this project are documented in this file.

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

[1.0.0]: https://github.com/crazycloudcc/ccblog/releases/tag/v1.0.0
