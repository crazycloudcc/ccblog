import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const compile = (path) => ts.transpileModule(read(path), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
}).outputText;
const traces = {};
new Function("exports", compile("../lib/visualizations/traces.ts"))(traces);
const witness = {};
new Function("exports", "require", compile("../lib/visualizations/lis-witness.ts"))(witness, (id) => { assert.equal(id, "./traces"); return traces; });

function* arrays(alphabet, maxLength, prefix = []) {
  yield prefix;
  if (prefix.length < maxLength) for (const value of alphabet) yield* arrays(alphabet, maxLength, [...prefix, value]);
}

// Independent subset enumeration: no binary search, greedy rule, or predecessor
// logic from the implementation is used to establish each minimum ending.
function bruteForce(values, nondecreasing) {
  const tails = [];
  for (let mask = 1; mask < 2 ** values.length; mask++) {
    const sequence = values.filter((_, i) => mask & (1 << i));
    if (!sequence.every((value, i) => !i || (nondecreasing ? value >= sequence[i - 1] : value > sequence[i - 1]))) continue;
    const slot = sequence.length - 1;
    tails[slot] = Math.min(tails[slot] ?? Infinity, sequence.at(-1));
  }
  return tails;
}

function verify(values, nondecreasing) {
  const before = [...values];
  Object.freeze(values);
  const states = witness.lisWitnessTrace(values, nondecreasing);
  assert.equal(states.length, values.length + 1);
  for (const [step, state] of states.entries()) {
    const expected = bruteForce(values.slice(0, step), nondecreasing);
    assert.deepEqual(state.tails, expected, `tails for ${values}, step ${step}, nondecreasing ${nondecreasing}`);
    assert.equal(state.processed, step);
    assert.equal(state.witnessIndices.length, expected.length);
    assert.equal(state.tailIndices.length, expected.length);
    for (const [i, index] of state.witnessIndices.entries()) {
      assert.ok(index >= 0 && index < step);
      if (i) {
        const previous = state.witnessIndices[i - 1];
        assert.ok(previous < index, "witness must retain original input order");
        assert.ok(nondecreasing ? values[previous] <= values[index] : values[previous] < values[index]);
      }
    }
    for (const [slot, index] of state.tailIndices.entries()) {
      assert.ok(index >= 0 && index < step);
      assert.equal(values[index], state.tails[slot]);
    }
    if (!step) {
      assert.equal(state.action, "initial"); assert.equal(state.previousTail, null);
    } else {
      const previous = states[step - 1];
      const appended = state.tails.length > previous.tails.length;
      assert.equal(state.action, appended ? "append" : "replace");
      assert.equal(state.value, values[step - 1]);
      assert.equal(state.previousTail, appended ? null : previous.tails[state.position]);
    }
  }
  assert.deepEqual(values, before);
  return states;
}

test("every prefix's real witness and minimum endings agree with exhaustive subsets in both modes", () => {
  for (const values of arrays([-1, 0, 1], 6)) {
    for (const nondecreasing of [false, true]) verify(values, nondecreasing);
  }
});

test("six-item counterexample has correct fifth-step replacement and sixth-step append", () => {
  const states = verify([3, 5, 7, 1, 2, 8], false);
  assert.deepEqual(states[5].tails, [1, 2, 7]);
  assert.equal(states[5].previousTail, 5);
  assert.equal(states[5].action, "replace");
  assert.deepEqual(states[5].witnessIndices, [0, 1, 2]);
  assert.deepEqual(states[6].tails, [1, 2, 7, 8]);
  assert.equal(states[6].action, "append");
  assert.deepEqual(states[6].witnessIndices, [0, 1, 2, 5]);
  assert.deepEqual(states[6].tailIndices, [3, 4, 2, 5]);
  assert.match(states[5].message, /长度仍是 3/);
  assert.match(states[6].message, /长度变为 4/);
});

test("empty, singleton, decreasing, duplicates, extremes and 12 values have independent snapshots", () => {
  for (const values of [[], [0], [-999], [999], [8, 6, 4, 2, 1], [2, 2, 2], [-999, 999, -999, 999], [-999, -8, 3, -6, 5, 0, 999, 2, 4, 4, 8, 999]]) {
    for (const nondecreasing of [false, true]) verify(values, nondecreasing);
  }
  const states = witness.lisWitnessTrace([1, 2, 3]);
  const earlier = JSON.stringify(states.slice(0, -1));
  states.at(-1).tails[0] = 99; states.at(-1).witnessIndices[0] = 99; states.at(-1).tailIndices[0] = 99;
  assert.equal(JSON.stringify(states.slice(0, -1)), earlier);
});

const elements = (node) => Array.isArray(node) ? node.flatMap(elements) : node && typeof node === "object" ? [node, ...elements(node.props?.children)] : [];
const text = (node) => Array.isArray(node) ? node.map(text).join("") : node && typeof node === "object" ? text(node.props?.children) : node == null || typeof node === "boolean" ? "" : String(node);

function setup() {
  const slots = []; let cursor = 0, tree;
  const jsx = (type, props) => ({ type, props });
  const imports = {
    react: {
      useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = initial; return [slots[i], (next) => { slots[i] = typeof next === "function" ? next(slots[i]) : next; }]; },
      useId() { const i = cursor++; if (!(i in slots)) slots[i] = `lis-test-${i}`; return slots[i]; },
    },
    "react/jsx-runtime": { jsx, jsxs: jsx, Fragment: "fragment" },
    "next/link": { default: ({ children, ...props }) => jsx("a", { ...props, children }) },
    "@/lib/visualizations/traces": traces,
    "@/lib/visualizations/lis-witness": witness,
    "./LisExperience.module.css": { default: new Proxy({}, { get: (_, key) => key }) },
  };
  const exports = {};
  new Function("exports", "require", compile("../components/visualizations/LisExperience.tsx"))(exports, (id) => { assert.ok(id in imports, id); return imports[id]; });
  const expand = (node) => Array.isArray(node) ? node.map(expand) : !node || typeof node !== "object" ? node : typeof node.type === "function" ? expand(node.type(node.props)) : { ...node, props: { ...node.props, children: expand(node.props?.children) } };
  const render = () => { cursor = 0; tree = expand(exports.LisExperience({ children: jsx("section", { children: "Server-rendered lesson" }) })); return elements(tree); };
  const find = (type, predicate = () => true) => { const node = elements(tree).find((item) => item.type === type && predicate(item)); assert.ok(node, `missing ${type}`); return node; };
  const button = (label) => find("button", (node) => text(node) === label);
  const click = (label) => { const node = button(label); if (!node.props.disabled) node.props.onClick(); render(); };
  const change = (node, value) => { node.props.onChange({ target: { value: String(value) } }); render(); };
  const select = (index, value) => change(elements(tree).filter((node) => node.type === "select")[index], value);
  const range = () => find("input", (node) => node.props.type === "range");
  const status = () => text(find("p", (node) => node.props.role === "status"));
  const alert = () => text(find("p", (node) => node.props.role === "alert"));
  const diagram = () => find("section", (node) => node.props["aria-label"] === "真实子序列图");
  const tails = () => find("section", (node) => node.props["aria-label"] === "最小结尾分布");
  const highlight = () => text(find("span", (node) => node.props["aria-current"] === "step"));
  const apply = (value) => { change(find("input", (node) => node.props.maxLength === 100), value); find("form").props.onSubmit({ preventDefault() {} }); render(); };
  const end = () => { for (let i = 0; i < 13 && !button("下一步").props.disabled; i++) click("下一步"); assert.equal(button("下一步").props.disabled, true); };
  render();
  return { render, find, button, click, change, select, range, status, alert, diagram, tails, highlight, apply, end };
}

test("initial final preview, reset, stepping, scrubbing and code show a synchronized correct trace", () => {
  const ui = setup();
  assert.equal(ui.range().props.value, 6);
  assert.match(text(ui.diagram()), /真实路径 \[3, 5, 7, 8\]/);
  assert.match(text(ui.tails()), /tails = \[1, 2, 7, 8\]/);
  assert.match(ui.highlight(), /tails.push_back\(x\)/);
  assert.equal(ui.find("polyline").props["data-witness-indices"], "0,1,2,5");
  for (let i = 0; i < 5; i++) ui.click("下一步");
  assert.equal(ui.range().props.value, 6);
  ui.click("上一步");
  assert.match(ui.status(), /已读 5 \/ 6.*用 2 替换 5.*长度仍是 3/);
  assert.match(text(ui.tails()), /tails = \[1, 2, 7\]/);
  assert.match(ui.highlight(), /else \*it = x/);
  const fifth = ui.status();
  for (let i = 0; i < 5; i++) { ui.click("下一步"); ui.click("上一步"); assert.equal(ui.status(), fifth); }
  ui.click("重置"); assert.equal(ui.range().props.value, 0);
  assert.match(ui.status(), /还未读取/); assert.match(ui.highlight(), /vector<int>/);
  for (let i = 0; i < 5; i++) ui.click("上一步");
  assert.equal(ui.range().props.value, 0);
  ui.change(ui.range(), 5); assert.equal(ui.status(), fifth);
  assert.match(ui.range().props["aria-valuetext"], /已读 5 个，共 6 个/);
});

test("presets and strict/nondecreasing switch reset the whole state including code and witness", () => {
  const ui = setup(); ui.select(0, 1);
  assert.equal(ui.range().props.value, 0); ui.end();
  assert.match(ui.status(), /长度仍是 1/);
  assert.match(text(ui.diagram()), /真实路径 \[2\]/);
  ui.select(1, true); assert.equal(ui.range().props.value, 0); ui.end();
  assert.match(ui.status(), /长度变为 3/);
  assert.match(text(ui.diagram()), /真实路径 \[2, 2, 2\]/);
  assert.match(text(ui.find("code")), /upper_bound/);
  ui.select(1, false); assert.equal(ui.range().props.value, 0);
  assert.match(text(ui.find("code")), /lower_bound/);
  ui.select(0, 2); ui.end(); assert.match(ui.status(), /长度仍是 1/);
  ui.select(0, 0); ui.end(); assert.match(ui.status(), /长度变为 4/);
});

test("invalid input preserves applied diagrams and progress; valid bounded data resets safely", () => {
  const ui = setup(); const state = [ui.status(), text(ui.diagram()), text(ui.tails()), ui.highlight()];
  for (const raw of ["", "1,,2", "1.5 2", "1000", "-1000", "1e2", "0x10", Array(13).fill(1).join(" ")]) {
    ui.apply(raw); assert.notEqual(ui.alert(), "", raw);
    assert.equal(ui.range().props.value, 6);
    assert.deepEqual([ui.status(), text(ui.diagram()), text(ui.tails()), ui.highlight()], state);
  }
  for (const raw of ["-999", "999", "0", "-3,-3,-3", "-999 -8 3 -6 5 0 999 2 4 4 8 999"]) {
    ui.apply(raw); assert.equal(ui.alert(), ""); assert.equal(ui.range().props.value, 0);
    const values = traces.parseValues(raw).values;
    ui.end(); assert.equal(ui.range().props.value, values.length);
    const expected = bruteForce(values, false);
    assert.match(text(ui.tails()), new RegExp(`tails = \\[${expected.join(", ")}\\]`));
  }
  ui.apply("bad"); ui.select(0, 0); assert.equal(ui.alert(), "");
});

test("accessible plots expose real provenance, no fake tails path, and finite negative/zero geometry", () => {
  const ui = setup();
  for (const raw of ["-999", "0", "999", "-3, 2", "-999, 0, 999", Array(12).fill(0).join(" ")]) {
    ui.apply(raw); ui.end();
    const nodes = ui.render(), svgs = nodes.filter((node) => node.type === "svg");
    assert.equal(svgs.length, 2);
    const refs = svgs.flatMap((svg) => svg.props["aria-labelledby"].split(" "));
    assert.equal(new Set(refs).size, 4);
    for (const svg of svgs) {
      assert.equal(svg.props.role, "img");
      for (const ref of svg.props["aria-labelledby"].split(" ")) assert.ok(elements(svg).some((node) => node.props.id === ref));
      for (const node of elements(svg)) for (const key of ["x", "y", "x1", "x2", "y1", "y2", "cx", "cy", "height", "width"]) {
        if (node.props[key] !== undefined) assert.ok(Number.isFinite(Number(node.props[key])), `${node.type}.${key}`);
      }
    }
    assert.equal(elements(ui.tails()).filter((node) => node.type === "polyline").length, 0);
    assert.equal(elements(ui.tails()).filter((node) => node.type === "line" && node.props.className === "zeroLine").length, 1);
    for (const name of ["原数组图，可左右滚动", "tails 柱图，可左右滚动", "C++ 代码，可左右滚动"]) {
      const region = nodes.find((node) => node.props?.["aria-label"] === name);
      assert.equal(region.props.tabIndex, 0); assert.equal(region.props.role, "region");
    }
  }
});

test("actual React server rendering preserves nonempty SVG titles and the full initial lesson", () => {
  const imports = {
    react: React,
    "react/jsx-runtime": jsxRuntime,
    "next/link": { default: ({ children, ...props }) => React.createElement("a", props, children) },
    "@/lib/visualizations/traces": traces,
    "@/lib/visualizations/lis-witness": witness,
    "./LisExperience.module.css": { default: new Proxy({}, { get: (_, key) => key }) },
  };
  const exports = {};
  new Function("exports", "require", compile("../components/visualizations/LisExperience.tsx"))(exports, (id) => { assert.ok(id in imports, id); return imports[id]; });
  const html = renderToStaticMarkup(React.createElement(exports.LisExperience, {}, React.createElement("section", {}, "Static reading preserved")));
  const titles = [...html.matchAll(/<title[^>]*>([^<]+)<\/title>/g)];
  assert.equal(titles.length, 2);
  assert.match(titles[0][1], /原数组与一条真实的最长递增子序列/);
  assert.match(titles[1][1], /每种长度的最小结尾/);
  assert.match(html, /data-witness-indices="0,1,2,5"/);
  assert.match(html, /Static reading preserved/);
  assert.match(html, /<noscript>/);
});

test("controls precede the stage and all eight C++ lines are separate blocks without duplicate newlines", () => {
  const ui = setup();
  const nodes = ui.render();
  const controls = nodes.findIndex((node) => node.props?.["aria-label"] === "单步控制");
  const graph = nodes.findIndex((node) => node.props?.["aria-label"] === "真实子序列图");
  assert.ok(controls >= 0 && controls < graph);
  const code = ui.find("code");
  assert.equal(code.props.children.length, 8);
  assert.ok(code.props.children.every((line) => !text(line).includes("\n")));
  assert.equal(code.props.children.filter((line) => line.props["aria-current"] === "step").length, 1);
  assert.match(text(ui.diagram()), /已读、未入路径/);
  const css = read("../components/visualizations/LisExperience.module.css");
  assert.match(css, /\.codeLine, \.activeCode\s*\{[^}]*display: block/);
  assert.match(css, /\.controls\s*\{[^}]*position: sticky; top: 0/);
  assert.doesNotMatch(css, /margin-top: auto/);
});

test("only the exact LIS and Pythagorean routes skip the duplicate terminal command, preserving children and other routes", () => {
  let pathname = "/learn/longest-increasing-subsequence";
  const jsx = (type, props) => ({ type, props });
  const imports = {
    "react/jsx-runtime": { jsx, jsxs: jsx, Fragment: "fragment" },
    "next/navigation": { usePathname: () => pathname },
    react: { useRef: (value) => ({ current: value }), useEffect() {} },
    "@/components/home/usePrefersReducedMotion": { usePrefersReducedMotion: () => false },
    "@/components/terminal/TerminalCommand": { TerminalCommand: "TerminalCommand" },
    "@/lib/observability/client-metrics": { recordMetric() {} },
    "@/lib/terminal-paths": { getPageCdCommand: (path) => path === "/" ? null : `cd .${path}` },
  };
  const exports = {};
  new Function("exports", "require", compile("../components/terminal/TerminalPageEntry.tsx"))(exports, (id) => { assert.ok(id in imports, id); return imports[id]; });
  const child = jsx("article", { children: "LIS lesson" });
  const render = () => exports.TerminalPageEntry({ children: child });
  const lis = render();
  assert.equal(lis.props.children, child);
  assert.equal(elements(lis).filter((node) => node.type === "TerminalCommand").length, 0);
  pathname = "/learn/pythagorean-theorem";
  assert.equal(elements(render()).filter((node) => node.type === "TerminalCommand").length, 0);
  assert.equal(render().props.children, child);
  for (const path of ["/learn", "/learn/pythagorean-theorem/extra", "/blog/pythagorean-theorem", "/blog/longest-increasing-subsequence", "/learn/longest-increasing-subsequence/extra", "/learn/binary-search", "/about"]) {
    pathname = path;
    const nodes = elements(render());
    assert.equal(nodes.filter((node) => node.type === "TerminalCommand").length, 1, path);
    assert.ok(nodes.includes(child), path);
  }
  pathname = "/"; assert.equal(render().props.children, child);
  pathname = "/learn/longest-increasing-subsequence"; assert.equal(render().props.children, child);
});

test("LIS route retains server reading and shell, with reduced-motion and narrow-screen layout", () => {
  assert.match(read("../app/learn/[slug]/page.tsx"), /slug === "longest-increasing-subsequence".*<LisExperience><LessonReading slug=\{slug\}/);
  const source = read("../components/visualizations/LisExperience.tsx");
  assert.match(source, /<noscript>/); assert.match(source, /\{children\}/);
  assert.match(source, /href="\/blog\/longest-increasing-subsequence"/);
  assert.doesNotMatch(source, /setInterval|requestAnimationFrame|fetch\(|<iframe|<script/);
  assert.match(read("../components/terminal/TerminalShell.tsx"), /pathname === "\/learn\/binary-search"/);
  const css = read("../components/visualizations/LisExperience.module.css");
  assert.match(css, /prefers-reduced-motion: reduce/); assert.match(css, /max-width: 440px/); assert.match(css, /overflow-x: auto/);
  assert.match(css, /\.unreadPoint\s*\{[^}]*stroke: var\(--theme-slate\)/);
  assert.match(css, /\.hollowKey\s*\{[^}]*border: 1px solid var\(--theme-slate\)/);
});

test("prediction guidance stays beside controls through reset, replacement, append and rule changes", () => {
  const ui = setup();
  const guidance = () => {
    const controls = ui.find("div", (node) => node.props["aria-label"] === "单步控制");
    assert.equal(controls.props.role, "group");
    const hint = ui.find("p", (node) => node.props.id === controls.props["aria-describedby"]);
    assert.match(text(hint), /先预测，再验证.*先点重置.*待读值.*替换 tails 的哪一项.*追加到末尾.*下一步.*长度不变或增加 1/);
    assert.equal(hint.props.hidden, undefined);
  };
  guidance(); ui.click("重置"); guidance();
  for (let i = 0; i < 3; i++) ui.click("下一步");
  assert.match(ui.status(), /长度变为 3/);
  ui.click("下一步"); guidance();
  assert.match(ui.status(), /用 1 替换 3.*长度仍是 3/);
  ui.end(); guidance(); assert.match(ui.status(), /长度变为 4/);
  ui.apply("2, 2, 2"); ui.end(); guidance(); assert.match(ui.status(), /长度仍是 1/);
  ui.select(1, true); ui.end(); guidance(); assert.match(ui.status(), /长度变为 3/);
});
