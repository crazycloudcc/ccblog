import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, { alias: { "@": new URL("..", import.meta.url).pathname } });
const { lisTrace } = await jiti.import("../lib/visualizations/traces.ts");
const { lessons } = await jiti.import("../lib/visualizations/lessons.ts");
const { renderLessonMarkdown, lessonStructuredData } = await jiti.import("../lib/visualizations/lesson-publication.ts");

// Independent oracle: enumerate original index subsets, without tails or DP.
function longestChoices(values, nondecreasing = false) {
  let length = 0;
  let choices = [];
  for (let mask = 1; mask < 2 ** values.length; mask++) {
    const indices = values.flatMap((_, i) => mask & (1 << i) ? [i] : []);
    if (!indices.every((index, i) => !i || (nondecreasing ? values[indices[i - 1]] <= values[index] : values[indices[i - 1]] < values[index]))) continue;
    if (indices.length > length) { length = indices.length; choices = []; }
    if (indices.length === length) choices.push(indices);
  }
  return { length, choices };
}

test("equal final minimum tails do not determine the number of index-distinct LIS", () => {
  for (const values of [[1, 3, 2], [3, 1, 2]]) {
    assert.deepEqual(lisTrace(values).at(-1).tails, [1, 2]);
    assert.equal(longestChoices(values).length, 2);
  }
  assert.deepEqual(longestChoices([1, 3, 2]).choices, [[0, 1], [0, 2]]);
  assert.deepEqual(longestChoices([3, 1, 2]).choices, [[1, 2]]);
});

test("duplicate values distinguish index counting, value deduplication and nondecreasing length", () => {
  const values = [2, 2, 2];
  const strict = longestChoices(values);
  assert.equal(strict.length, 1);
  assert.deepEqual(strict.choices, [[0], [1], [2]]);
  assert.equal(new Set(strict.choices.map(indices => JSON.stringify(indices.map(i => values[i])))).size, 1);
  assert.deepEqual(longestChoices(values, true), { length: 3, choices: [[0, 1, 2]] });
  assert.equal(lisTrace(values).at(-1).tails.length, 1);
  assert.equal(lisTrace(values, true).at(-1).tails.length, 3);
  assert.deepEqual(longestChoices([0]), { length: 1, choices: [[0]] });
  assert.deepEqual(longestChoices([]), { length: 0, choices: [] }); // Only nonempty subsequences counted by this test oracle.
});

test("count FAQ is shared with static Markdown and keeps original publication identity", () => {
  const slug = "longest-increasing-subsequence";
  const lesson = lessons[slug];
  const countFaqs = lesson.mistakes.slice(-2);
  assert.match(countFaqs[0], /\[1, 3, 2\].*\[3, 1, 2\].*最终 tails.*\[1, 2\].*两条.*一条/);
  assert.match(countFaqs[0], /最终状态不足以确定方案数.*每个原下标.*更长时替换计数，同长时累加/);
  assert.match(countFaqs[1], /按原数组下标.*3 种下标选择.*按值序列去重.*另一种计数口径.*非下降长度为 3.*1 种/);
  assert.match(countFaqs[1], /不计算方案总数/);
  for (const faq of countFaqs) assert.ok(renderLessonMarkdown(slug).includes(faq));
  assert.equal(lesson.published, "2026-10-07");
  assert.equal(lesson.updated, "2026-10-15");
  const article = lessonStructuredData(slug)["@graph"][0];
  assert.equal(article.datePublished, "2026-10-07");
  assert.equal(article.dateModified, "2026-10-15");
  assert.equal(article.url, "https://crazycloud.cc/learn/longest-increasing-subsequence");
});
