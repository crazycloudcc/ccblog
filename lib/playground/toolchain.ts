export const TOOLCHAIN_TAG = "toolchain-v0.1.1";

export const GITHUB_REPO = "crazycloudcc/ccblog";

export const TOOLCHAIN_FILES = [
  "clang.wasm",
  "lld.wasm",
  "sysroot.tar",
  "stdc++.h.pch",
] as const;

export type ToolchainFile = (typeof TOOLCHAIN_FILES)[number];

export const TOOLCHAIN_API_BASE = "/api/toolchain";

export function getToolchainFileUrl(file: string): string {
  return `${TOOLCHAIN_API_BASE}/${file}`;
}

export function getGithubReleaseAssetUrl(file: string): string {
  return `https://github.com/${GITHUB_REPO}/releases/download/${TOOLCHAIN_TAG}/${file}`;
}
