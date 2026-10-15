import test from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('..', import.meta.url).pathname } });
const { lcmModel } = await jiti.import('../lib/visualizations/lcm.ts');
const { lessons } = await jiti.import('../lib/visualizations/lessons.ts');
const { renderLessonMarkdown } = await jiti.import('../lib/visualizations/lesson-publication.ts');

function reduced(n, d) {
  let x = Math.abs(n), y = d;
  while (y) [x, y] = [y, x % y];
  return [n / x, d / x];
}

test('LCM denominators: exact integer scaling preserves each fraction and its sum', () => {
  let cases = 0;
  for (let b = 1; b <= 20; b++) for (let d = 1; d <= 20; d++) {
    const lcm = lcmModel(b, d).lcm;
    for (let m = 1; m < lcm; m++) assert.ok(m % b !== 0 || m % d !== 0);
    for (const factor of [1, 2, 3]) {
      const M = factor * lcm;
      assert.equal(M % b, 0); assert.equal(M % d, 0);
      for (const a of [0, 1, b - 1, b, b + 1]) for (const c of [0, 1, d - 1, d, d + 1]) {
        const scaledA = a * (M / b), scaledC = c * (M / d);
        assert.equal(scaledA * b, a * M);
        assert.equal(scaledC * d, c * M);
        assert.equal((scaledA + scaledC) * b * d, (a * d + c * b) * M);
        assert.deepEqual(reduced(scaledA + scaledC, M), reduced(a * d + c * b, b * d));
        cases++;
      }
    }
  }
  assert.equal(cases, 30000);
});

test('LCM fraction examples distinguish chosen denominator, reduced inputs and reduced sum', () => {
  assert.equal(lcmModel(6, 8).lcm, 24);
  assert.deepEqual([24 / 6, 24 / 8], [4, 3]);
  assert.deepEqual(reduced(4 + 3, 24), [7, 24]);
  assert.deepEqual(reduced(8 + 6, 48), [7, 24]);
  assert.deepEqual(reduced(1, 6), [1, 6]); assert.deepEqual(reduced(1, 3), [1, 3]);
  assert.equal(lcmModel(6, 3).lcm, 6);
  assert.deepEqual(reduced(1 + 2, 6), [1, 2]);
  assert.deepEqual(reduced(2, 6), [1, 3]); assert.deepEqual(reduced(2, 8), [1, 4]);
  assert.equal(lcmModel(3, 4).lcm, 12);
  assert.deepEqual(reduced(2 * 4 + 2 * 3, 24), reduced(4 + 3, 12));
  assert.notDeepEqual(reduced(1 + 1, 6 + 8), [7, 24]); // Adding denominators is not addition.
});

test('LCM application is shared static content with explicit original-denominator and UI boundaries', () => {
  const l = lessons['least-common-multiple'];
  assert.equal(l.applications.items.length, 2);
  const text = l.applications.items.map(item => item.answer).join('\n');
  assert.match(l.conditions, /本课的LCM输入只讨论正整数/);
  assert.match(text, /同一个整体为1.*同乘同一个正整数.*值不变/s);
  assert.match(text, /4\/24\+3\/24=\(4\+3\)×\(1\/24\)=7\/24/);
  assert.match(text, /任何同时被b、d整除的正整数M.*M\/b、M\/d.*这些公倍数中最小.*并非必须/s);
  assert.match(text, /不是分数能够相加的前提/);
  assert.match(text, /即使原分数都已最简.*3\/6仍须约成1\/2/s);
  assert.match(text, /原分数未约分.*1\/3\+1\/4.*12通分.*LCM仍是24/s);
  assert.match(text, /上方交互和同步代码.*1–20.*不计算分数加法/);
  const md = renderLessonMarkdown('least-common-multiple');
  assert.ok(md.includes(`## ${l.applications.title}`));
  for (const { question, answer } of l.applications.items) {
    assert.ok(md.includes(question)); assert.ok(md.includes(answer));
  }
  assert.equal(l.published, '2026-10-15'); assert.equal(l.updated, '2026-10-15');
});
