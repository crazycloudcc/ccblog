#!/usr/bin/env node
/**
 * Validate ccblog.config.ts before building.
 *
 * Runs automatically before `npm run build` (prebuild hook), ahead of
 * sync-apps. Exits non-zero with a list of problems if the config is invalid,
 * so a misconfigured fork fails fast instead of producing a broken deploy.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jiti = createJiti(import.meta.url);

const config = (await jiti.import(path.join(__dirname, "../ccblog.config.ts"))).default;
const { assertValidConfig } = await jiti.import(
  path.join(__dirname, "../lib/validate-config.ts"),
);

try {
  assertValidConfig(config);
  console.log("[validate-config] ccblog.config.ts OK");
} catch (error) {
  console.error(`\x1b[31m${error instanceof Error ? error.message : String(error)}\x1b[0m`);
  process.exit(1);
}
