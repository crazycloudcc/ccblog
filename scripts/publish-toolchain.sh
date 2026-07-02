#!/usr/bin/env bash
set -euo pipefail

TAG="${1:-toolchain-v0.1.1}"
VERSION="${2:-0.1.1}"
WORKDIR="$(mktemp -d)"

cleanup() {
  rm -rf "$WORKDIR"
}
trap cleanup EXIT

echo "Extracting browsercc@${VERSION}..."
npm pack "browsercc@${VERSION}" --pack-destination "$WORKDIR" >/dev/null
tar -xf "$WORKDIR/browsercc-${VERSION}.tgz" -C "$WORKDIR"

ASSET_DIR="$WORKDIR/package/dist"
FILES=(clang.wasm lld.wasm sysroot.tar stdc++.h.pch)

echo "Creating GitHub release ${TAG}..."
gh release view "$TAG" >/dev/null 2>&1 && gh release delete "$TAG" --yes || true
gh release create "$TAG" \
  "${FILES[@]/#/$ASSET_DIR/}" \
  --title "Playground toolchain ${TAG}" \
  --notes "browsercc ${VERSION} wasm toolchain for /playground"

echo "Done. Assets published under tag ${TAG}."
