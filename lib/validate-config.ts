import type { CcblogConfig, SocialIcon } from "@/lib/types/config";

const SOCIAL_ICONS: readonly SocialIcon[] = [
  "github",
  "x",
  "email",
  "rss",
  "linkedin",
  "mastodon",
  "bluesky",
];

const REQUIRED_STRINGS: Array<keyof CcblogConfig> = [
  "name",
  "author",
  "handle",
  "initials",
  "description",
  "tagline",
  "ogTagline",
  "locale",
  "lang",
  "branch",
];

const FEATURE_KEYS = ["blog", "apps", "playground", "about"] as const;

/**
 * Validate a CcblogConfig. Returns a list of human-readable error strings
 * (empty when valid). Pure function - safe to call at build time.
 */
export function validateConfig(config: CcblogConfig): string[] {
  const errors: string[] = [];

  for (const key of REQUIRED_STRINGS) {
    const value = config[key];
    if (typeof value !== "string" || value.trim().length === 0) {
      errors.push(`config.${key} must be a non-empty string`);
    }
  }

  if (typeof config.url !== "string" || !config.url.trim()) {
    errors.push("config.url must be a non-empty string");
  } else if (!/^https?:\/\//.test(config.url)) {
    errors.push(`config.url must start with http:// or https:// (got "${config.url}")`);
  }

  if (config.logo !== undefined) {
    if (typeof config.logo !== "string" || !config.logo.trim()) {
      errors.push("config.logo must be a non-empty string when set");
    } else if (!config.logo.startsWith("/")) {
      errors.push(`config.logo must be a root-relative public path starting with / (got "${config.logo}")`);
    }
  }

  if (!Array.isArray(config.topics) || config.topics.length === 0) {
    errors.push("config.topics must be a non-empty array of strings");
  } else if (!config.topics.every((topic) => typeof topic === "string" && topic.trim())) {
    errors.push("config.topics must contain only non-empty strings");
  }

  const feats = config.features;
  if (!feats || typeof feats !== "object") {
    errors.push("config.features must be an object");
  } else {
    for (const key of FEATURE_KEYS) {
      if (typeof feats[key] !== "boolean") {
        errors.push(`config.features.${key} must be a boolean`);
      }
    }
  }

  if (feats?.apps) {
    if (typeof config.apps?.developerId !== "number" || config.apps.developerId <= 0) {
      errors.push("config.apps.developerId must be a positive number when features.apps is true");
    }
  }

  if (feats?.playground) {
    const repo = config.playground?.githubRepo;
    if (typeof repo !== "string" || !repo.trim()) {
      errors.push('config.playground.githubRepo must be a non-empty string (owner/name)');
    } else if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) {
      errors.push(`config.playground.githubRepo must be "owner/name" (got "${repo}")`);
    }
  }

  if (!Array.isArray(config.social)) {
    errors.push("config.social must be an array");
  } else {
    config.social.forEach((link, index) => {
      const ctx = `config.social[${index}]`;
      if (typeof link.label !== "string" || !link.label.trim()) {
        errors.push(`${ctx}.label must be a non-empty string`);
      }
      if (typeof link.handle !== "string" || !link.handle.trim()) {
        errors.push(`${ctx}.handle must be a non-empty string`);
      }
      if (typeof link.href !== "string" || !link.href.trim()) {
        errors.push(`${ctx}.href must be a non-empty string`);
      }
      if (!SOCIAL_ICONS.includes(link.icon)) {
        errors.push(
          `${ctx}.icon "${String(link.icon)}" is not valid (expected one of: ${SOCIAL_ICONS.join(", ")})`,
        );
      }
    });
  }

  return errors;
}

/** Throw an aggregated Error if the config is invalid. */
export function assertValidConfig(config: CcblogConfig): void {
  const errors = validateConfig(config);
  if (errors.length > 0) {
    throw new Error(
      `Invalid ccblog.config.ts:\n${errors.map((error) => `  - ${error}`).join("\n")}`,
    );
  }
}
