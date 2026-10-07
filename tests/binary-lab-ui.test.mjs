import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const compile = (path) => ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
}).outputText;
const traces = {};
new Function("exports", compile("../lib/visualizations/traces.ts"))(traces);
const lessonData = {};
new Function("exports", compile("../lib/visualizations/lessons.ts"))(lessonData);
const source = compile("../components/visualizations/BinarySearchExperience.tsx");
const motionSource = compile("../components/home/usePrefersReducedMotion.ts");
const elements = (node) => Array.isArray(node) ? node.flatMap(elements) : node && typeof node === "object" ? [node, ...elements(node.props?.children)] : [];
const text = (node) => Array.isArray(node) ? node.map(text).join("") : node && typeof node === "object" ? text(node.props?.children) : node == null || typeof node === "boolean" ? "" : String(node);

// A deterministic hook/effect host: effects commit after rendering, dependency changes
// run their previous cleanup, and timer callbacks batch state updates before rendering.
// Execute child components too, so assertions inspect actual SVG and lane semantics.
function setup({ reducedMotion = false } = {}) {
  const slots = [], timers = new Map(), listeners = new Set(), cleared = [];
  let cursor = 0, dirty = false, pending = [], tree, nextTimer = 0;
  const media = {
    matches: reducedMotion,
    addEventListener(event, listener) { assert.equal(event, "change"); listeners.add(listener); },
    removeEventListener(event, listener) { assert.equal(event, "change"); listeners.delete(listener); },
  };
  const window = {
    matchMedia(query) { assert.equal(query, "(prefers-reduced-motion: reduce)"); return media; },
    setTimeout(callback, delay) { const id = ++nextTimer; timers.set(id, { callback, delay }); return id; },
    clearTimeout(id) { cleared.push(id); timers.delete(id); },
  };
  const react = {
    useState(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = { value: typeof initial === "function" ? initial() : initial };
      return [slots[i].value, (next) => {
        const value = typeof next === "function" ? next(slots[i].value) : next;
        if (!Object.is(value, slots[i].value)) { slots[i].value = value; dirty = true; }
      }];
    },
    useEffect(effect, deps) {
      const i = cursor++, previous = slots[i];
      if (!previous || !deps || deps.some((value, j) => !Object.is(value, previous.deps?.[j]))) {
        pending.push(() => { previous?.cleanup?.(); slots[i] = { deps, cleanup: effect() }; });
      }
    },
    useId() { const i = cursor++; if (!(i in slots)) slots[i] = { value: `lab-test-${i}` }; return slots[i].value; },
  };
  const jsx = (type, props) => ({ type, props });
  const motion = {};
  new Function("exports", "require", "window", motionSource)(motion, (id) => { assert.equal(id, "react"); return react; }, window);
  const imports = {
    react,
    "react/jsx-runtime": { jsx, jsxs: jsx, Fragment: "fragment" },
    "next/link": { default: ({ children, ...props }) => jsx("a", { ...props, children }) },
    "@/lib/visualizations/traces": traces,
    "@/lib/visualizations/lessons": lessonData,
    "@/components/home/usePrefersReducedMotion": motion,
    "./BinarySearchExperience.module.css": { default: new Proxy({}, { get: (_, key) => key }) },
  };
  const exports = {};
  new Function("exports", "require", "window", source)(exports, (id) => { assert.ok(id in imports, id); return imports[id]; }, window);
  const expand = (node) => Array.isArray(node) ? node.map(expand) : !node || typeof node !== "object" ? node : typeof node.type === "function" ? expand(node.type(node.props)) : { ...node, props: { ...node.props, children: expand(node.props?.children) } };
  function render() {
    let passes = 0;
    do {
      assert.ok(++passes < 10, "effects must settle");
      cursor = 0; dirty = false; pending = [];
      tree = expand(exports.BinarySearchExperience({}));
      pending.forEach((effect) => effect());
    } while (dirty);
    return elements(tree);
  }
  const find = (type, predicate = () => true) => {
    const node = elements(tree).find((n) => n.type === type && predicate(n));
    assert.ok(node, `missing ${type}`); return node;
  };
  const button = (name) => find("button", (n) => n.props["aria-label"] === name || text(n) === name);
  const click = (name) => { const node = button(name); if (!node.props.disabled) node.props.onClick(); render(); };
  const change = (node, value) => { if (!node.props.disabled) node.props.onChange({ target: { value: String(value), checked: Boolean(value) } }); render(); };
  const range = () => find("input", (n) => n.props.type === "range");
  const step = () => range().props.value;
  const playing = () => find("button", (n) => "aria-pressed" in n.props).props["aria-pressed"];
  const play = () => click(text(find("button", (n) => "aria-pressed" in n.props)));
  const select = (index, value) => change(elements(tree).filter((n) => n.type === "select")[index], value);
  const setDraft = (array, target) => {
    change(find("input", (n) => n.props.maxLength === 60), array);
    change(find("input", (n) => n.props.inputMode === "numeric"), target);
  };
  const apply = () => { find("form").props.onSubmit({ preventDefault() {} }); render(); };
  const tick = () => {
    assert.equal(timers.size, 1, "exactly one playback timer should be scheduled");
    const [id, timer] = timers.entries().next().value;
    timers.delete(id); timer.callback(); render();
  };
  const end = () => { for (let i = 0; i < 30 && !button("下一步").props.disabled; i++) click("下一步"); assert.equal(button("下一步").props.disabled, true); };
  const lane = (broken = false) => find("section", (n) => n.props["aria-label"] === (broken ? "错误更新轨道" : "正确更新轨道"));
  const status = () => text(find("p", (n) => n.props.role === "status"));
  const alert = () => text(find("p", (n) => n.props.role === "alert"));
  render();
  return { render, find, button, click, change, range, step, playing, play, select, setDraft, apply, tick, end, lane, status, alert, timers, cleared,
    setReduced(value) { media.matches = value; listeners.forEach((listener) => listener()); render(); },
    unmount() { slots.forEach((slot) => slot.cleanup?.()); }, listeners };
}

test("playback advances once per timer, stops at last frame, and replays from the beginning", () => {
  const ui = setup();
  assert.equal(ui.timers.size, 0);
  ui.play();
  assert.equal(ui.playing(), true);
  assert.equal(ui.find("p", (n) => n.props.role === "status").props["aria-live"], "off");
  const last = ui.range().props.max;
  for (let expected = 1; expected <= last; expected++) { ui.tick(); assert.equal(ui.step(), expected); }
  assert.equal(ui.playing(), false); assert.equal(ui.timers.size, 0);
  assert.equal(ui.find("p", (n) => n.props.role === "status").props["aria-live"], "polite");
  assert.equal(ui.button("下一步").props.disabled, true);
  ui.click("↻ 重播"); assert.equal(ui.step(), 0); assert.equal(ui.playing(), true); assert.equal(ui.timers.size, 1);
});

test("pause, stepping, scrubbing, reset, and unmount cancel scheduled playback", () => {
  for (const stop of [
    (ui) => ui.play(), (ui) => ui.click("下一步"), (ui) => ui.click("上一步"),
    (ui) => ui.change(ui.range(), 0), (ui) => ui.click("重置"),
  ]) {
    const ui = setup(); ui.click("下一步"); ui.play();
    const timer = [...ui.timers.keys()][0]; stop(ui);
    assert.equal(ui.playing(), false); assert.equal(ui.timers.size, 0); assert.ok(ui.cleared.includes(timer));
  }
  const ui = setup(); ui.play(); ui.unmount();
  assert.equal(ui.timers.size, 0); assert.equal(ui.listeners.size, 0);
});

test("repeated next/back stay within boundaries and restore the same semantic state", () => {
  const ui = setup(), initial = ui.status();
  for (let i = 0; i < 10; i++) ui.click("上一步");
  assert.equal(ui.step(), 0); assert.equal(ui.status(), initial);
  ui.click("下一步"); const second = ui.status();
  for (let i = 0; i < 6; i++) { ui.click("上一步"); assert.equal(ui.status(), initial); ui.click("下一步"); assert.equal(ui.status(), second); }
  ui.end(); const final = ui.status();
  for (let i = 0; i < 10; i++) ui.click("下一步");
  assert.equal(ui.status(), final); assert.equal(ui.step(), ui.range().props.max);
  while (!ui.button("上一步").props.disabled) ui.click("上一步");
  assert.equal(ui.status(), initial);
});

test("speed changes clean up the old timer without advancing or duplicating playback", () => {
  const ui = setup(); ui.play();
  for (const [speed, delay] of [["0.5", 3600], ["1.5", 1200], ["1", 1800]]) {
    const old = [...ui.timers.keys()][0]; ui.select(1, speed);
    assert.equal(ui.step(), 0); assert.equal(ui.playing(), true);
    assert.ok(ui.cleared.includes(old)); assert.equal(ui.timers.has(old), false);
    assert.equal(ui.timers.size, 1); assert.equal([...ui.timers.values()][0].delay, delay);
  }
  ui.tick(); assert.equal(ui.step(), 1);
});

test("changing a scenario or applying custom data while playing resets and cancels playback", () => {
  const ui = setup(); ui.play(); ui.tick();
  ui.select(0, "1");
  assert.equal(ui.step(), 0); assert.equal(ui.playing(), false); assert.equal(ui.timers.size, 0);
  assert.match(text(ui.lane()), /a\[0\] = 1 < 3/);
  ui.play(); ui.setDraft("-9, 0, 9", "9"); ui.apply();
  assert.equal(ui.alert(), ""); assert.equal(ui.step(), 0); assert.equal(ui.playing(), false); assert.equal(ui.timers.size, 0);
  assert.equal(ui.find("select").props.value, "");
  ui.end(); assert.match(text(ui.lane()), /返回下标 2/);
});

test("invalid arrays leave the applied diagrams, target, and progress unchanged", () => {
  const ui = setup(); ui.end();
  const before = ui.status(), diagrams = [text(ui.lane()), text(ui.lane(true))], step = ui.step();
  for (const value of ["", "3 1", "1,,3", "1.5 2", "1000", "-1000", "1 2 3 4 5 6 7 8 9"]) {
    ui.setDraft(value, "0"); ui.apply(); assert.notEqual(ui.alert(), "", value);
    assert.equal(ui.status(), before); assert.equal(ui.step(), step);
    assert.deepEqual([text(ui.lane()), text(ui.lane(true))], diagrams);
  }
  ui.select(0, "0"); assert.equal(ui.alert(), "");
});

test("targets require complete bounded decimal integers; signed and padded targets are accepted", () => {
  const ui = setup(); const initial = ui.status();
  for (const target of ["", " ", "1.5", "1e2", "0x1", "3x", "+", "1000", "-1000", "Infinity", "NaN"]) {
    ui.setDraft("-999 0 999", target); ui.apply();
    assert.match(ui.alert(), /目标必须是 -999 到 999 的整数/); assert.equal(ui.status(), initial);
  }
  for (const [target, index] of [[" -999 ", 0], ["+0", 1], ["+999", 2]]) {
    ui.setDraft("-999 0 999", target); ui.apply(); assert.equal(ui.alert(), "");
    ui.end(); assert.match(text(ui.lane()), new RegExp(`返回下标 ${index}`));
  }
});

test("one and eight item arrays, duplicates, and negative values remain usable", () => {
  const ui = setup();
  for (const [values, target, index] of [["-999", "-999", 0], ["999", "999", 0], ["-999 -9 -3 -3 0 3 9 999", "999", 7], ["-999 -9 -3 -3 0 3 9 999", "-999", 0], ["-3 -3 -3", "-3", 1]]) {
    ui.setDraft(values, target); ui.apply(); assert.equal(ui.alert(), ""); ui.end();
    assert.match(text(ui.lane()), new RegExp(`返回下标 ${index}`));
    assert.equal(elements(ui.lane()).filter((n) => n.type === "svg").length, 1);
  }
  ui.setDraft("-999", "999"); ui.apply(); ui.end();
  assert.match(text(ui.lane()), /返回 -1/); assert.match(text(ui.lane(true)), /无限重复.*安全停止/);
});

test("reduced-motion changes disable and uncheck animation without enabling it through a disabled control", () => {
  const ui = setup({ reducedMotion: true });
  const checkbox = () => ui.find("input", (n) => n.props.type === "checkbox");
  assert.equal(checkbox().props.disabled, true); assert.equal(checkbox().props.checked, false);
  ui.change(checkbox(), true); assert.equal(checkbox().props.checked, false);
  // Check only the functional motion opt-out class, not a styling snapshot.
  assert.match(ui.find("article").props.className, /\bnoMotion\b/);
  ui.setReduced(false); assert.equal(checkbox().props.disabled, false); assert.equal(checkbox().props.checked, true);
  ui.change(checkbox(), false); assert.equal(checkbox().props.checked, false);
  ui.setReduced(true); ui.setReduced(false); assert.equal(checkbox().props.checked, false);
  ui.change(checkbox(), true); assert.equal(checkbox().props.checked, true);
  assert.doesNotMatch(ui.find("article").props.className, /\bnoMotion\b/);
});

test("both lanes expose independent SVG names, simultaneous outcomes, and held terminal results", () => {
  const ui = setup();
  const svgs = ui.render().filter((n) => n.type === "svg"); assert.equal(svgs.length, 2);
  const references = svgs.map((svg) => svg.props["aria-labelledby"].split(" "));
  assert.equal(new Set(references.flat()).size, 4);
  svgs.forEach((svg, i) => {
    assert.equal(svg.props.role, "img");
    assert.equal(svg.props.style.minWidth, Number(svg.props.viewBox.split(" ")[2]));
    const scroller = ui.find("div", (node) => node.props.role === "region" && elements(node).includes(svg));
    assert.equal(scroller.props.tabIndex, 0); assert.match(scroller.props["aria-label"], /可左右滚动/);
    for (const id of references[i]) assert.ok(elements(svg).some((node) => node.props.id === id));
  });
  ui.select(0, "1"); ui.end();
  assert.match(text(ui.lane()), /已找到.*返回下标 1/s);
  assert.match(text(ui.lane(true)), /窗口停滞.*无限重复.*安全停止/s);
  assert.match(ui.status(), /正确轨道：.*返回下标 1.*错误轨道：.*安全停止/s);
  ui.select(0, "0"); ui.end();
  assert.match(text(ui.lane()), /返回下标 6.*本轨道已结束，保持结果/s);
  ui.select(0, "2"); ui.end();
  assert.match(text(ui.lane()), /不存在.*窗口已空.*返回 -1/s);
  assert.match(text(ui.lane(true)), /窗口停滞/);
  ui.select(0, "3"); ui.end(); assert.match(text(ui.lane()), /返回下标 0/);
});

test("only the exact binary lab route bypasses the terminal, with drag hooks isolated to its mounted window", () => {
  const jsx = (type, props) => ({ type, props });
  let pathname = "/learn/binary-search", dragCalls = 0;
  const imports = {
    "react/jsx-runtime": { jsx, jsxs: jsx },
    "next/navigation": { usePathname: () => pathname },
    "@/components/terminal/useWindowDrag": { useWindowDrag() { dragCalls++; return {}; } },
  };
  for (const name of ["TerminalMobileNav", "TerminalPageEntry", "TerminalSidebar", "TerminalStatusBar", "TerminalTitleBar"]) imports[`@/components/terminal/${name}`] = { [name]: name };
  imports["@/components/dev/DevToolsRoot"] = { DevToolsRoot: "DevToolsRoot" };
  const exports = {};
  new Function("exports", "require", compile("../components/terminal/TerminalShell.tsx"))(exports, (id) => { assert.ok(id in imports, id); return imports[id]; });
  const child = jsx("article", { children: "lesson content" });
  const render = () => exports.TerminalShell({ children: child, postCount: 42 });
  const lab = render(); assert.equal(lab.type, "main"); assert.equal(lab.props.children, child); assert.equal(dragCalls, 0);
  let windowType;
  for (const path of ["/", "/blog/binary-search", "/learn/longest-increasing-subsequence", "/learn/binary-search/extra"]) {
    pathname = path; const shell = render();
    assert.equal(typeof shell.type, "function", path);
    windowType ??= shell.type; assert.equal(shell.type, windowType);
    assert.equal(shell.props.children, child); assert.equal(shell.props.postCount, 42);
  }
  // The hook belongs to the child component, so replacing that component with main
  // lets React unmount its effects and remount them on return to a terminal route.
  assert.equal(dragCalls, 0);
  const shell = render(), window = shell.type(shell.props); assert.equal(dragCalls, 1);
  assert.ok(elements(window).some((node) => node.type === "TerminalStatusBar" && node.props.postCount === 42));
  pathname = "/learn/binary-search"; assert.equal(render().type, "main"); assert.equal(dragCalls, 1);
  pathname = "/blog/binary-search"; const returned = render(); assert.equal(returned.type, windowType);
  returned.type(returned.props); assert.equal(dragCalls, 2);
});
