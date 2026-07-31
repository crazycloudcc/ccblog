#!/usr/bin/env node
/**
 * Sync lib/apps.ts from Apple iTunes Lookup API.
 *
 * Runs automatically before `npm run build` (prebuild hook).
 * Manual refresh: npm run sync:apps
 *
 * Skipped automatically when features.apps is false in ccblog.config.ts.
 *
 * Env:
 *   APPLE_DEVELOPER_ID — overrides config.apps.developerId
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APPS_FILE = path.join(__dirname, "../lib/apps.ts");

// Load the typed site config so the sync respects feature flags.
const jiti = createJiti(import.meta.url);
const config = (await jiti.import(path.join(__dirname, "../ccblog.config.ts"))).default;

if (!config.features?.apps) {
  console.log("[sync-apps] features.apps is false in ccblog.config.ts - skipping sync");
  process.exit(0);
}

const DEVELOPER_ID = Number(
  process.env.APPLE_DEVELOPER_ID ?? process.argv[2] ?? config.apps?.developerId,
);

const TAGLINES = config.apps?.taglines ?? {};

function slugify(name) {
  return name
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function categorize(app) {
  const genres = app.genres ?? [];
  if (app.primaryGenreName === "Games" || genres.includes("Games")) {
    return "game";
  }
  return "utility";
}

function firstSentence(text) {
  const normalized = (text ?? "").replace(/\s+/g, " ").trim();
  const match = normalized.match(/^(.+?[.!?])(?:\s|$)/);
  return (match?.[1] ?? normalized).slice(0, 160);
}

async function fetchApps() {
  const url = `https://itunes.apple.com/lookup?id=${DEVELOPER_ID}&entity=software&country=us`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`iTunes lookup failed (${response.status}) for developer ${DEVELOPER_ID}`);
  }

  const data = await response.json();
  const apps = (data.results ?? []).filter((item) => item.wrapperType === "software");

  if (apps.length === 0) {
    throw new Error(`iTunes lookup returned no apps for developer ${DEVELOPER_ID}`);
  }

  return apps;
}

function formatAppsArray(apps) {
  const entries = apps
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
    .map((app) => {
      const name = app.trackName;
      const tags = [app.primaryGenreName, ...(app.genres ?? [])]
        .filter((tag, index, list) => list.indexOf(tag) === index)
        .slice(0, 3);

      const entry = {
        slug: slugify(name),
        name,
        category: categorize(app),
        tagline: TAGLINES[name] ?? firstSentence(app.description).slice(0, 80),
        description: firstSentence(app.description),
        appStoreUrl: app.trackViewUrl.split("?")[0],
        releaseDate: app.releaseDate.slice(0, 10),
        version: app.version,
        tags,
        iconUrl: app.artworkUrl512,
      };

      return `  ${JSON.stringify(entry, null, 2).replace(/\n/g, "\n  ")},`;
    })
    .join("\n");

  return `export const apps: AppRelease[] = [\n${entries}\n];`;
}

function updateAppsFile(appsBlock) {
  const source = fs.readFileSync(APPS_FILE, "utf8");
  const match = source.match(/export const apps: AppRelease\[] = \[[\s\S]*?\];/);

  if (!match) {
    throw new Error("Could not find apps array in lib/apps.ts");
  }

  if (match[0] === appsBlock) {
    return false;
  }

  const updated = source.replace(/export const apps: AppRelease\[] = \[[\s\S]*?\];/, appsBlock);
  fs.writeFileSync(APPS_FILE, updated);
  return true;
}

try {
  const apps = await fetchApps();
  console.log(`[sync-apps] Fetched ${apps.length} apps for developer ${DEVELOPER_ID}`);

  const appsBlock = formatAppsArray(apps);
  const changed = updateAppsFile(appsBlock);

  if (changed) {
    console.log(`[sync-apps] Updated ${APPS_FILE}`);
  } else {
    console.log(`[sync-apps] ${APPS_FILE} is already up to date`);
  }
} catch (error) {
  console.error("[sync-apps] Failed:", error instanceof Error ? error.message : error);
  process.exit(1);
}
