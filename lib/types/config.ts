/** Icon keys for social links. Add new icons in components/terminal/social-icons.tsx. */
export type SocialIcon =
  | "github"
  | "x"
  | "email"
  | "rss"
  | "linkedin"
  | "mastodon"
  | "bluesky";

export type SocialLink = {
  /** Short label, used for aria-label / about page key, e.g. "GitHub". */
  label: string;
  /** Human-readable handle shown in the about page, e.g. "github.com/crazycloudcc". */
  handle: string;
  /** Full href, e.g. "https://github.com/crazycloudcc" or "mailto:...". */
  href: string;
  /** Icon key rendered in the sidebar. */
  icon: SocialIcon;
};

export type Features = {
  blog: boolean;
  apps: boolean;
  playground: boolean;
  about: boolean;
};

export type CcblogConfig = {
  /** Site name, used in <title>, RSS, JSON-LD, og. */
  name: string;
  /** Author display name, used in whoami output, copyright, JSON-LD. */
  author: string;
  /** Shell handle, used in the `handle@blog` prompt and /home/<handle>/blog path. */
  handle: string;
  /** 1-3 char avatar mark shown in the sidebar when `logo` is unset, e.g. "cc". */
  initials: string;
  /**
   * Optional public path to the site logo (sidebar avatar + optional metadata).
   * Example: `"/logo.jpg"`. When set, the sidebar circle shows the image;
   * browser tab icons still come from `app/icon.*` / `app/apple-icon.*`.
   */
  logo?: string;
  /** Default meta description. */
  description: string;
  /** Sidebar subtitle under the avatar, e.g. "AI · Web3 · Game". */
  tagline: string;
  /** One-line tagline rendered on the og image. */
  ogTagline: string;
  /** Topics shown in the home `cat site.ts` block. */
  topics: string[];
  /** Canonical site URL. Overridable by NEXT_PUBLIC_SITE_URL. */
  url: string;
  /** BCP-47 locale for date/clock formatting, e.g. "en-US". */
  locale: string;
  /** <html lang> value, e.g. "en". */
  lang: string;
  /** Git branch shown in the status bar. Overridable by NEXT_PUBLIC_CCBLOG_BRANCH. */
  branch: string;
  /** Social/contact links shown in the sidebar and about page. */
  social: SocialLink[];
  /** Toggle whole routes/nav items on or off. */
  features: Features;
  /** App Store sync config. Only used when features.apps is true. */
  apps: {
    developerId: number;
    /**
     * Optional tagline overrides keyed by App Store app name. Names not
     * listed here fall back to the first sentence of the app description.
     */
    taglines?: Record<string, string>;
  };
  /** Playground toolchain config. Only used when features.playground is true. */
  playground: {
    /**
     * GitHub repo (owner/name) used as a fallback source for dev toolchain
     * files via /api/toolchain. Falls back to local node_modules/browsercc.
     */
    githubRepo: string;
  };
};
