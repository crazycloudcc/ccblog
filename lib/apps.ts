import { features } from "@/lib/site";

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
    "slug": "piano-composer-record-play",
    "name": "Piano Composer: Record & Play",
    "category": "utility",
    "tagline": "Play the on-screen piano and save your performance as sheet music.",
    "description": "Play the on-screen piano and save your performance as sheet music.",
    "appStoreUrl": "https://apps.apple.com/us/app/piano-composer-record-play/id6804694216",
    "releaseDate": "2026-09-16",
    "version": "1.0.0",
    "tags": [
      "Music"
    ],
    "iconUrl": "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/cb/54/78/cb5478ce-760b-b940-e93d-34811a8e5cc2/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg"
  },
  {
    "slug": "paddlefall-ball-survival",
    "name": "Paddlefall: Ball Survival",
    "category": "game",
    "tagline": "One miss can end the run.",
    "description": "One miss can end the run.",
    "appStoreUrl": "https://apps.apple.com/us/app/paddlefall-ball-survival/id6802052967",
    "releaseDate": "2026-08-25",
    "version": "1.0.0",
    "tags": [
      "Games",
      "Casual",
      "Puzzle"
    ],
    "iconUrl": "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/c9/3f/d4/c93fd4ac-0fcb-9fe8-d035-2f7b5779ff35/AppIcon-0-0-1x_U007emarketing-0-9-0-85-220.png/512x512bb.jpg"
  },
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
    "slug": "weather-trace-forecast",
    "name": "Weather Trace: Forecast",
    "category": "utility",
    "tagline": "Weather Trace shows current conditions, hourly forecasts, and daily outlooks bas",
    "description": "Weather Trace shows current conditions, hourly forecasts, and daily outlooks based on your location.",
    "appStoreUrl": "https://apps.apple.com/us/app/weather-trace-forecast/id6761846937",
    "releaseDate": "2026-05-08",
    "version": "1.1.1",
    "tags": [
      "Weather",
      "Utilities"
    ],
    "iconUrl": "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/e8/63/41/e863415e-f0af-f2a7-877a-37d5a692833a/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg"
  },
  {
    "slug": "localbeats-offline-player",
    "name": "LocalBeats: Offline Player",
    "category": "utility",
    "tagline": "LocalBeats is a clean, offline media player for your local music and media files",
    "description": "LocalBeats is a clean, offline media player for your local music and media files.",
    "appStoreUrl": "https://apps.apple.com/us/app/localbeats-offline-player/id6761184551",
    "releaseDate": "2026-04-01",
    "version": "1.1.2",
    "tags": [
      "Music",
      "Utilities"
    ],
    "iconUrl": "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/aa/43/bf/aa43bf27-20a7-1115-7f32-ac6d20255f0c/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg"
  },
  {
    "slug": "cheer-loop-led-banner",
    "name": "Cheer Loop: LED Banner",
    "category": "utility",
    "tagline": "Cheer Loop helps you create bold cheering text and hand-drawn doodles for matche",
    "description": "Cheer Loop helps you create bold cheering text and hand-drawn doodles for matches, concerts, and live events.",
    "appStoreUrl": "https://apps.apple.com/us/app/cheer-loop-led-banner/id6761043891",
    "releaseDate": "2026-03-27",
    "version": "1.1.1",
    "tags": [
      "Entertainment",
      "Sports"
    ],
    "iconUrl": "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/93/11/c4/9311c439-9345-b9fd-faa7-6fb64f4a4ff7/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg"
  },
  {
    "slug": "travel-speaker-translator",
    "name": "Travel Speaker: Translator",
    "category": "utility",
    "tagline": "Translate signs, menus, speech, and typed text while you travel.",
    "description": "Translate signs, menus, speech, and typed text while you travel.",
    "appStoreUrl": "https://apps.apple.com/us/app/travel-speaker-translator/id6755930707",
    "releaseDate": "2026-03-26",
    "version": "1.5.0",
    "tags": [
      "Travel",
      "Utilities"
    ],
    "iconUrl": "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/69/f6/d7/69f6d798-c6b5-0ce3-f071-7214f624712d/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg"
  },
  {
    "slug": "ideamic-voice-notes",
    "name": "IdeaMic: Voice Notes",
    "category": "utility",
    "tagline": "IdeaMic captures spoken ideas in organised threads.",
    "description": "IdeaMic captures spoken ideas in organised threads.",
    "appStoreUrl": "https://apps.apple.com/us/app/ideamic-voice-notes/id6760747245",
    "releaseDate": "2026-03-24",
    "version": "1.1.1",
    "tags": [
      "Productivity",
      "Utilities"
    ],
    "iconUrl": "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/10/be/21/10be21ec-55cb-5002-feb1-08605b8d8ef8/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg"
  },
  {
    "slug": "pdf-tools-pro-scan-ocr",
    "name": "PDF Tools Pro: Scan & OCR",
    "category": "utility",
    "tagline": "PDF Tools Pro keeps everyday PDF work on your iPhone or iPad.",
    "description": "PDF Tools Pro keeps everyday PDF work on your iPhone or iPad.",
    "appStoreUrl": "https://apps.apple.com/us/app/pdf-tools-pro-scan-ocr/id6760276378",
    "releaseDate": "2026-03-20",
    "version": "2.0.2",
    "tags": [
      "Productivity",
      "Utilities"
    ],
    "iconUrl": "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/b4/d2/3b/b4d23bcc-ade1-a4ba-e6c1-2dce29197453/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg"
  },
  {
    "slug": "noise-mixer-sleep-sounds",
    "name": "Noise Mixer: Sleep Sounds",
    "category": "utility",
    "tagline": "Create calm soundscapes for sleep, focus, and relaxation.",
    "description": "Create calm soundscapes for sleep, focus, and relaxation.",
    "appStoreUrl": "https://apps.apple.com/us/app/noise-mixer-sleep-sounds/id6759958402",
    "releaseDate": "2026-03-14",
    "version": "1.2.0",
    "tags": [
      "Health & Fitness",
      "Music"
    ],
    "iconUrl": "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/ec/4f/04/ec4f0496-1b74-78b7-3ba7-30ce2f7b3b0f/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg"
  },
  {
    "slug": "cyberscripts",
    "name": "cYBerScRipts",
    "category": "game",
    "tagline": "Protocol: The Idle Netrunner",
    "description": "[CONNECTING...] cYBerScRipts is a terminal-style idle RPG about rebuilding a broken network one mission at a time.",
    "appStoreUrl": "https://apps.apple.com/us/app/cyberscripts/id6759292189",
    "releaseDate": "2026-02-22",
    "version": "1.3.0",
    "tags": [
      "Entertainment",
      "Casual",
      "Word"
    ],
    "iconUrl": "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/ff/dd/27/ffdd272d-3b47-2dbb-c2fa-68bd561fc72b/AppIcon-0-0-1x_U007emarketing-0-9-0-85-220.png/512x512bb.jpg"
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

export function getApps(): AppRelease[] {
  if (!features.apps) {
    return [];
  }
  return [...apps].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
}

export function getAppBySlug(slug: string): AppRelease | undefined {
  if (!features.apps) {
    return undefined;
  }
  return apps.find((app) => app.slug === slug);
}
