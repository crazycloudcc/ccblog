import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const compile = (path) => ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
}).outputText;
const traces = {};
new Function("exports", compile("../lib/visualizations/traces.ts"))(traces);
const source = compile("../components/visualizations/AlgorithmLesson.tsx");
const elements = (node) => Array.isArray(node) ? node.flatMap(elements) : node && typeof node === "object" ? [node, ...elements(node.props?.children)] : [];
function setup(slug) {
  const state = []; let cursor = 0;
  const jsx = (type, props) => ({ type, props });
  const imports = {
    react: { useState(initial) { const i = cursor++; if (!(i in state)) state[i] = initial; return [state[i], (v) => { state[i] = typeof v === "function" ? v(state[i]) : v; }]; } },
    "react/jsx-runtime": { jsx, jsxs: jsx },
    "@/lib/visualizations/traces": traces,
    "./AlgorithmLesson.module.css": { default: new Proxy({}, { get: (_, key) => key }) },
  };
  const exports = {};
  new Function("exports", "require", source)(exports, (id) => { assert.ok(id in imports, id); return imports[id]; });
  const render = () => { cursor = 0; return elements(exports.AlgorithmLesson({ slug })); };
  const find = (type, predicate = () => true) => render().find((n) => n.type === type && predicate(n));
  const button = (label) => find("button", (n) => n.props.children === label);
  const change = (node, value) => node.props.onChange({ target: { value } });
  const select = (i, value) => change(render().filter((n) => n.type === "select")[i], value);
  const click = (label) => { const b = button(label); if (!b.props.disabled) b.props.onClick(); };
  const end = () => { for (let i = 0; i < 50 && !button("下一步").props.disabled; i++) click("下一步"); assert.equal(button("下一步").props.disabled, true); };
  const status = () => find("p", (n) => n.props.role === "status").props.children;
  const apply = () => find("form").props.onSubmit({ preventDefault() {} });
  return { render, find, button, change, select, click, end, status, apply };
}
test("binary UI completes search, resets on preset/rule, and safely ends broken loops", () => {
  const ui = setup("binary-search"); ui.end(); assert.match(ui.status(), /返回下标 4/);
  ui.select(0, "2"); assert.equal(ui.button("上一步").props.disabled, true);
  ui.select(1, "true"); ui.end(); assert.match(ui.status(), /无限重复.*安全停止/);
  ui.select(1, "false"); ui.end(); assert.match(ui.status(), /返回下标 1/);
  ui.click("回到开头"); assert.equal(ui.button("上一步").props.disabled, true);
  ui.select(0, "1"); ui.end(); assert.match(ui.status(), /返回 -1/);
});
test("invalid input preserves current visualization, valid submit resets and supports negatives", () => {
  const ui = setup("binary-search"); ui.end();
  const array = () => ui.find("input", (n) => n.props.maxLength === 100);
  ui.change(array(), "3 1"); ui.apply(); assert.match(ui.find("p", (n) => n.props.role === "alert").props.children, /有序数组/); assert.match(ui.status(), /返回下标 4/);
  ui.change(array(), "-2 0 2"); ui.change(ui.find("input", (n) => n.props.inputMode === "numeric"), "x"); ui.apply(); assert.match(ui.find("p", (n) => n.props.role === "alert").props.children, /整数/);
  ui.change(ui.find("input", (n) => n.props.inputMode === "numeric"), "-2"); ui.apply(); assert.equal(ui.button("上一步").props.disabled, true); ui.end(); assert.match(ui.status(), /返回下标 0/);
});
test("LIS strict/nondecreasing toggling, slider, and counterexample produce correct states", () => {
  const ui = setup("longest-increasing-subsequence"); ui.end(); assert.match(ui.status(), /长度仍是 1/);
  ui.select(1, "true"); assert.match(ui.status(), /还未读取/); ui.end(); assert.match(ui.status(), /长度变为 3/);
  ui.select(0, "2"); ui.select(1, "false"); ui.end(); assert.match(ui.status(), /长度变为 4/);
  ui.change(ui.find("input", (n) => n.props.type === "range"), "0"); assert.match(ui.status(), /还未读取/);
});
test("visual lessons preserve server text, reciprocal links, metadata and sitemap entries", () => {
  const read = (p) => readFileSync(new URL(p, import.meta.url), "utf8");
  const page = read("../app/blog/[slug]/visual/page.tsx");
  assert.match(page, /<noscript>/); assert.match(page, /lesson.summary/); assert.match(page, /lesson.invariant/); assert.match(page, /<details/); assert.match(page, /generateStaticParams/); assert.match(page, /createPageMetadata/);
  assert.match(page, /href=\{`\/blog\/\$\{slug\}`\}/); assert.match(read("../app/blog/[slug]/page.tsx"), /href=\{`\/blog\/\$\{slug\}\/visual`\}/);
  assert.match(read("../app/sitemap.ts"), /Object.keys\(lessons\)/);
  assert.doesNotMatch(read("../components/visualizations/AlgorithmLesson.tsx"), /setInterval|requestAnimationFrame|fetch\(|<iframe|<script/);
});
