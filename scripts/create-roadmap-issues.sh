#!/usr/bin/env bash
# Create roadmap labels, milestone, and issues for OSS maintenance signals.
# Requires: gh auth login
set -euo pipefail

REPO="${REPO:-crazycloudcc/ccblog}"

if ! command -v gh >/dev/null 2>&1; then
  echo "gh not found. Install: brew install gh" >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Not authenticated. Run: gh auth login" >&2
  exit 1
fi

echo "Ensuring labels…"
ensure_label() {
  local name="$1" color="$2" desc="$3"
  if gh label list -R "$REPO" --json name -q '.[].name' | grep -Fxq "$name"; then
    echo "  label exists: $name"
  else
    gh label create "$name" -R "$REPO" --color "$color" --description "$desc"
    echo "  created label: $name"
  fi
}

ensure_label "enhancement" "a2eeef" "New feature or request"
ensure_label "bug" "d73a4a" "Something isn't working"
ensure_label "docs" "0075ca" "Documentation"
ensure_label "good first issue" "7057ff" "Good for newcomers"
ensure_label "help wanted" "008672" "Extra attention needed"
ensure_label "playground" "5319e7" "C/C++ WASM playground"
ensure_label "a11y" "0e8a16" "Accessibility"
ensure_label "infra" "fbca04" "Build, CI, deploy, tests"
ensure_label "content" "c5def5" "Posts, blocks, sample content"

echo "Ensuring milestone v1.2.0…"
if gh api "repos/$REPO/milestones" --jq '.[].title' | grep -Fxq "v1.2.0"; then
  echo "  milestone exists: v1.2.0"
else
  gh api "repos/$REPO/milestones" -f title="v1.2.0" -f description="Config surface, docs, a11y, playground polish, tests" >/dev/null
  echo "  created milestone: v1.2.0"
fi

create_issue() {
  local title="$1"
  local labels="$2"
  local body="$3"
  local with_milestone="${4:-true}"

  # Skip if an open issue with the same title already exists
  if gh issue list -R "$REPO" --state all --search "\"$title\" in:title" --json title -q '.[].title' | grep -Fxq "$title"; then
    echo "skip issue (exists): $title"
    return 0
  fi

  local args=(issue create -R "$REPO" --title "$title" --body "$body" --label "$labels")
  if [[ "$with_milestone" == "true" ]]; then
    args+=(--milestone "v1.2.0")
  fi
  gh "${args[@]}"
  echo "created: $title"
}

create_issue \
  "Accessibility pass: keyboard, focus, contrast, reduced-motion" \
  "a11y,enhancement" \
  "$(cat <<'EOF'
## Goal
Make the terminal shell and playground usable with keyboard-only navigation and assistive tech, without losing the aesthetic.

## Scope
- [ ] Tab order through title bar, nav, main content, playground controls
- [ ] Visible focus rings on interactive chrome
- [ ] Contrast check on light + dark themes
- [ ] Audit `prefers-reduced-motion` on boot sequence, typewriter, CRT effects, window drag
- [ ] Playground: editor + Run + stdin reachable without mouse
- [ ] Mobile nav open/close escapable

## Acceptance
- Keyboard-only path can open a post, run a playground sample, and return home
- No critical a11y blockers on `/`, `/blog`, `/playground`
EOF
)"

create_issue \
  "Playground: compile phase events and sandbox metrics polish" \
  "playground,enhancement" \
  "$(cat <<'EOF'
## Goal
Harden the compile/run pipeline observability (see `docs/next-iteration-tasks.md` T0.1 / T1.1 / T1.3).

## Scope
- [ ] Confirm phase + timing fields end-to-end (worker → UI timeline)
- [ ] Surface timeout / exit code clearly in OutputPanel
- [ ] Document known limits (memory placeholder, 5s timeout)
- [ ] Fix stuck-in-phase UI after toolchain fetch failure

## Acceptance
- Failed toolchain fetch shows a recoverable degraded state
- Successful run shows compile / run / total timing in the UI
EOF
)"

create_issue \
  "Content blocks: document and harden interactive directives" \
  "content,docs" \
  "$(cat <<'EOF'
## Goal
Treat `:::trace` / `:::bench` / `:::annotate` / `:::playground` as a stable authoring surface for forks.

## Scope
- [ ] Ensure `content/notes/content-blocks.md` matches parser behavior
- [ ] Invalid / partial blocks fail gracefully
- [ ] README links to the content-blocks note
- [ ] One minimal example per directive in sample content

## Acceptance
- New authors can copy a block from docs into a note and see it render after build
EOF
)"

create_issue \
  "Docs: fork → configure → deploy dry-run guide" \
  "docs,infra" \
  "$(cat <<'EOF'
## Goal
A clean-account user can fork the template and ship a live site in one sitting.

## Scope
- [ ] Step-by-step: Use template / fork → `ccblog.config.ts` → env → Vercel
- [ ] Note `NEXT_PUBLIC_SITE_URL` requirement
- [ ] Note Pagefind needs `npm run build` (not only `next dev`)
- [ ] List feature flags that disable routes
- [ ] Optional: non-Vercel notes (Node 20 host)

## Acceptance
- Maintainer completes one deploy from a second account with only the docs
EOF
)"

create_issue \
  "Tests: config validation + post parser smoke suite" \
  "infra,enhancement" \
  "$(cat <<'EOF'
## Goal
Catch fork-breaking regressions without a heavy E2E stack.

## Scope
- [ ] Smoke tests for `lib/validate-config.ts` (valid + invalid)
- [ ] Smoke tests for post frontmatter parsing
- [ ] Wire `npm test` into CI
- [ ] Optional: playground share encode/decode helpers

## Acceptance
- CI fails on intentional bad fixture
- Tests run under 30s on GitHub Actions
EOF
)"

create_issue \
  "Template DX: example config completeness + fork checklist" \
  "docs,good first issue" \
  "$(cat <<'EOF'
## Goal
First-run experience after \"Use this template\" is boringly reliable.

## Scope
- [ ] `ccblog.config.example.ts` comments cover every public field
- [ ] README Fork & deploy checklist matches current scripts
- [ ] Sensible `features.*` defaults for a personal fork
- [ ] Troubleshooting: blank search, wrong OG URL, playground toolchain offline

## Acceptance
- Example config alone is enough to rebrand without reading source
EOF
)" \
  false

create_issue \
  "Docs: release process (tag + CHANGELOG + GitHub Release)" \
  "docs" \
  "$(cat <<'EOF'
## Goal
Every version is a real GitHub Release, not only a git tag.

## Scope
- [ ] Document: update CHANGELOG → bump package.json → tag → `gh release create`
- [ ] Point to `docs/releases/` note templates
- [ ] Note toolchain releases are separate if still used

## Acceptance
- Next version ships with a non-empty Releases API entry the same day as the tag
EOF
)" \
  false

create_issue \
  "Release v1.2.0: config surface, CONTRIBUTING, demo content, OG images" \
  "enhancement,docs" \
  "$(cat <<'EOF'
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
- Releases page shows v1.2.0 with notes
EOF
)"

echo
echo "Open issues:"
gh issue list -R "$REPO" --limit 20
