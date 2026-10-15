import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, { alias: { "@": new URL("..", import.meta.url).pathname } });
const { lisTrace } = await jiti.import("../lib/visualizations/traces.ts");
const { lessons } = await jiti.import("../lib/visualizations/lessons.ts");
const { renderLessonMarkdown } = await jiti.import("../lib/visualizations/lesson-publication.ts");

// Independent deletion oracle: enumerate subsets of original indices.
function minimumDeletions(values, nondecreasing) {
  let best = values.length;
  for (let mask = 0; mask < 2 ** values.length; mask++) {
    const kept = values.filter((_, i) => mask & (1 << i));
    if (kept.every((v, i) => !i || (nondecreasing ? kept[i - 1] <= v : kept[i - 1] < v))) {
      best = Math.min(best, values.length - kept.length);
    }
  }
  return best;
}

function* arrays(length, alphabet) {
  if (!length) { yield []; return; }
  for (const prefix of arrays(length - 1, alphabet)) for (const v of alphabet) yield [...prefix, v];
}

// Exact graph distance, independent of LIS: a move extracts one item and
// reinserts it in any position. Moves are reversible, so BFS from the sorted
// multiset gives the minimum moves for every permutation of that multiset.
function relocationDistances(sorted) {
  const distances = new Map([[JSON.stringify(sorted), 0]]);
  const queue = [sorted];
  for (let head = 0; head < queue.length; head++) {
    const current = queue[head];
    const nextDistance = distances.get(JSON.stringify(current)) + 1;
    for (let from = 0; from < current.length; from++) {
      const rest = current.filter((_, i) => i !== from);
      for (let to = 0; to <= rest.length; to++) {
        const next = [...rest.slice(0, to), current[from], ...rest.slice(to)];
        const key = JSON.stringify(next);
        if (distances.has(key)) continue;
        distances.set(key, nextDistance);
        queue.push(next);
      }
    }
  }
  return distances;
}

test("minimum deletions agrees with application LIS/LNDS traces, including duplicates and empty input", () => {
  let checked = 0;
  for (let n = 0; n <= 6; n++) for (const values of arrays(n, [-1, 0, 1])) {
    for (const nondecreasing of [false, true]) {
      const length = lisTrace(values, nondecreasing).at(-1).tails.length;
      assert.equal(values.length - length, minimumDeletions(values, nondecreasing), JSON.stringify({ values, nondecreasing }));
    }
    checked++;
  }
  assert.equal(checked, 1093);
});

test("distinct-value extract/reinsert sorting distance equals n minus actual LIS length", () => {
  let checked = 0;
  for (let n = 0; n <= 7; n++) {
    for (const [key, moves] of relocationDistances(Array.from({ length: n }, (_, i) => i))) {
      const values = JSON.parse(key);
      assert.equal(moves, n - lisTrace(values).at(-1).tails.length, key);
      checked++;
    }
  }
  assert.equal(checked, 5914);
});

test("duplicate-value nondecreasing sorting distance uses LNDS, not strict LIS", () => {
  const cache = new Map();
  let checked = 0;
  for (let n = 0; n <= 6; n++) for (const values of arrays(n, [-1, 0, 1])) {
    const sorted = values.toSorted((a, b) => a - b);
    const sortedKey = JSON.stringify(sorted);
    if (!cache.has(sortedKey)) cache.set(sortedKey, relocationDistances(sorted));
    const moves = cache.get(sortedKey).get(JSON.stringify(values));
    assert.equal(moves, n - lisTrace(values, true).at(-1).tails.length, JSON.stringify(values));
    checked++;
  }
  assert.equal(checked, 1093);
  assert.equal(relocationDistances([2, 2, 2]).get("[2,2,2]"), 0);
  assert.equal(3 - lisTrace([2, 2, 2]).at(-1).tails.length, 2); // Strict deletion cost, not a sorting move count.
});

test("published deletion example and swap counterexample have different operation models", () => {
  const values = [3, 5, 7, 1, 2, 8];
  assert.deepEqual(values.filter((_, i) => ![3, 4].includes(i)), [3, 5, 7, 8]);
  assert.equal(values.length - lisTrace(values).at(-1).tails.length, 2);
  const reverse = [3, 2, 1];
  assert.equal(relocationDistances([1, 2, 3]).get(JSON.stringify(reverse)), 2);
  [reverse[0], reverse[2]] = [reverse[2], reverse[0]];
  assert.deepEqual(reverse, [1, 2, 3]); // One arbitrary swap.
});

test("application FAQ exposes both bounds and operation limits in shared static Markdown", () => {
  const slug = "longest-increasing-subsequence";
  const { applications } = lessons[slug];
  assert.equal(applications.items.length, 3);
  const text = applications.items.map(item => item.answer).join("\n");
  assert.match(text, /最多保留 L 个.*真实 LIS.*n−L/s);
  assert.match(text, /n−LNDS.*最长非下降/);
  assert.match(text, /元素互不相同.*取出一个元素.*任意位置.*n−m.*m≥n−L/s);
  assert.match(text, /锚点.*从小到大.*下一个更大锚点.*每个至多移一次/s);
  assert.match(text, /相对顺序.*下标可以改变.*不能把 tails/s);
  assert.match(text, /重复值无法只靠重排变成严格递增/);
  assert.match(text, /\[3, 2, 1\].*两次.*交换首尾一次/);
  assert.match(text, /最长连续递增片段.*不生成删除或移动指令/);
  assert.match(text, /上图展示长度和一条真实路径；同步代码只求长度，两者都不生成删除或移动指令/);
  const md = renderLessonMarkdown(slug);
  assert.ok(md.includes(`## ${applications.title}`));
  for (const { question, answer } of applications.items) {
    assert.ok(md.includes(question));
    assert.ok(md.includes(answer));
  }
});
