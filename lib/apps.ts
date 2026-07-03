export type AppCategory = "utility" | "game";

export type AppRelease = {
  slug: string;
  name: string;
  category: AppCategory;
  tagline: string;
  description: string;
  appStoreUrl: string;
  releaseDate: string;
  version?: string;
  tags?: string[];
  iconUrl?: string;
};

/**
 * Add shipped iOS apps here. Example:
 *
 * {
 *   slug: "mini-timer",
 *   name: "Mini Timer",
 *   category: "utility",
 *   tagline: "Focus timer with widgets",
 *   description: "A minimal Pomodoro timer for iPhone and iPad.",
 *   appStoreUrl: "https://apps.apple.com/app/idXXXXXXXXX",
 *   releaseDate: "2025-03-01",
 *   version: "1.2.0",
 *   tags: ["Swift", "WidgetKit"],
 * }
 */
export const apps: AppRelease[] = [];

const categoryOrder: AppCategory[] = ["utility", "game"];

const categoryLabels: Record<AppCategory, string> = {
  utility: "tools",
  game: "games",
};

export function getApps(): AppRelease[] {
  return [...apps].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
}

export function getAppsByCategory(): {
  category: AppCategory;
  label: string;
  items: AppRelease[];
}[] {
  const sorted = getApps();

  return categoryOrder
    .map((category) => ({
      category,
      label: categoryLabels[category],
      items: sorted.filter((app) => app.category === category),
    }))
    .filter((group) => group.items.length > 0);
}

export function getAppBySlug(slug: string): AppRelease | undefined {
  return apps.find((app) => app.slug === slug);
}
