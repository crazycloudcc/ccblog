#!/usr/bin/env bash
# Create GitHub Releases for existing tags v1.0.0 and v1.1.0.
# Requires: gh auth login (repo scope)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO="${REPO:-crazycloudcc/ccblog}"

if ! command -v gh >/dev/null 2>&1; then
  echo "gh not found. Install: brew install gh" >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Not authenticated. Run: gh auth login" >&2
  exit 1
fi

create_if_missing() {
  local tag="$1"
  local title="$2"
  local notes_file="$3"

  if gh release view "$tag" -R "$REPO" >/dev/null 2>&1; then
    echo "skip: release $tag already exists"
    return 0
  fi

  if ! git rev-parse "$tag" >/dev/null 2>&1; then
    echo "error: local tag $tag missing (git fetch --tags)" >&2
    exit 1
  fi

  echo "creating release $tag …"
  gh release create "$tag" \
    -R "$REPO" \
    --title "$title" \
    --notes-file "$notes_file"
  echo "ok: $tag"
}

create_if_missing "v1.0.0" "v1.0.0 — First public release" "$ROOT/docs/releases/v1.0.0.md"
create_if_missing "v1.1.0" "v1.1.0 — Terminal shell UX" "$ROOT/docs/releases/v1.1.0.md"

echo
echo "Releases:"
gh release list -R "$REPO"
