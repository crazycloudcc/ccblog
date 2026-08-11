# OSS Readiness Checklist

> Goal: make `crazycloudcc/ccblog` read as a **forkable template / web lab for other developers**, not a personal code dump.  
> North star for signals (quality over vanity metrics):
>
> **1 Star + 5 real deploys + 3 external forks + 2 user Issues**  
> beats  
> **50 Stars + zero real usage**.

Last audited: 2026-08-11

## Progress snapshot

| Phase | Status |
|-------|--------|
| 0 Positioning | ✅ Description + homepage + template (re-check Topics if empty) |
| 1 Releases | ✅ `v1.0.0` + `v1.1.0` GitHub Releases published 2026-08-11 |
| 2 Issues | ✅ Milestone `v1.2.0` + issues #1–#8 created |
| 3 External users | ⬜ not started |

---

## Current baseline (facts)

| Signal | Status | Evidence |
|--------|--------|----------|
| Repo description | ❌ Personal | `"cc's blog"` |
| Topics | ❌ Empty | `[]` |
| Template Repository | ❌ Off | `is_template: false` |
| Homepage URL | ⚠️ Preview URL | `https://ccblog-ten.vercel.app` (prefer primary domain if stable) |
| Git tags | ✅ | `v1.0.0`, `v1.1.0` |
| GitHub Releases | ❌ Empty | Releases API `[]` |
| Issues / Roadmap | ❌ Empty | 0 issues |
| Stars / forks | Thin | 1 star, 0 forks |
| README / CONTRIBUTING / LICENSE | ✅ | Fork-oriented docs already exist |
| CI | ✅ | `.github/workflows/ci.yml` |
| CHANGELOG | ⚠️ Partial | Only `1.0.0` section; no `1.1.0` notes; `package.json` still `1.0.0` |

---

## Phase 0 — Positioning (do first, ~15 min)

*Makes the repo self-explanatory to a reviewer in 10 seconds.*

- [ ] **0.1** Change repository **Description** to something like:
  ```
  Forkable terminal-style Next.js blog & web lab with browser C/C++ WASM playground.
  ```
- [ ] **0.2** Set **Homepage** to the canonical live site (e.g. `https://crazycloud.cc`) if that is the intended demo; keep Vercel URL only if primary is unstable.
- [ ] **0.3** Add **Topics** (all that apply):
  ```
  nextjs, typescript, blog, developer-blog, terminal, wasm, cpp, monaco-editor, pagefind, template
  ```
  Optional extras if they fit: `react`, `tailwindcss`, `markdown`, `open-source`.
- [ ] **0.4** Enable **Template repository** (Settings → General → Template repository).
- [ ] **0.5** Align README title/subtitle with template positioning (already mostly good; avoid “my blog” framing in badges/about).
- [ ] **0.6** (Optional) Add a short “Why fork this” blurb near the top of README if missing: one-config rebrand + deploy loop.

**Acceptance:** A cold visitor sees *template for developers*, not *cc’s personal blog*.

**How (GitHub UI or API):**

```bash
# Requires gh auth (or GITHUB_TOKEN with repo scope)
gh repo edit crazycloudcc/ccblog \
  --description "Forkable terminal-style Next.js blog & web lab with browser C/C++ WASM playground." \
  --homepage "https://crazycloud.cc" \
  --add-topic nextjs \
  --add-topic typescript \
  --add-topic blog \
  --add-topic developer-blog \
  --add-topic terminal \
  --add-topic wasm \
  --add-topic cpp \
  --add-topic monaco-editor \
  --add-topic pagefind \
  --add-topic template

# Template flag (UI: Settings → General → Template repository)
# or API:
# gh api -X PATCH repos/crazycloudcc/ccblog -f is_template=true
```

---

## Phase 1 — Real Releases (maintainer signal, ~30–60 min)

*Tags alone do not count. OpenAI-style maintainer signals care about **Releases**.*

- [ ] **1.1** Backfill **GitHub Release** for `v1.0.0` (use existing `CHANGELOG.md` §1.0.0 as body; mark as latest=false if 1.1 is newer).
- [ ] **1.2** Write **CHANGELOG §1.1.0** for what actually landed between tags (playground/content blocks/etc.), then create Release for `v1.1.0`.
- [ ] **1.3** Bump `package.json` `"version"` to match the latest released tag (currently still `1.0.0`).
- [ ] **1.4** From now on: every meaningful ship = tag **+** GitHub Release **+** CHANGELOG entry (same day).
- [ ] **1.5** (Optional) Add a lightweight release habit note to `CONTRIBUTING.md` / maintainer section.

**Suggested release bodies (draft):**

### v1.0.0 — First public release
- Terminal-themed Next.js blog shell
- Markdown notes + Pagefind search
- Browser C/C++ playground (WASM)
- Fork-friendly single config surface
- CI (lint + build)

### v1.1.0 — (fill from git log between tags)
- Diff: `git log v1.0.0..v1.1.0 --oneline`
- Group: Playground / Content blocks / Site UX / Docs

**How:**

```bash
# After CHANGELOG is ready:
gh release create v1.0.0 --title "v1.0.0 — First public release" --notes-file - <<'EOF'
…paste changelog…
EOF

gh release create v1.1.0 --title "v1.1.0 — …" --notes-file - <<'EOF'
…paste changelog…
EOF
```

**Acceptance:** `GET /repos/crazycloudcc/ccblog/releases` returns non-empty list; Releases page shows real notes, not only tags.

---

## Phase 2 — Issue-driven Roadmap (ongoing, start this week)

*Do not fake community activity. Open issues for work you already intend to do; close with commits.*

### 2.1 Repo hygiene

- [ ] **2.1.1** Add issue labels: `enhancement`, `bug`, `docs`, `good first issue`, `help wanted`, `playground`, `a11y`, `infra`, `content`.
- [ ] **2.1.2** (Optional) Add issue templates: Bug / Feature under `.github/ISSUE_TEMPLATE/`.
- [ ] **2.1.3** Pin one **Roadmap** issue or create a GitHub Project / milestone `v1.2.0`.

### 2.2 Seed real roadmap issues (map from `docs/next-iteration-tasks.md` + gaps)

Create issues only for work you will actually touch. Suggested set:

| # | Title (draft) | Labels | Milestone |
|---|---------------|--------|-----------|
| A | Accessibility pass: keyboard, focus, contrast, reduced-motion audit | `a11y`, `enhancement` | v1.2 |
| B | Playground: compile timeline / phase events & metrics polish | `playground`, `enhancement` | v1.2 |
| C | Content blocks: document + harden `:::trace` / `:::bench` / `:::playground` | `content`, `docs` | v1.2 |
| D | Deployment guide: Vercel + non-Vercel (static export caveats if any) | `docs`, `infra` | v1.2 |
| E | Tests: smoke tests for config validation + post parser + playground helpers | `infra`, `enhancement` | v1.2 |
| F | Template DX: `ccblog.config.example.ts` completeness + fork checklist in README | `docs`, `good first issue` | — |
| G | Search: Pagefind dev-experience note / optional rebuild script docs | `docs` | — |
| H | Release process: document tag + CHANGELOG + `gh release create` | `docs` | — |

- [ ] **2.2.1** File the issues above (or a tighter subset you will ship).
- [ ] **2.2.2** When coding, use `Fixes #N` / `Closes #N` in commits/PRs.
- [ ] **2.2.3** Close issues only when acceptance criteria are met (not when “partially started”).

**Acceptance:** Open issues describe a real roadmap; git history links to issues; closed issues show progressive maintenance.

---

## Phase 3 — External usage (highest leverage, weeks)

*This is the differentiator. Real deploys/forks/issues > hollow stars.*

### Target scoreboard

| Metric | Target | How to earn (honestly) |
|--------|--------|------------------------|
| Stars | ≥ 1 (already) | Do not chase; natural side-effect |
| Real deploys | **≥ 5** | Friends / classmates / Discord / Vercel “Deploy” stories; keep a private list of live URLs |
| External forks | **≥ 3** | Same outreach; Template button lowers friction |
| User-authored Issues | **≥ 2** | People who forked and hit a real problem, or requested a feature |

### Actions

- [ ] **3.1** One-click deploy polish: verify “Fork → edit config → Vercel” path on a **clean account** (not yours). Fix anything that blocks first run.
- [ ] **3.2** Publish a short fork guide post (your own blog + optional external): title aimed at “terminal Next.js blog template”, not “my site”.
- [ ] **3.3** Share in 2–3 relevant communities (e.g. Next.js / indie hackers / school lab / C++ teaching groups) with **deploy-first** CTA.
- [ ] **3.4** Personally onboard 3–5 people: offer to pair 20 min on first deploy; ask them to open an Issue if anything is confusing.
- [ ] **3.5** Track deploys privately (spreadsheet): URL, fork date, contact, issues filed — never fake public social proof.
- [ ] **3.6** When someone forks, thank + ask what they changed; convert friction into docs/issues.

**Acceptance:** You can name real external sites and point to non-author Issues/PRs.

---

## Phase 4 — Sustained OSS hygiene (habit)

- [ ] Prefer small PRs with linked issues over “daily update” commits on `main` when possible (or squash with meaningful messages).
- [ ] Keep `README.md` / `README.zh-CN.md` in sync on positioning changes.
- [ ] After each release, bump version in `package.json` + CHANGELOG before tagging.
- [ ] Revisit this checklist monthly; update baseline table.

---

## Execution order (recommended sprint)

```text
Day 0 (today)     Phase 0: description + topics + template
Day 0–1           Phase 1: CHANGELOG 1.1.0 + two GitHub Releases + version bump
Day 1             Phase 2: labels + 5–8 real roadmap issues + milestone
This week         Phase 3.1: clean-account fork/deploy dry-run; fix blockers
This month        Phase 3.2–3.5: outreach until scoreboard moves
Ongoing           Close issues with commits; ship v1.2 as a real Release
```

---

## Out of scope / anti-patterns

- Do **not** buy stars, open fake issues, or sock-puppet forks.
- Do **not** leave description as personal branding if applying as an OSS template maintainer.
- Do **not** treat tags as releases.
- Do **not** open 30 issues you will never touch.

---

## Quick command reference

```bash
# Status
curl -s https://api.github.com/repos/crazycloudcc/ccblog | jq '{description, homepage, is_template, stargazers_count, forks_count, open_issues_count}'
curl -s https://api.github.com/repos/crazycloudcc/ccblog/releases | jq 'length'
curl -s -H "Accept: application/vnd.github+json" https://api.github.com/repos/crazycloudcc/ccblog/topics | jq .

# After auth
gh auth login
gh release list -R crazycloudcc/ccblog
gh issue list -R crazycloudcc/ccblog
```
