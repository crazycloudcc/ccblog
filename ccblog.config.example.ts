import type { CcblogConfig } from "@/lib/types/config";

/**
 * Blank template for ccblog.config.ts.
 *
 * This repo ships with a working `ccblog.config.ts` (the author's config) so
 * `npm run dev` works on a fresh clone. To start from a clean slate instead,
 * copy this file over it:
 *
 *   cp ccblog.config.example.ts ccblog.config.ts
 *
 * Then edit the values below and deploy. Field docs live in lib/types/config.ts.
 * The build validates this file (npm run build runs scripts/validate-config.mjs).
 */
const config: CcblogConfig = {
  name: "Your Name's blog",
  author: "yourhandle",
  handle: "yourhandle",
  initials: "yo",
  // Optional: drop a transparent PNG in public/ and set the path, e.g. "/logo.png".
  // When set, the sidebar avatar uses it; initials remain the text fallback.
  // logo: "/logo.png",
  description: "Notes on what you build and think about.",
  tagline: "code · notes",
  ogTagline: "Your one-line tagline for social cards.",
  topics: ["code", "notes"],
  url: "https://your-domain.com",
  locale: "en-US",
  lang: "en",
  branch: "main",
  social: [
    {
      label: "Email",
      handle: "you@example.com",
      href: "mailto:you@example.com",
      icon: "email",
    },
    {
      label: "GitHub",
      handle: "github.com/yourhandle",
      href: "https://github.com/yourhandle",
      icon: "github",
    },
    {
      label: "X",
      handle: "x.com/yourhandle",
      href: "https://x.com/yourhandle",
      icon: "x",
    },
  ],
  features: {
    blog: true,
    apps: false,
    playground: true,
    about: true,
  },
  apps: {
    // Set your Apple developer ID and flip features.apps to true to enable /apps.
    developerId: 0,
    // Optional: one-line taglines keyed by App Store app name.
    // taglines: { "Your App": "A short tagline" },
  },
  playground: {
    // owner/name - used as a fallback for the dev toolchain via /api/toolchain.
    githubRepo: "yourhandle/yourrepo",
  },
};

export default config;
