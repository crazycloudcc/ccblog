# Contributing to ccblog

Thanks for considering a contribution! This repo is both the **ccblog template** and the maintainer's **live site** ([crazycloud.cc](https://crazycloud.cc)), so a couple of conventions keep it fork-friendly.

## Setup

```bash
git clone https://github.com/crazycloudcc/ccblog.git
cd ccblog
npm install
npm run dev   # http://localhost:3000
```

Requirements: Node.js 20+, npm 9+. A full `npm run build` is needed once before `grep -R` search on `/blog` works (Pagefind is generated at build time).

## Before you push

```bash
npm run lint     # eslint
npm run build    # validate-config -> sync-apps -> next build -> pagefind
```

CI (`.github/workflows/ci.yml`) runs the same lint + build on every push and PR.

## Project layout

```
app/              # Next.js App Router pages and API routes
components/       # UI (terminal shell, blog, playground, home)
content/notes/    # Markdown posts (the sample blog content)
lib/              # site config adapter, posts parser, playground core
ccblog.config.ts  # the single rebrand surface (identity + feature flags)
scripts/          # build helpers (config validation, apps sync)
public/           # static assets; pagefind/ generated at build
```

## The golden rule: no hardcoded identity

ccblog is meant to be forked in minutes, so **never hardcode a name, handle, social link, URL, or repo** into a component or lib file. Everything personal flows through the config:

- Add new identity fields to `CcblogConfig` in `lib/types/config.ts`.
- Read them via `siteConfig` (or the flat `SITE_*` constants) from `@/lib/site` - keep `lib/site.ts` as the adapter layer.
- Add the field to `validateConfig` in `lib/validate-config.ts` if it's required.
- Mirror the field in `ccblog.config.ts` (real value) and `ccblog.config.example.ts` (placeholder).

The committed `ccblog.config.ts` carries the maintainer's real data because this repo powers the live site. Don't replace it with placeholder values in a PR.

`source.href` is the **upstream template** URL, not personal identity. Leave it pointing at `https://github.com/crazycloudcc/ccblog` in both the live config and the example so forks credit the project.

Outward-facing copy (README first screen, launch posts) should sell the terminal shell and the in-browser C/C++ playground. Do not lead with `/apps` — that catalog is the maintainer's App Store list and is off by default for forks.

## Common changes

**Add a social icon** - add the path to `components/terminal/social-icons.tsx` and the key to `SocialIcon` in `lib/types/config.ts`. Forkers then pick it by key in `config.social`.

**Add a feature flag** - add a boolean to `Features` in `lib/types/config.ts`, gate the route in `isRouteEnabled` (`lib/site.ts`), and filter nav items / sitemap entries through it. `lib/apps.ts` shows the pattern for returning empty data when a feature is off.

**Add a content block** - extend the directive parser in `lib/parse-post-content.ts` and demo it in `content/notes/content-blocks.md`.

## Scope of contributions

Good first issues: bug fixes, a11y improvements, new content-block directives, new social icons, and docs.

Features that bake in a strong opinion (new routes, big theme changes) are best opened as an issue first to discuss direction.

## Pull requests

1. Fork and branch from `main`.
2. Keep the change focused; one concern per PR.
3. Run `npm run lint && npm run build` locally.
4. If you add user-facing behavior, update the relevant README section and the Start Up post (`content/notes/nextjs-blog-setup.md`) if it affects setup.
5. Reference the issue in the PR description.

## License

By contributing you agree your changes are licensed under the project's [MIT License](LICENSE).
