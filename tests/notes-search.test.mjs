import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

// Execute the unchanged component with deterministic hook/timer and Pagefind
// boundaries. This checks effect cancellation and rendered states, not browser QA.
const source = readFileSync(new URL("../components/blog/NotesSearch.tsx", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
}).outputText;
const tick = () => new Promise((resolve) => setImmediate(resolve));
const elements = (node) => Array.isArray(node) ? node.flatMap(elements)
  : node && typeof node === "object" ? [node, ...elements(node.props?.children)] : [];

async function setup() {
  const state = [], effects = [], requests = [], timers = new Map();
  let cursor = 0, nextTimer = 0, pendingEffects = [], tree;
  const react = {
    useState(initial) {
      const index = cursor++;
      if (!(index in state)) state[index] = initial;
      return [state[index], (value) => { state[index] = typeof value === "function" ? value(state[index]) : value; }];
    },
    useEffect(run, dependencies) {
      const index = cursor++, previous = effects[index];
      if (!previous || dependencies.some((value, i) => !Object.is(value, previous.dependencies[i]))) {
        pendingEffects.push(() => {
          previous?.cleanup?.();
          effects[index] = { dependencies, cleanup: run() };
        });
      }
    },
  };
  const pagefind = {
    options: async () => {}, init: async () => {},
    search(query) { return new Promise((resolve, reject) => requests.push({ query, resolve, reject })); },
  };
  const jsx = (type, props) => ({ type, props });
  const imports = {
    react,
    "react/jsx-runtime": { jsx, jsxs: jsx },
    "next/link": { default: "a" },
    "@/components/terminal/DegradedStatePanel": { DegradedStatePanel: "aside" },
    "@/lib/observability/client-metrics": { recordMetric() {} },
    "@/lib/observability/report": { report() {} },
    "@/lib/site-status": { patchSiteStatus() {} },
    "https://example.invalid/pagefind/pagefind.js": pagefind,
  };
  const window = {
    location: { origin: "https://example.invalid" },
    setTimeout(callback) { const id = ++nextTimer; timers.set(id, callback); return id; },
    clearTimeout(id) { timers.delete(id); },
  };
  const exports = {};
  new Function("require", "exports", "window", compiled)((id) => {
    assert.ok(id in imports, `unexpected import: ${id}`);
    return imports[id];
  }, exports, window);
  function render() {
    cursor = 0;
    tree = exports.NotesSearch();
    const work = pendingEffects; pendingEffects = [];
    work.forEach((run) => run());
    return tree;
  }
  function change(value) {
    elements(render()).find((node) => node.type === "input").props.onChange({ target: { value } });
    render();
  }
  function debounce() {
    const work = [...timers.values()]; timers.clear();
    work.forEach((run) => run()); render();
  }
  async function settle() { await tick(); render(); }
  function text(value) { return elements(render()).some((node) => node.props?.children === value); }
  function links() { return elements(render()).filter((node) => node.type === "a").map((node) => node.props.href); }
  function dispose() { effects.forEach((effect) => effect?.cleanup?.()); }
  render(); await settle();
  return { change, debounce, settle, text, links, requests, dispose };
}
const result = (url) => ({ results: [{ data: async () => ({ url, meta: { title: url }, excerpt: "match" }) }] });

for (const finish of ["resolve", "reject"]) {
  test(`clearing a pending query removes busy state and ignores old ${finish}`, async () => {
    const ui = await setup(); ui.change("clang"); ui.debounce(); await ui.settle();
    assert.equal(ui.requests[0].query, "clang"); assert.ok(ui.text("searching..."));
    ui.change(""); assert.equal(ui.text("searching..."), false);
    ui.requests[0][finish](finish === "resolve" ? result("/old") : Error("old failure"));
    await ui.settle();
    assert.equal(ui.text("searching..."), false); assert.deepEqual(ui.links(), []);
    assert.equal(ui.text("old failure"), false);
    ui.dispose();
  });
}
test("a new query finishes before an old request without old results replacing it", async () => {
  const ui = await setup(); ui.change("clang"); ui.debounce(); await ui.settle();
  ui.change(""); ui.change("stdin"); ui.debounce(); await ui.settle();
  ui.requests[1].resolve(result("/stdin")); await ui.settle();
  assert.deepEqual(ui.links(), ["/stdin"]); assert.equal(ui.text("searching..."), false);
  ui.requests[0].resolve(result("/old")); await ui.settle();
  assert.deepEqual(ui.links(), ["/stdin"]); assert.equal(ui.text("searching..."), false);
  ui.dispose();
});
test("changing a completed query clears its results and error during the new debounce", async () => {
  const ui = await setup(); ui.change("clang"); ui.debounce(); await ui.settle();
  ui.requests[0].resolve(result("/clang")); await ui.settle();
  ui.change("clang"); assert.deepEqual(ui.links(), ["/clang"]);
  ui.change("stdin"); assert.deepEqual(ui.links(), []);
  assert.ok(ui.text("searching...")); assert.equal(ui.text("no matches in notes/"), false);
  ui.debounce(); await ui.settle(); ui.requests[1].reject(Error("search failed")); await ui.settle();
  assert.ok(ui.text("search failed"));
  ui.change("clang"); assert.equal(ui.text("search failed"), false);
  ui.dispose();
});
test("whitespace clears pending search and cancelling the debounce starts no request", async () => {
  const ui = await setup(); ui.change("clang"); ui.change(""); ui.debounce(); await ui.settle();
  assert.equal(ui.requests.length, 0);
  ui.change("clang"); ui.debounce(); await ui.settle(); ui.change("  ");
  ui.requests[0].resolve(result("/old")); await ui.settle();
  assert.equal(ui.text("searching..."), false); assert.deepEqual(ui.links(), []);
  ui.dispose();
});
