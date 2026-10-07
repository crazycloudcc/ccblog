import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createJiti } from "jiti";
const jiti = createJiti(import.meta.url, { jsx: { runtime: "automatic" }, alias: { "@": fileURLToPath(new URL("..", import.meta.url)) } });
const { createShareSession } = await jiti.import("../lib/playground/share-recovery.ts");
const { ShareControl } = await jiti.import("../components/playground/ShareControl.tsx");
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
const url = "https://preview.example/playground?lang=cpp&z=valid&in=input";
function setup({ build = async () => url, copy = async () => {} } = {}) {
  const timers = [];
  const cancelled = [];
  const session = createShareSession(build, copy, (cb) => { timers.push(cb); return timers.length; }, (id) => cancelled.push(id));
  return { session, timers, cancelled };
}
test("successful copy clears recovery and expires only its own message", async () => {
  const copied = [];
  const { session, timers } = setup({ copy: async (value) => copied.push(value) });
  assert.equal(await session.share(), true);
  assert.deepEqual(copied, [url]);
  assert.deepEqual(session.getSnapshot(), { busy: false, url: null, message: "link copied" });
  timers[0]();
  assert.equal(session.getSnapshot().message, null);
});
for (const reason of [new Error("clipboard denied"), new TypeError("clipboard missing")]) {
  test(`clipboard failure preserves exact URL: ${reason.message}`, async () => {
    const { session } = setup({ copy: async () => { throw reason; } });
    await session.share();
    assert.equal(session.getSnapshot().url, url);
    assert.equal(session.getSnapshot().busy, false);
    assert.match(session.getSnapshot().message, /Select and copy/);
  });
}
test("retry copies retained URL without repeating compression", async () => {
  let builds = 0, copies = 0;
  const { session } = setup({ build: async () => { builds++; return url; }, copy: async () => { if (++copies < 2) throw Error(); } });
  await session.share(); await session.share();
  assert.equal(builds, 1); assert.equal(copies, 2);
  assert.equal(session.getSnapshot().url, null);
});
test("generation errors expose no raw exception or stale URL and permit retry", async () => {
  let builds = 0;
  const { session } = setup({ build: async () => { if (++builds === 1) throw Error("private code"); return url; } });
  await session.share();
  assert.equal(session.getSnapshot().url, null);
  assert.equal(session.getSnapshot().message, "Could not create a share link. Try again.");
  await session.share();
  assert.equal(session.getSnapshot().message, "link copied");
});
test("old success timeout cannot clear new clipboard failure", async () => {
  let copies = 0;
  const { session, timers, cancelled } = setup({ copy: async () => { if (++copies > 1) throw Error(); } });
  await session.share(); await session.share(); timers[0]();
  assert.deepEqual(cancelled, [1]);
  assert.equal(session.getSnapshot().url, url);
  assert.match(session.getSnapshot().message, /Select and copy/);
});
test("duplicate clicks while building only start one generation", async () => {
  const pending = deferred(); let builds = 0;
  const { session } = setup({ build: () => { builds++; return pending.promise; } });
  const first = session.share(); await session.share();
  assert.equal(builds, 1); pending.resolve(url); await first;
});
for (const finish of ["resolve", "reject"]) {
  test(`dispose prevents obsolete compression ${finish} from copying or notifying`, async () => {
    const pending = deferred(); let copies = 0, notices = 0;
    const { session } = setup({ build: () => pending.promise, copy: async () => { copies++; } });
    session.subscribe(() => notices++);
    const work = session.share(); session.dispose(); const before = notices;
    pending[finish](finish === "resolve" ? url : Error()); await work;
    assert.equal(copies, 0); assert.equal(notices, before);
  });
  test(`close ignores pending clipboard ${finish}`, async () => {
    const pending = deferred();
    const { session } = setup({ copy: () => pending.promise });
    const work = session.share(); await Promise.resolve(); session.close();
    pending[finish](finish === "resolve" ? undefined : Error());
    assert.notEqual(await work, true);
    assert.deepEqual(session.getSnapshot(), { busy: false, url: null, message: null });
  });
}
test("close discards recovery and next share builds afresh", async () => {
  let builds = 0;
  const { session } = setup({ build: async () => { builds++; return url; }, copy: async () => { throw Error(); } });
  await session.share(); session.close(); await session.share(); assert.equal(builds, 2);
});
test("unsubscribe and dispose prevent obsolete timer notifications", async () => {
  const { session, timers, cancelled } = setup(); let notices = 0;
  const unsubscribe = session.subscribe(() => notices++);
  await session.share(); const before = notices; unsubscribe(); session.dispose(); timers[0]();
  assert.equal(notices, before); assert.deepEqual(cancelled, [1]);
});
test("share control starts accessible and is disabled during URL restoration", () => {
  const html = renderToStaticMarkup(ShareControlElement(true));
  assert.match(html, /disabled=""/); assert.match(html, /aria-expanded="false"/); assert.match(html, /role="status"/);
});
function ShareControlElement(disabled) { return createElement(ShareControl, { language: "cpp", source: "", stdin: "", navigationKey: "", disabled }); }
test("UI wiring invalidates all payload and navigation changes, retains labeled selectable input and focus guards", () => {
  const source = readFileSync(new URL("../components/playground/ShareControl.tsx", import.meta.url), "utf8");
  assert.match(source, /\[language, source, stdin, navigationKey\]/);
  assert.match(source, /session\.dispose\(\)/);
  assert.match(source, /navigator\.clipboard\?\.writeText/);
  assert.match(source, /readOnly\s+value=\{state.url\}/);
  assert.match(source, /onFocus=.*currentTarget.select/);
  assert.match(source, /document.activeElement === buttonRef.current/);
  assert.match(source, /copied && restoreFocus/);
  assert.match(source, /session.close\(\); buttonRef.current\?\.focus\(\)/);
});

// Run the actual component with a small hook/DOM model. Browser layout and
// platform clipboard permissions still require the separate preview gate.
async function controlHarness({ clipboard = {}, build = async () => url } = {}) {
  const { runInNewContext } = await import("node:vm");
  const ts = (await import("typescript")).default;
  const source = readFileSync(new URL("../components/playground/ShareControl.tsx", import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const slots = []; let cursor = 0, pending = [], dirty = false, tree;
  let props = { language: "cpp", source: "code", stdin: "input", navigationKey: "", disabled: false };
  const document = { body: {}, activeElement: null }; document.activeElement = document.body;
  const same = (a, b) => a && b && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
  const hooks = {
    useId: () => "share-test",
    useRef(value) { const i = cursor++; return slots[i] ??= { current: value }; },
    useMemo(fn, deps) { const i = cursor++; if (!slots[i] || !same(slots[i].deps, deps)) slots[i] = { value: fn(), deps }; return slots[i].value; },
    useLayoutEffect(fn, deps) { const i = cursor++; if (!slots[i] || !same(slots[i].deps, deps)) { const old = slots[i]; slots[i] = { deps }; pending.push(() => { old?.cleanup?.(); slots[i].cleanup = fn(); }); } },
    useSyncExternalStore(subscribe, snapshot) { const i = cursor++; if (slots[i]?.subscribe !== subscribe) { slots[i]?.cleanup(); slots[i] = { subscribe, cleanup: subscribe(() => { dirty = true; }) }; } return snapshot(); },
  };
  const elements = (node) => Array.isArray(node) ? node.flatMap(elements) : node && typeof node === "object" ? [node, ...elements(node.props?.children)] : [];
  const jsx = (type, props) => ({ type, props });
  const modules = { react: hooks, "react/jsx-runtime": { jsx, jsxs: jsx, Fragment: "Fragment" }, "@/lib/playground/share": { buildPlaygroundShareUrl: build }, "@/lib/playground/share-recovery": { createShareSession: (a, b) => createShareSession(a, b, () => 1, () => {}) } };
  const exports = {};
  runInNewContext(code, { exports, require: (id) => modules[id] ?? {}, navigator: { clipboard }, document });
  const nodes = new Map();
  function render() {
    cursor = 0; dirty = false; tree = exports.ShareControl(props);
    const current = new Set();
    for (const element of elements(tree)) {
      if (!element.props?.ref) continue;
      const ref = element.props.ref; current.add(ref);
      let node = nodes.get(ref);
      if (!node) { node = { isConnected: true, selected: false, focus() { document.activeElement = this; }, select() { this.selected = true; }, contains(target) { return target?.region === this || elements(this.element).some((e) => e.props?.ref?.current === target); } }; nodes.set(ref, node); }
      node.isConnected = true; node.element = element; ref.current = node;
    }
    for (const [ref, node] of nodes) if (!current.has(ref)) { node.isConnected = false; ref.current = null; if (document.activeElement === node || document.activeElement?.region === node) document.activeElement = document.body; }
    const effects = pending; pending = []; effects.forEach((run) => run());
  }
  async function flush() { for (let i = 0; i < 12; i++) { await Promise.resolve(); if (dirty) render(); } }
  render();
  const find = (predicate) => elements(tree).find(predicate);
  return {
    document, flush,
    get input() { return find((n) => n.type === "input"); },
    get button() { return find((n) => n.type === "button" && "aria-expanded" in n.props); },
    async click(label = "share") { const node = label === "share" ? this.button : find((n) => n.type === "button" && n.props.children === label); assert.ok(node); if (node.props.ref) node.props.ref.current.focus(); else document.activeElement = { region: find((n) => n.props?.role === "region")?.props.ref.current }; node.props.onClick(); await flush(); },
    async change(next) { props = { ...props, ...next }; render(); await flush(); },
    unmount() { slots.forEach((slot) => slot?.cleanup?.()); },
  };
}
test("actual missing clipboard opens selected labeled recovery and close returns focus", async () => {
  const h = await controlHarness(); await h.click();
  assert.equal(h.input.props.value, url); assert.equal(h.input.props.readOnly, true);
  assert.equal(h.input.props.ref.current.selected, true);
  assert.equal(h.document.activeElement, h.input.props.ref.current);
  await h.click("close"); assert.equal(h.input, undefined);
  assert.equal(h.document.activeElement, h.button.props.ref.current); h.unmount();
});
test("late failure does not steal focus from editor", async () => {
  const pending = deferred(); const h = await controlHarness({ clipboard: { writeText: () => pending.promise } });
  await h.click(); const editor = {}; h.document.activeElement = editor;
  pending.reject(Error()); await h.flush();
  assert.equal(h.input.props.value, url); assert.equal(h.document.activeElement, editor); h.unmount();
});
for (const [field, value] of [["source", "new code"], ["stdin", "new input"], ["language", "c"], ["navigationKey", "z=new"]]) {
  test(`actual ${field} change discards recovery and obsolete pending results`, async () => {
    const pending = deferred(); let copies = 0;
    const h = await controlHarness({ build: () => pending.promise, clipboard: { writeText: async () => { copies++; } } });
    await h.click(); await h.change({ [field]: value }); pending.resolve(url); await h.flush();
    assert.equal(copies, 0); assert.equal(h.input, undefined); assert.equal(h.button.props.disabled, false); h.unmount();
  });
}
test("actual recovery retry preserves URL and close wins over pending clipboard result", async () => {
  const pending = deferred(); let copies = 0;
  const h = await controlHarness({ clipboard: { writeText: async () => { if (++copies === 1) throw Error(); return pending.promise; } } });
  await h.click(); await h.click("retry copy"); assert.equal(h.input.props.value, url);
  await h.click("close"); pending.reject(Error()); await h.flush();
  assert.equal(h.input, undefined); assert.equal(h.button.props.disabled, false); h.unmount();
});
test("visible recovery disappears immediately when editor changes", async () => {
  const h = await controlHarness(); await h.click(); assert.ok(h.input);
  await h.change({ source: "different code" }); assert.equal(h.input, undefined); h.unmount();
});
test("busy uses aria-disabled without blurring the focused share button", async () => {
  const pending = deferred(); const h = await controlHarness({ build: () => pending.promise });
  await h.click(); assert.equal(h.button.props.disabled, false); assert.equal(h.button.props["aria-disabled"], true);
  assert.equal(h.document.activeElement, h.button.props.ref.current);
  pending.resolve(url); await h.flush(); assert.equal(h.document.activeElement, h.input.props.ref.current); h.unmount();
});
test("retry success returns focus from removed recovery to the share button", async () => {
  let copies = 0;
  const h = await controlHarness({ clipboard: { writeText: async () => { if (++copies === 1) throw Error(); } } });
  await h.click(); await h.click("retry copy"); assert.equal(h.input, undefined);
  assert.equal(h.document.activeElement, h.button.props.ref.current); h.unmount();
});
test("retry success does not reclaim focus after user moves to editor", async () => {
  let copies = 0; const pending = deferred();
  const h = await controlHarness({ clipboard: { writeText: async () => { if (++copies === 1) throw Error(); return pending.promise; } } });
  await h.click(); await h.click("retry copy"); const editor = {}; h.document.activeElement = editor;
  pending.resolve(); await h.flush(); assert.equal(h.input, undefined); assert.equal(h.document.activeElement, editor); h.unmount();
});
test("known URL limit errors explain how to recover without exposing arbitrary exceptions", async () => {
  const message = "Share link is too long. Try shortening your code or stdin.";
  const { session } = setup({ build: async () => { throw new Error(message); } });
  await session.share(); assert.equal(session.getSnapshot().message, message); assert.equal(session.getSnapshot().url, null);
});
