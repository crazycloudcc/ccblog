import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createJiti } from "jiti";
const jiti = createJiti(import.meta.url, { alias: { "@": new URL("..", import.meta.url).pathname } });
const { default: config } = await jiti.import("../next.config.ts");
const { lessons } = await jiti.import("../lib/visualizations/lessons.ts");
const { getTerminalCwd, getPageCdCommand } = await jiti.import("../lib/terminal-paths.ts");
const read = p => readFileSync(new URL(p, import.meta.url), "utf8");
test("only existing legacy lessons redirect permanently before file-system routes", async () => {
  assert.deepEqual(await config.redirects(), Object.keys(lessons).filter(slug => lessons[slug].notesSlug).map(slug => ({ source: `/blog/${slug}/visual`, destination: `/learn/${slug}`, permanent: true })));
});
test("lesson directory has honest prerequisites, estimates, previews and no empty categories", () => {
  for (const lesson of Object.values(lessons)) {
    assert.ok(["算法", "几何"].includes(lesson.category)); assert.ok(lesson.prerequisites); assert.ok(lesson.difficulty);
    assert.ok(lesson.estimatedMinutes > 0);
  }
  const home = read("../app/learn/page.tsx");
  assert.match(home, /LessonPreview/); assert.match(home, /role="img"/); assert.match(home, /分钟（估计）/);
  assert.match(home, /CollectionPage/); assert.match(home, /ItemList/);
  assert.doesNotMatch(home, /已完成|即将上线|BFS/);
});
test("learn uses independent canonical paths, sitemap and navigation", () => {
  const page = read("../app/learn/[slug]/page.tsx");
  assert.match(page, /path: `\/learn\/\$\{slug\}`/);
  const sitemap = read("../app/sitemap.ts");
  assert.match(sitemap, /"\/learn"/); assert.match(sitemap, /absoluteUrl\(`\/learn\/\$\{slug\}`\)/);
  assert.doesNotMatch(sitemap, /\/visual`/);
  for (const component of ["TerminalSidebar", "TerminalNav", "TerminalMobileNav"]) {
    assert.match(read(`../components/terminal/${component}.tsx`), /href: "\/learn"/);
  }
  assert.match(read("../components/visualizations/BinarySearchExperience.tsx"), /href="\/learn"/);
  assert.equal(getTerminalCwd("/learn/binary-search"), "~/learn/binary-search");
  assert.equal(getPageCdCommand("/learn"), "cd ./learn");
});
