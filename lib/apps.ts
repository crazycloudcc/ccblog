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
 * App Store catalog for /apps.
 * Auto-synced from iTunes Lookup API before each production build (prebuild).
 * Manual refresh: npm run sync:apps
 */
export const apps: AppRelease[] = [
  {
    "slug": "final-ticket-plan",
    "name": "Final Ticket Plan",
    "category": "game",
    "tagline": "Trade Up to the Final",
    "description": "Final Ticket Plan is a pixel-art trading survival game set in a rainy neon city.",
    "appStoreUrl": "https://apps.apple.com/us/app/final-ticket-plan/id6767793804",
    "releaseDate": "2026-05-31",
    "version": "1.0.0",
    "tags": [
      "Games",
      "Entertainment"
    ],
    "iconUrl": "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/ad/ad/48/adad4830-a9ea-1a44-c249-2daf84378c20/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/512x512bb.jpg"
  },
  {
    "slug": "weather-trace",
    "name": "Weather Trace",
    "category": "utility",
    "tagline": "Local weather forecast",
    "description": "Weather Trace shows current conditions, hourly forecasts, and daily outlooks based on your location.",
    "appStoreUrl": "https://apps.apple.com/us/app/weather-trace/id6761846937",
    "releaseDate": "2026-05-08",
    "version": "1.0.1",
    "tags": [
      "Weather",
      "Utilities"
    ],
    "iconUrl": "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/b1/18/cd/b118cd93-f898-3873-5cfa-1c5cab005be0/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg"
  },
  {
    "slug": "localbeats",
    "name": "LocalBeats",
    "category": "utility",
    "tagline": "Ad-Free · No Internet",
    "description": "LocalBeats is a clean, offline media player for your local music and media files.",
    "appStoreUrl": "https://apps.apple.com/us/app/localbeats/id6761184551",
    "releaseDate": "2026-04-01",
    "version": "1.0.1",
    "tags": [
      "Music",
      "Utilities"
    ],
    "iconUrl": "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/29/3a/ac/293aacc3-30bc-a356-a28c-f3425cab5358/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg"
  },
  {
    "slug": "cheer-loop",
    "name": "Cheer Loop",
    "category": "utility",
    "tagline": "Cheer Text & Doodle",
    "description": "Cheer Loop helps you create bold cheering text and hand-drawn doodles for matches, concerts, and live events.",
    "appStoreUrl": "https://apps.apple.com/us/app/cheer-loop/id6761043891",
    "releaseDate": "2026-03-27",
    "version": "1.0.1",
    "tags": [
      "Entertainment",
      "Sports"
    ],
    "iconUrl": "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/a8/16/91/a8169107-4cfd-d1d5-6804-e34102a36801/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg"
  },
  {
    "slug": "travel-speaker",
    "name": "Travel Speaker",
    "category": "utility",
    "tagline": "Voice Translator for Travel",
    "description": "Travel Speaker helps you communicate abroad with fast voice and text translation.",
    "appStoreUrl": "https://apps.apple.com/us/app/travel-speaker/id6755930707",
    "releaseDate": "2026-03-26",
    "version": "1.3.1",
    "tags": [
      "Travel",
      "Utilities"
    ],
    "iconUrl": "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/d8/37/ba/d837ba0b-4dd0-eac5-f768-ac41db117691/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg"
  },
  {
    "slug": "ideamic",
    "name": "IdeaMic",
    "category": "utility",
    "tagline": "Private Voice Idea Notes",
    "description": "IdeaMic helps you capture ideas the moment they appear.",
    "appStoreUrl": "https://apps.apple.com/us/app/ideamic/id6760747245",
    "releaseDate": "2026-03-24",
    "version": "1.0.1",
    "tags": [
      "Productivity",
      "Utilities"
    ],
    "iconUrl": "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/c1/3b/5b/c13b5be0-4841-2994-a7dd-76ab58f6844d/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg"
  },
  {
    "slug": "pdf-tools-pro",
    "name": "PDF Tools Pro",
    "category": "utility",
    "tagline": "Scan, Edit, Merge, Encrypt",
    "description": "PDF Tools Pro helps you handle everyday PDF tasks quickly: open and organize files, annotate with highlight/underline/strikeout and handwriting, reorder/rotate/",
    "appStoreUrl": "https://apps.apple.com/us/app/pdf-tools-pro/id6760276378",
    "releaseDate": "2026-03-20",
    "version": "1.0.1",
    "tags": [
      "Productivity",
      "Utilities"
    ],
    "iconUrl": "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/c2/a0/89/c2a0895c-d4bb-a90f-7035-daffd4c8175c/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg"
  },
  {
    "slug": "noise-mixer",
    "name": "Noise Mixer",
    "category": "utility",
    "tagline": "Sleep & Focus Sounds",
    "description": "Noise Mixer helps you build focus and sleep soundscapes with white noise, rain, and ambient mixes.",
    "appStoreUrl": "https://apps.apple.com/us/app/noise-mixer/id6759958402",
    "releaseDate": "2026-03-14",
    "version": "1.0.1",
    "tags": [
      "Health & Fitness",
      "Music"
    ],
    "iconUrl": "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/d6/3b/3a/d63b3afe-d686-8ac8-e606-dd966ca6f121/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg"
  },
  {
    "slug": "cyberscripts",
    "name": "cYBerScRipts",
    "category": "game",
    "tagline": "Protocol: The Idle Netrunner",
    "description": "[LOG_IN]...",
    "appStoreUrl": "https://apps.apple.com/us/app/cyberscripts/id6759292189",
    "releaseDate": "2026-02-22",
    "version": "1.2",
    "tags": [
      "Entertainment",
      "Casual",
      "Word"
    ],
    "iconUrl": "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/d3/7e/31/d37e3101-85ea-808f-f3ac-b5131b4a5ce8/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg"
  },
  {
    "slug": "endlessbattle",
    "name": "EndlessBattle",
    "category": "game",
    "tagline": "Puzzle",
    "description": "* The Game * An occupied site of the game, test your strategic.",
    "appStoreUrl": "https://apps.apple.com/us/app/endlessbattle/id524019343",
    "releaseDate": "2012-05-19",
    "version": "1.0.1",
    "tags": [
      "Games",
      "Strategy",
      "Puzzle"
    ],
    "iconUrl": "https://is1-ssl.mzstatic.com/image/thumb/Purple/v4/c9/8f/86/c98f86d2-977b-1109-2a38-2d0073445490/Er3mZYLbgR2vFQcut4vFXw-temp-upload.ypmvgvyy.png/512x512bb.jpg"
  },
];

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
