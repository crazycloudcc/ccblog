/** Site-wide language defaults. English only for now — no i18n layer yet. */
export const SITE_LANG = "en" as const;
export const SITE_LOCALE = "en-US" as const;

export const SITE_NAME = "crazycloudcc's blog";
export const SITE_TITLE = SITE_NAME;
export const SITE_DESCRIPTION =
  "Notes on software, cloud infrastructure, and everyday engineering.";
export const SITE_AUTHOR = "crazycloudcc";

/** Override in production via NEXT_PUBLIC_SITE_URL (e.g. https://crazycloud.cc). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://crazycloud.cc"
).replace(/\/$/, "");

export const APPLE_DEVELOPER_ID = 495069166;
