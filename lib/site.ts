import type { CcblogConfig, Features, SocialLink } from "@/lib/types/config";
import config from "@/ccblog.config";

export type { CcblogConfig, Features, SocialLink, SocialIcon } from "@/lib/types/config";

/** Full typed site config (sourced from ccblog.config.ts). */
export const siteConfig: CcblogConfig = config;

// ── Identity (flat constants re-exported for existing consumers) ────────────
export const SITE_NAME = config.name;
export const SITE_TITLE = config.name;
export const SITE_DESCRIPTION = config.description;
export const SITE_AUTHOR = config.author;
export const SITE_LANG = config.lang;
export const SITE_LOCALE = config.locale;

/** Override in production via NEXT_PUBLIC_SITE_URL (e.g. https://crazycloud.cc). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? config.url).replace(/\/$/, "");

/** Git branch shown in the terminal status bar. Override via NEXT_PUBLIC_CCBLOG_BRANCH. */
export const SITE_BRANCH = process.env.NEXT_PUBLIC_CCBLOG_BRANCH ?? config.branch;

/** Social/contact links (sidebar + about page). */
export const socialLinks: SocialLink[] = config.social;

/** Feature flags controlling nav items, sitemap, and the apps sync. */
export const features: Features = config.features;

/** Apple developer ID for /apps sync. Only used when features.apps is true. */
export const APPLE_DEVELOPER_ID = config.apps.developerId;

const ROUTE_FEATURE: Record<string, keyof Features | undefined> = {
  "/": undefined, // home is always enabled
  "/blog": "blog",
  "/apps": "apps",
  "/playground": "playground",
  "/about": "about",
};

/** Whether a top-level route is enabled by the feature flags. */
export function isRouteEnabled(path: string): boolean {
  const key = ROUTE_FEATURE[path];
  if (!key) {
    return true;
  }
  return features[key];
}
