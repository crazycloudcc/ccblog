import { siteConfig } from "@/lib/site";

export const TOOLCHAIN_TAG = "toolchain-v0.1.1";

/** GitHub repo (owner/name) for dev toolchain fallback - from ccblog.config.ts. */
export const GITHUB_REPO = siteConfig.playground.githubRepo;

/** Keep in sync with the browsercc version in package.json. */
export const BROWSERCC_VERSION = "0.1.1";

export const TOOLCHAIN_FILES = [
  "clang.wasm",
  "lld.wasm",
  "sysroot.tar",
  "stdc++.h.pch",
] as const;

export type ToolchainFile = (typeof TOOLCHAIN_FILES)[number];

/** Dev — proxies from node_modules via API route. */
export const TOOLCHAIN_API_BASE = "/api/toolchain";

export type ToolchainSource = "api" | "unpkg" | "custom";

/** Production default — browsercc on unpkg (CORS-enabled, no Vercel deploy bloat). */
export function getUnpkgToolchainBase(): string {
  return `https://unpkg.com/browsercc@${BROWSERCC_VERSION}/dist`;
}

export function getToolchainSource(): ToolchainSource {
  if (process.env.NODE_ENV === "development") {
    return "api";
  }

  if (process.env.NEXT_PUBLIC_TOOLCHAIN_BASE?.trim()) {
    return "custom";
  }

  return "unpkg";
}

/**
 * Where the browser loads wasm/sysroot from.
 * - dev: local API
 * - prod: unpkg CDN (override with NEXT_PUBLIC_TOOLCHAIN_BASE)
 */
export function resolveToolchainBase(): string {
  if (process.env.NODE_ENV === "development") {
    return TOOLCHAIN_API_BASE;
  }

  const override = process.env.NEXT_PUBLIC_TOOLCHAIN_BASE?.replace(/\/$/, "");
  if (override) {
    return override;
  }

  return getUnpkgToolchainBase();
}

export function getToolchainFileUrl(file: string): string {
  return `${resolveToolchainBase()}/${file}`;
}

export function getGithubReleaseAssetUrl(file: string): string {
  return `https://github.com/${GITHUB_REPO}/releases/download/${TOOLCHAIN_TAG}/${file}`;
}
