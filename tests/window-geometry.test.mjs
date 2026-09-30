import assert from "node:assert/strict";
import { test } from "node:test";
import { createJiti } from "jiti";
const { fitWindowRect, resizeDimension } = await createJiti(import.meta.url).import("../components/terminal/window-geometry.ts");

test("desktop positioned shell fits portrait and landscape viewports", () => {
  const desktop = { x: 100, y: 32, width: 1100, height: 760 };
  assert.deepEqual(fitWindowRect(desktop, { width: 390, height: 844 }), { x: 0, y: 32, width: 390, height: 760 });
  assert.deepEqual(fitWindowRect(desktop, { width: 844, height: 390 }), { x: 0, y: 0, width: 844, height: 390 });
});

test("manual size and position are preserved when they fit", () => {
  const manual = { x: 40, y: 50, width: 500, height: 400 };
  assert.equal(fitWindowRect(manual, { width: 1000, height: 800 }), manual);
});

test("offscreen drag positions are brought into view after viewport resize", () => {
  assert.deepEqual(fitWindowRect({ x: -400, y: 700, width: 500, height: 400 }, { width: 600, height: 600 }), { x: 0, y: 200, width: 500, height: 400 });
});

test("resize minimum cannot overflow narrow or short available space", () => {
  assert.equal(resizeDimension(600, 480, 390), 390);
  assert.equal(resizeDimension(100, 480, 390), 390);
  assert.equal(resizeDimension(100, 320, 200), 200);
  assert.equal(resizeDimension(100, 480, 900), 480);
  assert.equal(resizeDimension(700, 480, 900), 700);
  assert.equal(resizeDimension(1000, 480, 900), 900);
});
