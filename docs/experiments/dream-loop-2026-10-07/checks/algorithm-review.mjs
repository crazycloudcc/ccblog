// Independent, read-only LIS review. Run: node docs/experiments/dream-loop-2026-10-07/checks/algorithm-review.mjs
// This is a deterministic algorithm/UI/SSR check, not a real-browser test.
import fs from "node:fs";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import ts from "typescript";
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";

const root = new URL("../../../../", import.meta.url);
const read = (file) => fs.readFileSync(new URL(file, root), "utf8");
const compile = (file) => ts.transpileModule(read(file), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
}).outputText;
function load(file, imports = {}) {
  const output = {};
  new Function("exports", "require", compile(file))(output, (name) => {
    assert.ok(name in imports, `Missing ${name} for ${file}`);
    return imports[name];
  });
  return output;
}
const traces = load("lib/visualizations/traces.ts");
const witnesses = load("lib/visualizations/lis-witness.ts", { "./traces": traces });
const lessonData = load("lib/visualizations/lessons.ts");
const css = { default: new Proxy({}, { get: (_, key) => key }) };
const hashes = Object.fromEntries([
  "lib/visualizations/lis-witness.ts",
  "components/visualizations/LisExperience.tsx",
  "components/visualizations/LisExperience.module.css",
  "app/learn/[slug]/page.tsx",
].map((file) => [file, crypto.createHash("sha256").update(read(file)).digest("hex")]));
console.log("Source hashes", hashes);

// Independent O(n^2) dynamic programming. An endpoint with optimal length k
// can also end shorter subsequences, so it contributes to all lengths <= k.
function oracle(values, nondecreasing) {
  const lengths = values.map(() => 1), minimumEndings = [];
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nondecreasing ? values[j] <= values[i] : values[j] < values[i]) {
        lengths[i] = Math.max(lengths[i], lengths[j] + 1);
      }
    }
    for (let length = 0; length < lengths[i]; length++) {
      minimumEndings[length] = Math.min(minimumEndings[length] ?? Infinity, values[i]);
    }
  }
  return minimumEndings;
}
let arrayCount = 0, frameCount = 0;
function checkArray(values) {
  Object.freeze(values);
  for (const nondecreasing of [false, true]) {
    const states = witnesses.lisWitnessTrace(values, nondecreasing);
    assert.equal(states.length, values.length + 1);
    assert.deepEqual(states, witnesses.lisWitnessTrace(values, nondecreasing));
    states.forEach((state, processed) => {
      frameCount++;
      assert.equal(state.processed, processed);
      assert.deepEqual(state.tails, oracle(values.slice(0, processed), nondecreasing));
      assert.equal(state.witnessIndices.length, state.tails.length);
      assert.equal(state.tailIndices.length, state.tails.length);
      for (let i = 0; i < state.tails.length; i++) {
        assert.ok(state.tailIndices[i] >= 0 && state.tailIndices[i] < processed);
        assert.equal(values[state.tailIndices[i]], state.tails[i]);
        const index = state.witnessIndices[i];
        assert.ok(Number.isInteger(index) && index >= 0 && index < processed);
        if (i) {
          const previous = state.witnessIndices[i - 1];
          assert.ok(previous < index);
          assert.ok(nondecreasing ? values[previous] <= values[index] : values[previous] < values[index]);
        }
      }
      if (processed) {
        const before = states[processed - 1];
        assert.equal(state.action, state.tails.length === before.tails.length ? "replace" : "append");
        assert.equal(state.previousTail, state.action === "replace" ? before.tails[state.position] : null);
        for (const key of ["tails", "tailIndices", "witnessIndices"]) assert.notEqual(state[key], before[key]);
      }
    });
  }
  arrayCount++;
}
function walk(values, maximum) {
  checkArray(values);
  if (values.length < maximum) for (const value of [-2, 0, 2]) walk([...values, value], maximum);
}
walk([], 8);
let seed = 1234567;
const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed; };
for (let i = 0; i < 10000; i++) checkArray(Array.from({ length: random() % 13 }, () => random() % 1999 - 999));
for (const values of [[-999], [999], Array(12).fill(-999), [-999, 999, -999, 999, -998, 998], [3, 5, 7, 1, 2, 8]]) checkArray(values);
const example = witnesses.lisWitnessTrace([3, 5, 7, 1, 2, 8]);
assert.deepEqual(example[5].tails, [1, 2, 7]);
assert.deepEqual(example[5].witnessIndices, [0, 1, 2]);
assert.deepEqual(example[6].tails, [1, 2, 7, 8]);
assert.deepEqual(example[6].witnessIndices, [0, 1, 2, 5]);
console.log("Algorithm PASS", { arrayCount, frameCount });

// Independent deterministic hook host. It expands actual child SVG components,
// but deliberately does not claim to simulate browser events or CSS layout.
const slots = [];
let cursor = 0;
const jsx = (type, props) => ({ type, props });
const hooks = {
  useState(initial) {
    const index = cursor++;
    if (!(index in slots)) slots[index] = initial;
    return [slots[index], (value) => { slots[index] = typeof value === "function" ? value(slots[index]) : value; }];
  },
  useId() { const index = cursor++; if (!(index in slots)) slots[index] = `review-${index}`; return slots[index]; },
};
const lisImports = {
  "@/lib/visualizations/traces": traces,
  "@/lib/visualizations/lis-witness": witnesses,
  "./LisExperience.module.css": css,
};
const uiModule = load("components/visualizations/LisExperience.tsx", {
  ...lisImports, react: hooks,
  "react/jsx-runtime": { jsx, jsxs: jsx, Fragment: "fragment" },
  "next/link": { default: (props) => jsx("a", props) },
});
const expand = (node) => Array.isArray(node) ? node.map(expand) : !node || typeof node !== "object" ? node : typeof node.type === "function" ? expand(node.type(node.props)) : { ...node, props: { ...node.props, children: expand(node.props?.children) } };
const elements = (node) => Array.isArray(node) ? node.flatMap(elements) : node && typeof node === "object" ? [node, ...elements(node.props?.children)] : [];
const text = (node) => Array.isArray(node) ? node.map(text).join("") : node && typeof node === "object" ? text(node.props?.children) : node == null || typeof node === "boolean" ? "" : String(node);
const render = () => { cursor = 0; return elements(expand(uiModule.LisExperience({}))); };
const find = (type, predicate = () => true) => { const node = render().find((item) => item.type === type && predicate(item)); assert.ok(node, `Missing ${type}`); return node; };
const button = (label) => find("button", (node) => text(node) === label);
const click = (label) => { const node = button(label); if (!node.props.disabled) node.props.onClick(); };
const change = (node, value) => node.props.onChange({ target: { value } });
const slider = () => find("input", (node) => node.props.type === "range");
const go = (step) => change(slider(), String(step));
const end = () => go(slider().props.max);
const step = () => slider().props.value;
const status = () => text(find("p", (node) => node.props.role === "status"));
const select = (index, value) => change(render().filter((node) => node.type === "select")[index], value);
const input = () => find("input", (node) => node.props.maxLength === 100);
const apply = (value) => { change(input(), value); find("form").props.onSubmit({ preventDefault() {} }); };
const error = () => text(find("p", (node) => node.props.role === "alert"));
const summary = () => text(find("p", (node) => node.props.className === "witnessSummary"));
assert.equal(step(), 6);
assert.equal(button("下一步").props.disabled, true);
assert.match(status(), /长度变为 4/);
assert.match(summary(), /\[3, 5, 7, 8\].*\[0, 1, 2, 5\]/);
click("上一步");
assert.equal(step(), 5);
assert.match(status(), /读到 2.*替换 5.*长度仍是 3/);
assert.match(summary(), /\[3, 5, 7\].*\[0, 1, 2\]/);
assert.equal(render().filter((node) => node.type === "rect").length, 3);
click("重置");
assert.equal(step(), 0);
assert.equal(button("上一步").props.disabled, true);
assert.match(status(), /还未读取/);
assert.equal(render().filter((node) => node.type === "polyline").length, 0);
assert.equal(render().filter((node) => node.type === "circle" && node.props.className === "currentRing").length, 0);
assert.equal(render().filter((node) => node.type === "rect").length, 0);
select(0, "1"); end();
assert.match(status(), /长度仍是 1/);
assert.match(summary(), /\[2\].*\[2\]/);
select(1, "true"); assert.equal(step(), 0); end();
assert.match(status(), /长度变为 3/);
assert.match(summary(), /\[2, 2, 2\].*\[0, 1, 2\]/);
assert.match(text(find("pre")), /upper_bound/);
select(1, "false"); assert.equal(step(), 0);
assert.match(text(find("pre")), /lower_bound/);
select(0, "0"); end();
const snapshot = status();
for (const value of ["", " ", "1,,2", "1.2 3", "1e2", "1000", "-1000", Array(13).fill(1).join(" "), "NaN"]) {
  apply(value); assert.ok(error(), value); assert.equal(status(), snapshot); assert.equal(step(), 6); assert.equal(input().props["aria-invalid"], true);
}
for (const value of ["-999", "999", "0", Array(12).fill(-999).join(","), "-999 -998 -997 -1 0 1 10 99 100 999"]) {
  apply(value); assert.equal(error(), ""); assert.equal(step(), 0); end();
  assert.equal(render().filter((node) => node.type === "select")[0].props.value, "");
  for (const node of render().filter((item) => ["rect", "circle", "line", "text"].includes(item.type))) {
    for (const key of ["x", "y", "x1", "x2", "y1", "y2", "cx", "cy", "width", "height"]) {
      if (key in node.props) assert.ok(Number.isFinite(Number(node.props[key])), `${value} ${node.type} ${key}`);
    }
  }
}
select(0, "2"); assert.equal(step(), 0); assert.equal(error(), ""); end();
assert.match(status(), /长度仍是 1/);
const svgs = render().filter((node) => node.type === "svg");
assert.equal(svgs.length, 2);
const references = svgs.flatMap((node) => node.props["aria-labelledby"].split(" "));
assert.equal(new Set(references).size, 4);
for (const id of references) assert.ok(render().some((node) => node.props.id === id));
for (const node of render().filter((item) => item.props.role === "region")) assert.equal(node.props.tabIndex, 0);
console.log("Deterministic UI PASS: states, controls, invalid-input preservation, extremes, accessible references");

// Render the actual new route branch with real React SSR, not JSX source matching.
// Page metadata helpers and unrelated components are stubbed; repository publication
// tests separately cover metadata, sitemap, structured data, and redirect config.
const common = {
  react: React, "react/jsx-runtime": jsxRuntime,
  "next/link": { default: (props) => React.createElement("a", props) },
};
const lis = load("components/visualizations/LisExperience.tsx", { ...common, ...lisImports });
const reading = load("components/visualizations/LessonReading.tsx", {
  ...common, "@/lib/visualizations/lessons": lessonData,
  "@/lib/site": { siteConfig: { author: "Review author" } }, "./LessonReading.module.css": css,
});
const page = load("app/learn/[slug]/page.tsx", {
  ...common,
  "@/components/visualizations/BinarySearchExperience": { BinarySearchExperience: () => null },
  "@/components/visualizations/LisExperience": lis,
  "next/navigation": { notFound() { throw new Error("not-found"); } },
  "@/components/terminal/TerminalPanel": { TerminalPanel: () => null },
  "@/components/visualizations/AlgorithmLesson": { AlgorithmLesson: () => null },
  "@/lib/visualizations/lessons": lessonData,
  "@/components/visualizations/LessonReading": reading,
  "@/lib/visualizations/lesson-publication": { lessonStructuredData: (slug) => ({ slug }) },
  "@/lib/metadata": { absoluteUrl: (path) => `https://test.example${path}`, createPageMetadata: (options) => options },
});
const slug = "longest-increasing-subsequence";
const html = renderToStaticMarkup(await page.default({ params: Promise.resolve({ slug }) }));
const lesson = lessonData.lessons[slug];
for (const value of [lesson.shortAnswer, lesson.conditions, lesson.invariant, lesson.complexity, lesson.answer, ...lesson.steps, ...lesson.mistakes]) {
  const escaped = renderToStaticMarkup(React.createElement("span", null, value)).slice(6, -7);
  assert.ok(html.includes(escaped), value);
}
for (const value of [`href="/blog/${slug}"`, `href="/learn/${slug}/index.md"`, "<noscript>", 'aria-label="最小结尾分布"', 'data-witness-indices="0,1,2,5"']) assert.ok(html.includes(value), value);
assert.equal((html.match(/<h1/g) ?? []).length, 1);
assert.equal(page.dynamicParams, false);
assert.ok(page.generateStaticParams().some((params) => params.slug === slug));
assert.equal((await page.generateMetadata({ params: Promise.resolve({ slug }) })).path, `/learn/${slug}`);
await assert.rejects(page.default({ params: Promise.resolve({ slug: "invalid" }) }), /not-found/);
assert.match(html, /<title[^>]*>原数组与一条真实的最长递增子序列<\/title>/, "SVG input title must survive real SSR as a nonempty string");
console.log("Real SSR PASS: full static companion, route links, one h1, witness, metadata path, nonempty accessible title");
