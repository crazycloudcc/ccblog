import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { createJiti } from "jiti";
import ts from "typescript";
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";

const jiti = createJiti(import.meta.url);
const geometry = await jiti.import("../lib/visualizations/pythagorean.ts");
const data = await jiti.import("../lib/visualizations/lessons.ts");
const { pythagoreanModel, nonRightModel, formatMeasure } = geometry;
const integers = Array.from({ length: 8 }, (_, i) => i + 1);
const legs = [...integers, 1 + Number.EPSILON, 1.125, Math.SQRT2, 2.5, Math.PI, 8 - Number.EPSILON * 4];
const tolerance = 1e-9;
const close = (actual, expected, label = "value") => assert.ok(Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)), `${label}: ${actual} != ${expected}`);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
const distance2 = (a, b) => dot(sub(a, b), sub(a, b));
const signedArea = (polygon) => polygon.reduce((sum, p, i) => sum + cross(p, polygon[(i + 1) % polygon.length]), 0) / 2;
const area = (polygon) => Math.abs(signedArea(polygon));
const rectangle = (x, y, width, height) => [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];

// Independent geometric oracle: convex polygon clipping, not the model's
// area fields, checks actual interior overlap, including coincident edges.
function intersection(subject, clip) {
  let output = subject.map((p) => [...p]);
  const orientation = Math.sign(signedArea(clip));
  for (let edge = 0; edge < clip.length && output.length; edge++) {
    const start = clip[edge], direction = sub(clip[(edge + 1) % clip.length], start);
    const side = (p) => orientation * cross(direction, sub(p, start));
    const input = output;
    output = [];
    let previous = input.at(-1), previousDistance = side(previous);
    for (const current of input) {
      const currentDistance = side(current);
      const previousInside = previousDistance >= -1e-12, currentInside = currentDistance >= -1e-12;
      if (previousInside !== currentInside) {
        const fraction = previousDistance / (previousDistance - currentDistance);
        output.push(previous.map((v, i) => v + fraction * (current[i] - v)));
      }
      if (currentInside) output.push(current);
      previous = current;
      previousDistance = currentDistance;
    }
  }
  return output;
}

function verifyPartition(polygons, side, label) {
  for (const polygon of polygons) {
    assert.ok(area(polygon) > 0, `${label}: nondegenerate region`);
    for (const [x, y] of polygon) {
      assert.ok(x >= -tolerance && x <= side + tolerance && y >= -tolerance && y <= side + tolerance, `${label}: vertex outside frame`);
    }
  }
  for (let i = 0; i < polygons.length; i++) for (let j = i + 1; j < polygons.length; j++) {
    close(area(intersection(polygons[i], polygons[j])), 0, `${label}: overlap ${i}/${j}`);
  }
  // Containment + disjoint interiors + total area equal to the frame proves
  // full coverage, rather than assuming a² + b² describes the drawn regions.
  close(polygons.reduce((sum, polygon) => sum + area(polygon), 0), side * side, `${label}: coverage`);
}

test("polygon-intersection oracle detects overlap, containment and edge-only contact", () => {
  const square = rectangle(0, 0, 2, 2);
  close(area(intersection(square, square)), 4);
  close(area(intersection(square, [...square].reverse())), 4);
  close(area(intersection(square, rectangle(1, 1, 2, 2))), 1);
  close(area(intersection(rectangle(0.5, 0.5, 1, 1), square)), 1);
  close(area(intersection(square, rectangle(2, 0, 2, 2))), 0);
  close(area(intersection(square, rectangle(3, 3, 2, 2))), 0);
  close(area(intersection([[0, 0], [2, 0], [0, 2]], [[2, 2], [0, 2], [2, 0]])), 0);
});

test("all integer leg pairs and decimal boundaries form a true central square and complete endpoint dissections", () => {
  for (const a of legs) for (const b of legs) {
    const start = pythagoreanModel(a, b, 0), end = pythagoreanModel(a, b, 1);
    const label = `a=${a}, b=${b}`;
    assert.equal(start.initial.length, 4);
    assert.equal(start.center.length, 4);
    assert.deepEqual(start.triangles, start.initial);
    assert.deepEqual(pythagoreanModel(a, b), end, "default progress is the completed layout");
    for (const key of ["a", "b", "side", "c", "c2", "a2", "b2", "outer", "piecesArea"]) assert.ok(Number.isFinite(start[key]));
    close(start.side, a + b);
    close(start.a2, a * a); close(start.b2, b * b);
    close(start.c * start.c, a * a + b * b); close(start.c2, a * a + b * b);
    close(start.outer, (a + b) ** 2); close(start.piecesArea, 2 * a * b);
    close(start.outer - start.piecesArea, start.c2);
    const squareEdges = start.center.map((p, i) => sub(start.center[(i + 1) % 4], p));
    for (let i = 0; i < 4; i++) {
      close(dot(squareEdges[i], squareEdges[i]), a * a + b * b, `${label}: square side`);
      close(dot(squareEdges[i], squareEdges[(i + 1) % 4]), 0, `${label}: right square corner`);
      assert.ok(cross(squareEdges[i], squareEdges[(i + 1) % 4]) > 0, "square is convex and consistently ordered");
    }
    close(area(start.center), a * a + b * b);
    verifyPartition([...start.triangles, start.center], a + b, `${label}: initial`);
    verifyPartition([...end.triangles, rectangle(0, 0, a, a), rectangle(a, a, b, b)], a + b, `${label}: final`);
    // The final paired triangles occupy exactly the two claimed a×b rectangles.
    const lowerLeft = rectangle(0, a, a, b), upperRight = rectangle(a, 0, b, a);
    for (const index of [0, 2]) close(area(intersection(end.triangles[index], lowerLeft)), a * b / 2);
    for (const index of [1, 3]) close(area(intersection(end.triangles[index], upperRight)), a * b / 2);
  }
});

test("every 0–100 progress value preserves four rigid congruent right triangles within the frame", () => {
  for (const a of legs) for (const b of legs) {
    const start = pythagoreanModel(a, b, 0), end = pythagoreanModel(a, b, 1);
    for (let progress = 0; progress <= 100; progress++) {
      const m = pythagoreanModel(a, b, progress / 100);
      assert.equal(m.triangles.length, 4);
      for (let piece = 0; piece < 4; piece++) {
        const triangle = m.triangles[piece], initial = start.triangles[piece];
        assert.equal(triangle.length, 3);
        close(area(triangle), a * b / 2);
        close(signedArea(triangle), signedArea(initial), "orientation cannot flip");
        const translation = sub(triangle[0], initial[0]);
        for (let vertex = 0; vertex < 3; vertex++) {
          for (let axis = 0; axis < 2; axis++) {
            close(triangle[vertex][axis] - initial[vertex][axis], translation[axis], "each vertex has the same translation");
            close(triangle[vertex][axis], initial[vertex][axis] + (end.triangles[piece][vertex][axis] - initial[vertex][axis]) * progress / 100, "linear interpolation");
            assert.ok(triangle[vertex][axis] >= -tolerance && triangle[vertex][axis] <= a + b + tolerance, "triangle stays inside the outer square");
          }
        }
        const sides = [distance2(triangle[0], triangle[1]), distance2(triangle[1], triangle[2]), distance2(triangle[2], triangle[0])].sort((x, y) => x - y);
        const expected = [a * a, b * b, a * a + b * b].sort((x, y) => x - y);
        sides.forEach((value, i) => close(value, expected[i], "congruent edge lengths"));
        close(dot(sub(triangle[1], triangle[0]), sub(triangle[2], triangle[0])), 0, "right triangle corner");
      }
    }
  }
});

test("midpoint overlap is real and is not mistakenly treated as an endpoint partition", () => {
  const m = pythagoreanModel(3, 4, 0.5);
  let overlaps = 0;
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) overlaps += area(intersection(m.triangles[i], m.triangles[j]));
  assert.ok(overlaps > 0, "this animation does allow intersecting pieces in transit");
  close(m.triangles.reduce((sum, triangle) => sum + area(triangle), 0), 24);
});

test("invalid legs, progress and counterexample angles throw before producing nonfinite geometry", () => {
  const invalidNumbers = [NaN, Infinity, -Infinity, null, false, true, "3", "", [], {}, 3n, Symbol("number")];
  for (const value of [...invalidNumbers, undefined, -1, 0, 1 - Number.EPSILON, 8 + Number.EPSILON * 8]) {
    assert.throws(() => pythagoreanModel(value, 4), RangeError);
    assert.throws(() => pythagoreanModel(3, value), RangeError);
  }
  for (const value of [...invalidNumbers, -Number.EPSILON, 1 + Number.EPSILON]) assert.throws(() => pythagoreanModel(3, 4, value), RangeError);
  for (const value of [...invalidNumbers, undefined, 0, 29.999999999, 150.000000001, 180]) assert.throws(() => nonRightModel(value), RangeError);
  for (const progress of [0, Number.EPSILON, 0.12345, 1 - Number.EPSILON, 1]) assert.ok(Number.isFinite(pythagoreanModel(1, 8, progress).c));
});

test("30–150 degree counterexamples agree with Cartesian distances and the measured included angle", () => {
  const angles = [...Array.from({ length: 121 }, (_, i) => i + 30), 30.000001, 44.25, 89.9999, 90.0001, 149.999999];
  let previousC2 = -Infinity;
  for (const angle of [...new Set(angles)].sort((a, b) => a - b)) {
    const m = nonRightModel(angle), origin = [0, 0], base = [3, 0];
    close(distance2(origin, m.vertex), 16, "fixed second side");
    close(distance2(base, m.vertex), m.c2, "c² from independent Cartesian side length");
    close(m.c * m.c, m.c2);
    close(Math.acos(dot(base, m.vertex) / (3 * 4)) * 180 / Math.PI, angle, "included angle");
    assert.ok(m.c > 1 && m.c < 7, "nondegenerate triangle inequalities");
    assert.ok(m.c2 > previousC2, "opposite side increases with included angle");
    previousC2 = m.c2;
    assert.equal(m.isRight, angle === 90);
    if (angle < 90) assert.ok(m.c2 < 25);
    else if (angle > 90) assert.ok(m.c2 > 25);
    else close(m.c2, 25);
  }
  close(nonRightModel(60).c2, 13); close(nonRightModel(90).c, 5); close(nonRightModel(120).c2, 37);
  close(nonRightModel(30).c2, 25 - 12 * Math.sqrt(3));
  close(nonRightModel(150).c2, 25 + 12 * Math.sqrt(3));
  assert.equal(formatMeasure(5), "5"); assert.equal(formatMeasure(Math.SQRT2), "1.41");
  assert.equal(formatMeasure(nonRightModel(60).c2), "13.00");
});

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const compile = (path) => ts.transpileModule(read(path), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
}).outputText;
const componentSource = compile("../components/visualizations/PythagoreanExperience.tsx");
const css = { default: new Proxy({}, { get: (_, name) => name }) };
function loadExperience(react, runtime, link) {
  const imports = {
    react,
    "react/jsx-runtime": runtime,
    "next/link": { default: link },
    "@/lib/visualizations/pythagorean": geometry,
    "./PythagoreanExperience.module.css": css,
  };
  const exports = {};
  new Function("exports", "require", componentSource)(exports, (id) => { assert.ok(id in imports, id); return imports[id]; });
  return exports.PythagoreanExperience;
}
const elements = (node) => Array.isArray(node) ? node.flatMap(elements) : node && typeof node === "object" ? [node, ...elements(node.props?.children)] : [];
const text = (node) => Array.isArray(node) ? node.map(text).join("") : node && typeof node === "object" ? text(node.props?.children) : node == null || typeof node === "boolean" ? "" : String(node);

// This is a source-level event/state harness, not a DOM or browser test.
function setup() {
  const slots = []; let cursor = 0, tree;
  const jsx = (type, props) => ({ type, props });
  const react = {
    useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = initial; return [slots[i], (next) => { slots[i] = typeof next === "function" ? next(slots[i]) : next; }]; },
    useId() { const i = cursor++; if (!(i in slots)) slots[i] = `pythagorean-test-${i}`; return slots[i]; },
  };
  const Experience = loadExperience(react, { jsx, jsxs: jsx, Fragment: "fragment" }, ({ children, ...props }) => jsx("a", { ...props, children }));
  const expand = (node) => Array.isArray(node) ? node.map(expand) : !node || typeof node !== "object" ? node : typeof node.type === "function" ? expand(node.type(node.props)) : { ...node, props: { ...node.props, children: expand(node.props?.children) } };
  const render = () => { cursor = 0; tree = expand(Experience({ children: jsx("section", { children: "Static lesson content" }) })); return elements(tree); };
  const find = (type, predicate = () => true) => { const node = elements(tree).find((item) => item.type === type && predicate(item)); assert.ok(node, `missing ${type}`); return node; };
  const range = (name) => find("input", (node) => node.props["aria-label"] === name || node.props.id.endsWith(`-${name}`));
  const change = (name, value) => { range(name).props.onChange({ target: { value: String(value) } }); render(); };
  const click = (label) => { find("button", (node) => text(node) === label).props.onClick(); render(); };
  const plots = () => elements(tree).filter((node) => node.type === "svg").slice(0, 2);
  render();
  return { render, find, range, change, click, plots };
}

function drawnPolygons(svg, className) {
  return elements(svg).filter((node) => node.type === "polygon" && node.props.className === className).map((node) => node.props.points.split(" ").map((p) => p.split(",").map(Number)));
}

test("source-level controls switch stages, preserve the fixed reference and fully reset repeated interactions", () => {
  const ui = setup();
  assert.equal(ui.range("a").props.value, 3); assert.equal(ui.range("b").props.value, 4);
  assert.equal(ui.range("progress").props.value, 100); assert.equal(ui.range("angle").props.value, 60);
  const reference = drawnPolygons(ui.plots()[0], "triangle");
  for (const [label, value, caption] of [["1 观察斜边平方", 0, /先看斜边/], ["2 移动三角形", 50, /只移动/], ["3 比较两块平方", 100, /余下面积相等/]]) {
    ui.click(label); ui.click(label);
    assert.equal(ui.range("progress").props.value, value);
    assert.match(text(ui.find("section", (node) => node.props.className === "conclusion")), caption);
    assert.deepEqual(drawnPolygons(ui.plots()[0], "triangle"), reference);
    assert.equal(ui.render().filter((node) => node.type === "button" && node.props["aria-pressed"] === true).length, 1);
    if (value === 50) {
      assert.match(text(ui.find("p", (node) => node.props.className === "motionNote")), /允许重叠.*终点再比较剩余面积/);
      assert.equal(drawnPolygons(ui.plots()[1], "cSquare").length, 0);
      assert.equal(elements(ui.plots()[1]).filter((node) => ["aSquare", "bSquare"].includes(node.props.className)).length, 0);
      assert.match(text(ui.find("section", (node) => node.props.className === "conclusion")), /不用此时的空白面积作证明/);
    }
  }
  ui.change("a", 8); ui.change("b", 1); ui.change("angle", 150); ui.change("progress", 37);
  ui.click("重置"); ui.click("重置");
  assert.deepEqual(["a", "b", "progress", "angle"].map((name) => ui.range(name).props.value), [3, 4, 0, 60]);
  assert.deepEqual(drawnPolygons(ui.plots()[0], "triangle"), drawnPolygons(ui.plots()[1], "triangle"));
  assert.match(text(ui.find("article")), /Static lesson content/);
});

test("source-level SVG endpoints independently cover the frame for all 64 slider combinations", () => {
  const ui = setup();
  for (const a of integers) for (const b of integers) {
    ui.change("a", a); ui.change("b", b);
    for (const progress of [0, 100]) {
      ui.change("progress", progress);
      for (const [index, svg] of ui.plots().entries()) {
        const triangles = drawnPolygons(svg, "triangle");
        assert.equal(triangles.length, 4);
        const squares = index === 0 || progress === 0 ? drawnPolygons(svg, "cSquare") : elements(svg).filter((node) => ["aSquare", "bSquare"].includes(node.props.className)).map((node) => rectangle(Number(node.props.x), Number(node.props.y), Number(node.props.width), Number(node.props.height)));
        assert.equal(squares.length, index === 0 || progress === 0 ? 1 : 2);
        const modelPolygons = [...triangles, ...squares].map((polygon) => polygon.map(([x, y]) => [(x - 50) * (a + b) / 280, (y - 45) * (a + b) / 280]));
        verifyPartition(modelPolygons, a + b, `rendered a=${a}, b=${b}, progress=${progress}, plot=${index}`);
        const ids = elements(svg).filter((node) => node.type === "g").map((node) => node.props["data-piece"]);
        assert.deepEqual(ids, [1, 2, 3, 4]);
      }
    }
  }
});

test("source-level counterexample slider keeps lengths and right-angle marking synchronized", () => {
  const ui = setup();
  for (let angle = 30; angle <= 150; angle += 15) {
    ui.change("angle", angle);
    const counter = ui.find("section", (node) => node.props.className === "counterexample");
    const svg = elements(counter).find((node) => node.type === "svg");
    assert.match(svg.props["aria-label"], new RegExp(`夹角${angle}度`));
    const [origin, base, vertex] = drawnPolygons(svg, "counterTriangle")[0];
    close(distance2(origin, base) / 42 ** 2, 9);
    close(distance2(origin, vertex) / 42 ** 2, 16);
    close(distance2(base, vertex) / 42 ** 2, nonRightModel(angle).c2);
    assert.equal(elements(svg).filter((node) => node.props.className === "rightAngle").length, angle === 90 ? 1 : 0);
    const answer = text(elements(counter).find((node) => node.props.className === "counterAnswer"));
    assert.match(answer, angle === 90 ? /c² = 25 = 3² \+ 4² = 25/ : /≠ 3² \+ 4² = 25/);
  }
});

test("actual React SSR includes accessible diagrams, bounded labelled controls and complete static proof", () => {
  const link = ({ children, ...props }) => React.createElement("a", props, children);
  const Experience = loadExperience(React, jsxRuntime, link);
  const reading = {}, readingImports = { "react/jsx-runtime": jsxRuntime, "next/link": { default: link }, "@/lib/visualizations/lessons": data, "@/lib/site": { siteConfig: { author: "Test author" } }, "./LessonReading.module.css": css };
  new Function("exports", "require", compile("../components/visualizations/LessonReading.tsx"))(reading, (id) => { assert.ok(id in readingImports, id); return readingImports[id]; });
  const html = renderToStaticMarkup(React.createElement(Experience, {}, React.createElement(reading.LessonReading, { slug: "pythagorean-theorem" })));
  assert.equal((html.match(/<svg\b/g) || []).length, 3);
  const titles = [...html.matchAll(/<title[^>]*>([^<]+)<\/title>/g)].map((match) => match[1]);
  assert.equal(titles.length, 2);
  assert.match(titles[0], /摆法一：斜边上的正方形/); assert.match(titles[1], /摆法二：两个直角边上的正方形/);
  const descriptions = [...html.matchAll(/<desc[^>]*>([^<]+)<\/desc>/g)].map((match) => match[1]);
  assert.equal(descriptions.length, 2, "both SVG descriptions survive React 19 server rendering");
  for (const description of descriptions) assert.match(description, /外框边长 7、面积 49.*总面积 24/);
  assert.match(descriptions[0], /中间正方形边长为斜边 c，面积 25/);
  assert.match(descriptions[1], /左上正方形面积 9，右下正方形面积 16，合计 25/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, "SSR IDs must remain unique");
  for (const match of html.matchAll(/aria-labelledby="([^"]+)"/g)) for (const id of match[1].split(" ")) assert.ok(ids.includes(id), `missing label target ${id}`);
  const inputs = [...html.matchAll(/<input\b[^>]*>/g)].map((match) => match[0]);
  assert.equal(inputs.length, 4);
  for (const input of inputs) {
    assert.match(input, /type="range"/);
    const id = input.match(/\bid="([^"]+)"/)[1];
    assert.ok(html.includes(`for="${id}"`), `missing visible label for ${id}`);
  }
  for (const input of inputs.slice(0, 2)) { assert.match(input, /min="1"/); assert.match(input, /max="8"/); assert.match(input, /step="1"/); }
  assert.match(inputs[2], /min="0"/); assert.match(inputs[2], /max="100"/); assert.match(inputs[2], /value="100"/);
  assert.match(inputs[3], /min="30"/); assert.match(inputs[3], /max="150"/); assert.match(inputs[3], /step="15"/);
  assert.match(html, /a²=9/); assert.match(html, /b²=16/); assert.match(html, /c² = 25/);
  assert.ok(html.indexOf('class="equation"') < html.indexOf("去掉相同部分，余下面积相等"), "proof equation precedes the explanation");
  assert.match(html, /class="equationTerm"/);
  assert.ok(html.indexOf('class="progress"') < html.indexOf('class="stage"'), "all progress controls precede the stage");
  assert.doesNotMatch(html, /NaN|Infinity|undefined|<script\b/);
  const lesson = data.lessons["pythagorean-theorem"];
  for (const value of [lesson.shortAnswer, lesson.conditions, lesson.invariant, lesson.complexity, lesson.answer, ...lesson.steps, ...lesson.mistakes]) {
    const escaped = renderToStaticMarkup(React.createElement("span", {}, value)).slice(6, -7);
    assert.ok(html.includes(escaped), `missing server-readable content: ${value}`);
  }
  assert.match(html, /href="\/learn\/pythagorean-theorem\/index.md"/);
  assert.doesNotMatch(html, /href="\/blog\/pythagorean-theorem"/);
});

test("altitude clarification preserves right-angle conditions and handles internal or external feet", () => {
  const lesson = data.lessons["pythagorean-theorem"];
  const note = lesson.mistakes.find((value) => value.includes("向对边所在直线作高"));
  assert.match(note, /非直角三角形不能直接对三边套用/);
  assert.match(note, /形成的两个直角三角形/);
  assert.match(note, /垂足也可能落在边的延长线上/);
  assert.match(note, /已知条件是否足够/);
  assert.doesNotMatch(note, /把原三角形分成/);
  // Independent coordinates: base endpoints (0,0),(6,0), vertex (x,h).
  // x inside/outside the base covers acute and obtuse configurations;
  // each squared distance is checked from coordinates, not the lesson model.
  for (const [x, h] of [[3, 4], [3, 1], [-2, 4], [8, 4], [0.001, 2], [5.999, 2]]) {
    const a = [x, h], b = [0, 0], c = [6, 0], foot = [x, 0];
    close(dot(sub(a, foot), sub(b, foot)), 0);
    close(dot(sub(a, foot), sub(c, foot)), 0);
    close(distance2(a, b), h * h + x * x);
    close(distance2(a, c), h * h + (6 - x) ** 2);
    assert.ok(area([a, b, c]) > 0);
    if (x < 0 || x > 6) assert.ok(Math.abs(x) + Math.abs(6 - x) > 6, "external feet do not partition the original base");
  }
  assert.equal(lesson.published, "2026-10-09");
});
