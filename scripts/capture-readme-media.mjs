#!/usr/bin/env node
/**
 * Capture real README stills + a short hero GIF from a running production server.
 *
 * Usage:
 *   BASE_URL=http://127.0.0.1:3010 node scripts/capture-readme-media.mjs
 *
 * Requires puppeteer-core (not a project dep) and Google Chrome on macOS.
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "docs/media");
const BASE_URL = (process.env.BASE_URL ?? "http://127.0.0.1:3010").replace(/\/$/, "");
const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const VIEWPORT = { width: 1440, height: 900 };

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadPuppeteer() {
  const candidates = [
    process.env.PUPPETEER_CORE,
    "/tmp/ccblog-capture/package.json",
    path.join(os.tmpdir(), "ccblog-capture/package.json"),
    path.join(ROOT, "package.json"),
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      const require = createRequire(candidate);
      return require("puppeteer-core");
    } catch {
      // try next
    }
  }

  throw new Error(
    "puppeteer-core not found. Install it with: mkdir -p /tmp/ccblog-capture && npm --prefix /tmp/ccblog-capture install puppeteer-core",
  );
}

async function waitForReady(page, timeoutMs, label, check) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await check()) {
      return;
    }
    await sleep(200);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

async function waitForText(page, text, timeoutMs = 20000) {
  await waitForReady(page, timeoutMs, `text "${text}"`, async () => {
    const body = await page.evaluate(() => document.body?.innerText ?? "");
    return body.includes(text);
  });
}

async function innerText(target) {
  return target.evaluate(() => document.body?.innerText ?? "");
}

async function waitForRunSuccess(target, token, timeoutMs = 90000) {
  await waitForReady(target, timeoutMs, `successful run (${token})`, async () => {
    const body = await innerText(target);
    return body.includes("exit 0") && !body.includes("compiling...") && !body.includes("running...");
  });
}

async function clickText(page, text) {
  const clicked = await page.evaluate((target) => {
    const nodes = Array.from(document.querySelectorAll("a, button"));
    const match = nodes.find((node) => (node.textContent ?? "").trim() === target);
    if (!match) {
      return false;
    }
    match.click();
    return true;
  }, text);

  if (!clicked) {
    throw new Error(`Could not click "${text}"`);
  }
}

async function startScreencast(page, frameDir) {
  await fs.mkdir(frameDir, { recursive: true });
  const client = await page.createCDPSession();
  let index = 0;
  const frames = [];

  client.on("Page.screencastFrame", async (event) => {
    const file = path.join(frameDir, `frame-${String(index).padStart(4, "0")}.jpg`);
    index += 1;
    frames.push(file);
    await fs.writeFile(file, Buffer.from(event.data, "base64"));
    try {
      await client.send("Page.screencastFrameAck", { sessionId: event.sessionId });
    } catch {
      // session may already be closed
    }
  });

  await client.send("Page.startScreencast", {
    format: "jpeg",
    quality: 72,
    maxWidth: 1440,
    maxHeight: 900,
    everyNthFrame: 1,
  });

  return {
    frames,
    stop: async () => {
      try {
        await client.send("Page.stopScreencast");
      } catch {
        // ignore
      }
    },
  };
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", args, { stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ffmpeg exited ${code}`));
      }
    });
  });
}

async function main() {
  const puppeteer = loadPuppeteer();
  await fs.mkdir(OUT, { recursive: true });

  const probe = await fetch(BASE_URL);
  if (!probe.ok) {
    throw new Error(`${BASE_URL} returned ${probe.status}`);
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: [
      "--hide-scrollbars",
      `--window-size=${VIEWPORT.width},${VIEWPORT.height}`,
      "--force-dark-mode",
    ],
    defaultViewport: { ...VIEWPORT, deviceScaleFactor: 2 },
  });

  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "dark" }]);
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem("theme-preference", "dark");
  });

  // Warm the playground toolchain first so later shots and the GIF stay short.
  console.log("warming /playground toolchain…");
  await page.goto(`${BASE_URL}/playground`, { waitUntil: "load", timeout: 120000 });
  await page.evaluate(() => {
    localStorage.removeItem("playground-draft:stdin");
    localStorage.removeItem("playground-draft:c");
    localStorage.removeItem("playground-draft:cpp");
  });
  await page.reload({ waitUntil: "load" });
  await waitForText(page, "toolchain", 120000);
  await waitForReady(page, 180000, "toolchain ready", async () => {
    const body = await page.evaluate(() => document.body?.innerText ?? "");
    return body.includes("toolchain: ready");
  });
  await page.select("select", "hello.cpp").catch(async () => {
    await page.select("label select", "hello.cpp");
  });
  await page.evaluate(() => {
    const stdin = document.querySelector("textarea");
    if (stdin) {
      const proto = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value");
      proto?.set?.call(stdin, "");
      stdin.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
  await sleep(400);
  await clickText(page, "run");
  await waitForRunSuccess(page, "hello.cpp");
  await sleep(500);
  await page.screenshot({ path: path.join(OUT, "playground-run.png"), type: "png" });
  console.log("wrote playground-run.png");

  console.log("capturing /blog/quicksort embed…");
  await page.evaluate(() => {
    localStorage.removeItem("playground-draft:stdin");
    localStorage.removeItem("playground-draft:c");
    localStorage.removeItem("playground-draft:cpp");
  });
  await page.goto(`${BASE_URL}/blog/quicksort`, { waitUntil: "load", timeout: 120000 });
  await waitForText(page, "Run it", 30000);
  await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll("h1, h2, h3")).find((node) =>
      /run it/i.test(node.textContent ?? ""),
    );
    heading?.scrollIntoView({ block: "start" });
  });
  const embed = await page.waitForSelector("iframe", { timeout: 60000 });
  const frame = embed ? await embed.contentFrame() : null;
  if (!frame) {
    await page.screenshot({ path: path.join(OUT, "quicksort-embed-debug.png"), type: "png" });
    throw new Error("quicksort embed iframe has no content frame");
  }
  await waitForReady(frame, 180000, "embed toolchain ready", async () => {
    const body = await innerText(frame);
    return body.includes("toolchain: ready");
  });
  const sourceReady = await frame
    .waitForFunction(
      () => /partition|quicksort/i.test(document.body?.innerText ?? ""),
      { timeout: 8000 },
    )
    .then(() => true)
    .catch(() => false);
  if (sourceReady) {
    const run = await frame.evaluate(() => {
      const button = Array.from(document.querySelectorAll("button")).find(
        (node) => (node.textContent ?? "").trim() === "run" && !node.disabled,
      );
      if (!button) {
        return false;
      }
      button.click();
      return true;
    });
    if (run) {
      await waitForRunSuccess(frame, "quicksort embed").catch(() => undefined);
    }
  } else {
    console.warn("embed did not show quicksort source; capturing the article block anyway");
  }
  await page.evaluate(() => {
    const block = document.querySelector("iframe[title*='playground']")?.closest("div");
    block?.scrollIntoView({ block: "center" });
  });
  await sleep(400);
  await page.screenshot({ path: path.join(OUT, "quicksort-embed.png"), type: "png" });
  console.log("wrote quicksort-embed.png");

  console.log("capturing home still after boot…");
  await page.goto(`${BASE_URL}/`, { waitUntil: "load", timeout: 60000 });
  await waitForText(page, "ls -la", 20000);
  await waitForText(page, "playground.cc", 20000);
  await sleep(800);
  await page.screenshot({ path: path.join(OUT, "home-dark.png"), type: "png" });
  console.log("wrote home-dark.png");

  await runFfmpeg([
    "-y",
    "-i",
    path.join(OUT, "home-dark.png"),
    "-update",
    "1",
    "-frames:v",
    "1",
    "-vf",
    "scale=1280:640:force_original_aspect_ratio=increase,crop=1280:640",
    path.join(OUT, "social-preview.png"),
  ]);
  console.log("wrote social-preview.png");

  console.log("recording hero GIF…");
  await page.setViewport({ ...VIEWPORT, deviceScaleFactor: 1 });
  const frameDir = await fs.mkdtemp(path.join(os.tmpdir(), "ccblog-gif-"));
  await page.goto("about:blank");
  const cast = await startScreencast(page, frameDir);
  await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await waitForText(page, "playground.cc", 20000);
  await sleep(700);
  const opened = await page.evaluate(() => {
    const link = Array.from(document.querySelectorAll("a")).find(
      (node) => (node.textContent ?? "").trim() === "playground.cc" && node.offsetParent !== null,
    );
    if (!link) {
      return false;
    }
    link.click();
    return true;
  });
  if (!opened) {
    await page.goto(`${BASE_URL}/playground`, { waitUntil: "load", timeout: 60000 });
  }
  await waitForReady(page, 60000, "playground page", async () => {
    return page.url().includes("/playground");
  });
  await waitForReady(page, 60000, "toolchain ready (gif)", async () => {
    const body = await page.evaluate(() => document.body?.innerText ?? "");
    return body.includes("toolchain: ready");
  });
  await page.select("select", "hello.cpp").catch(async () => {
    await page.select("label select", "hello.cpp");
  });
  await sleep(300);
  await clickText(page, "run");
  await waitForRunSuccess(page, "gif hello.cpp");
  await sleep(1200);
  await cast.stop();
  await browser.close();

  const rawGif = path.join(frameDir, "raw.gif");
  await runFfmpeg([
    "-y",
    "-framerate",
    "12",
    "-pattern_type",
    "glob",
    "-i",
    path.join(frameDir, "frame-*.jpg"),
    "-vf",
    "fps=12,scale=1200:-1:flags=lanczos",
    rawGif,
  ]);

  let outGif = path.join(OUT, "boot-and-run.gif");
  await runFfmpeg(["-y", "-i", rawGif, "-loop", "0", outGif]);

  let stat = await fs.stat(outGif);
  if (stat.size > 2.5 * 1024 * 1024) {
    await runFfmpeg([
      "-y",
      "-i",
      rawGif,
      "-vf",
      "fps=10,scale=1000:-1:flags=lanczos",
      "-loop",
      "0",
      outGif,
    ]);
    stat = await fs.stat(outGif);
  }

  console.log(`wrote boot-and-run.gif (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
