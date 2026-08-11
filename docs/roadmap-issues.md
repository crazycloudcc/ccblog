# Roadmap issues (draft → GitHub)

> Create these as real Issues. Do not open work you will not touch.  
> After `gh auth login`, run: `bash scripts/create-roadmap-issues.sh`

Suggested milestone: **v1.2.0** (Unreleased work + next polish).

---

## Labels to create first

| Name | Color | Description |
|------|-------|-------------|
| `enhancement` | `#a2eeef` | New feature or request |
| `bug` | `#d73a4a` | Something isn't working |
| `docs` | `#0075ca` | Documentation |
| `good first issue` | `#7057ff` | Good for newcomers |
| `help wanted` | `#008672` | Extra attention needed |
| `playground` | `#5319e7` | C/C++ WASM playground |
| `a11y` | `#0e8a16` | Accessibility |
| `infra` | `#fbca04` | Build, CI, deploy, tests |
| `content` | `#c5def5` | Posts, blocks, sample content |

---

## Issue 1 — Accessibility pass

**Title:** Accessibility pass: keyboard, focus, contrast, reduced-motion  
**Labels:** `a11y`, `enhancement`  
**Milestone:** v1.2.0

### Body

```markdown
## Goal
Make the terminal shell and playground usable with keyboard-only navigation and assistive tech, without losing the aesthetic.

## Scope
- [ ] Tab order through title bar, nav, main content, playground controls
- [ ] Visible focus rings on interactive chrome (not only browser default)
- [ ] Contrast check on light + dark themes (text, borders, status bar)
- [ ] Audit `prefers-reduced-motion` on boot sequence, typewriter, CRT effects, window drag
- [ ] Playground: editor + Run + stdin reachable without mouse
- [ ] Mobile nav open/close announced / escapable

## Out of scope
Full WCAG 2.2 AAA; third-party Monaco internals beyond reasonable labels.

## Acceptance
- Keyboard-only path can open a post, run a playground sample, and return home
- No critical axe/lighthouse a11y blockers on `/`, `/blog`, `/playground`
```

---

## Issue 2 — Playground phase events & metrics

**Title:** Playground: compile phase events and sandbox metrics polish  
**Labels:** `playground`, `enhancement`  
**Milestone:** v1.2.0

### Body

```markdown
## Goal
Harden the compile/run pipeline observability already sketched in `docs/next-iteration-tasks.md` (T0.1 / T1.1 / T1.3).

## Scope
- [ ] Confirm `CompilePhase` + timing fields end-to-end (worker → UI timeline)
- [ ] Surface timeout / exit code clearly in `OutputPanel`
- [ ] Document known limits (memory metrics placeholder, 5s timeout)
- [ ] Fix any stuck-in-phase UI after toolchain fetch failure

## Related
- `lib/playground/types.ts`, `playground.worker.ts`, `CompileTimeline.tsx`
- Internal tasks: T0.1, T1.1, T1.3

## Acceptance
- Failed toolchain fetch shows a recoverable degraded state
- Successful run shows compile / run / total timing in the UI
```

---

## Issue 3 — Content blocks docs & hardening

**Title:** Content blocks: document and harden interactive directives  
**Labels:** `content`, `docs`  
**Milestone:** v1.2.0

### Body

```markdown
## Goal
Treat `:::trace` / `:::bench` / `:::annotate` / `:::playground` as a stable authoring surface for forks.

## Scope
- [ ] Ensure `content/notes/content-blocks.md` matches actual parser behavior
- [ ] Invalid / partial blocks fail gracefully (no blank crash)
- [ ] README links to the content-blocks note
- [ ] One minimal example per directive in sample content

## Related
- `components/blog/blocks/*`, `lib/parse-post-content.ts`
- Internal tasks: T2.2–T2.4

## Acceptance
- New authors can copy a block from docs into a note and see it render after build
```

---

## Issue 4 — Deployment guide (Vercel + fork path)

**Title:** Docs: fork → configure → deploy dry-run guide  
**Labels:** `docs`, `infra`  
**Milestone:** v1.2.0

### Body

```markdown
## Goal
A clean-account user can fork the template and ship a live site in one sitting.

## Scope
- [ ] Step-by-step: Use template / fork → `ccblog.config.ts` → env → Vercel
- [ ] Note `NEXT_PUBLIC_SITE_URL` requirement
- [ ] Note Pagefind needs `npm run build` (not only `next dev`)
- [ ] List feature flags that disable routes
- [ ] Optional: non-Vercel notes (Node 20 host)

## Acceptance
- Maintainer completes one deploy from a second GitHub account with only the docs
- Friction items become linked issues, not silent README gaps
```

---

## Issue 5 — Automated smoke tests

**Title:** Tests: config validation + post parser smoke suite  
**Labels:** `infra`, `enhancement`  
**Milestone:** v1.2.0

### Body

```markdown
## Goal
Catch fork-breaking regressions without a heavy E2E stack.

## Scope
- [ ] Unit/smoke tests for `lib/validate-config.ts` (valid + invalid configs)
- [ ] Smoke tests for post frontmatter parsing (`lib/posts.ts` / parser)
- [ ] Wire `npm test` (or `node --test`) into CI
- [ ] Optional: playground pure helpers (share encode/decode)

## Acceptance
- CI fails on intentional bad fixture
- Tests run under 30s on GitHub Actions
```

---

## Issue 6 — Template DX checklist

**Title:** Template DX: example config completeness + fork checklist  
**Labels:** `docs`, `good first issue`

### Body

```markdown
## Goal
First-run experience after "Use this template" is boringly reliable.

## Scope
- [ ] `ccblog.config.example.ts` comments cover every public field
- [ ] README "Fork & deploy" checklist matches current scripts
- [ ] Confirm `features.*` defaults are sensible for a personal fork
- [ ] Add troubleshooting: blank search, wrong OG URL, playground toolchain offline

## Acceptance
- Example config alone is enough to rebrand without reading source
```

---

## Issue 7 — Release process doc

**Title:** Docs: release process (tag + CHANGELOG + GitHub Release)  
**Labels:** `docs`

### Body

```markdown
## Goal
Every version is a real GitHub Release, not only a git tag.

## Scope
- [ ] Document: update CHANGELOG → bump package.json → tag → `gh release create`
- [ ] Point to `docs/releases/` note templates
- [ ] Mention toolchain releases are separate (`toolchain-v*`) if still used

## Acceptance
- Next version ships with a non-empty Releases API entry the same day as the tag
```

---

## Issue 8 — Ship unreleased main as v1.2.0

**Title:** Release v1.2.0: config surface, CONTRIBUTING, demo content, OG images  
**Labels:** `enhancement`, `docs`  
**Milestone:** v1.2.0

### Body

```markdown
## Goal
Promote post-`v1.1.0` work on `main` into a proper release (see CHANGELOG `[Unreleased]`).

## Includes
- `ccblog.config.ts` + validation
- CONTRIBUTING + README fork positioning
- Per-post OG images
- Demo notes (playground, content-blocks, algorithms)

## Tasks
- [ ] Freeze Unreleased notes in CHANGELOG as `## [1.2.0]`
- [ ] Bump `package.json` to `1.2.0`
- [ ] Tag `v1.2.0` and create GitHub Release
- [ ] Close linked issues that landed in this cut

## Acceptance
- Releases page shows v1.2.0 with notes; Unreleased section is empty or only post-cut items
```
