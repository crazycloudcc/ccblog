import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const pageSource = readFileSync(new URL("../components/playground/PlaygroundPage.tsx", import.meta.url), "utf8");
const pageCode = ts.transpileModule(pageSource.replaceAll("import.meta.url", JSON.stringify(import.meta.url)), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
}).outputText;

function elements(node) {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!node || typeof node !== "object") return [];
  return [node, ...elements(node.props?.children)];
}

async function harness(payload = null, { deferred = false } = {}) {
  const saved = { c: "// saved C draft", cpp: "// saved C++ draft", stdin: "saved input" };
  const writes = [];
  const stdinWrites = [];
  const decodes = [];
  let unmounted = false;
  let updatesAfterUnmount = 0;
  const slots = [];
  let cursor = 0;
  let pending = [];
  let dirty = false;
  let tree;
  const sameDeps = (a, b) => a && b && a.length === b.length && a.every((value, i) => Object.is(value, b[i]));

  // Execute the real page, batching state updates and running dependency-checked
  // effects after each render. This intentionally omits DOM/StrictMode behavior;
  // compiler, network, and child components are outside this draft regression.
  const hooks = {
    useState(initial) {
      const i = cursor++;
      if (!(i in slots)) {
        slots[i] = {
          value: typeof initial === "function" ? initial() : initial,
          set(value) {
            if (unmounted) updatesAfterUnmount++;
            const next = typeof value === "function" ? value(slots[i].value) : value;
            if (!Object.is(next, slots[i].value)) {
              slots[i].value = next;
              dirty = true;
            }
          },
        };
      }
      return [slots[i].value, slots[i].set];
    },
    useRef(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = { current: initial };
      return slots[i];
    },
    useMemo(fn, deps) {
      const i = cursor++;
      if (!slots[i] || !sameDeps(slots[i].deps, deps)) slots[i] = { deps, value: fn() };
      return slots[i].value;
    },
    useCallback(fn, deps) { return hooks.useMemo(() => fn, deps); },
    useEffect(fn, deps) {
      const i = cursor++;
      if (!slots[i] || !sameDeps(slots[i].deps, deps)) {
        slots[i] = { ...slots[i], deps };
        pending.push(() => {
          slots[i].cleanup?.();
          slots[i].cleanup = fn();
        });
      }
    },
  };
  let searchParams = new URLSearchParams(payload ? { lang: payload.lang, z: "fixture" } : {});
  const jsx = (type, props) => ({ type, props });
  const modules = {
    react: hooks,
    "react/jsx-runtime": { jsx, jsxs: jsx, Fragment: "Fragment" },
    "next/navigation": { useSearchParams: () => searchParams },
    "@/lib/playground/templates": { findTemplate: () => undefined },
    "@/lib/playground/diagnostics": { parseCompileDiagnostics: () => [] },
    "@/lib/playground/languages": {
      getLanguageConfig: (lang) => ({ fileName: lang === "c" ? "main.c" : "main.cpp", monacoLanguage: lang }),
    },
    "@/lib/playground/storage": {
      loadDraft: (lang) => saved[lang],
      saveDraft: (lang, source) => { saved[lang] = source; writes.push([lang, source]); },
      loadStdin: () => saved.stdin,
      saveStdin: (stdin) => { saved.stdin = stdin; stdinWrites.push(stdin); },
    },
    "@/lib/playground/share": {
      hasShareParams: (params) => params.has("lang") && params.has("z"),
      // Preserve the asynchronous decode boundary; the codec has its own tests.
      decodeSharePayload: () => deferred
        ? new Promise((resolve) => decodes.push(resolve))
        : Promise.resolve(payload),
    },
    "@/lib/playground/compile-run": { preloadToolchain: () => new Promise(() => {}) },
    "@/lib/playground/toolchain": { resolveToolchainBase: () => "/toolchain", getToolchainSource: () => "api" },
    "@/lib/observability/client-metrics": { recordMetric() {} },
    "@/lib/observability/report": { report() {} },
    "@/lib/site-status": { patchSiteStatus() {} },
  };
  const context = {
    exports: {}, URL, URLSearchParams, performance, setTimeout, clearTimeout,
    Worker: class { terminate() {} },
    window: { addEventListener() {}, removeEventListener() {} },
    require(name) {
      if (name in modules) return modules[name];
      if (name.startsWith("@/components/")) return new Proxy({}, { get: (_, key) => key });
      throw new Error(`Unexpected import: ${name}`);
    },
  };
  runInNewContext(pageCode, context);
  function flush() {
    let renders = 0;
    do {
      cursor = 0;
      pending = [];
      dirty = false;
      tree = context.exports.PlaygroundPage();
      for (const effect of pending) effect();
      assert.ok(++renders < 20, "page effects should settle");
    } while (dirty);
  }
  const props = (type) => {
    const element = elements(tree).find((node) => node.type === type);
    assert.ok(element, `${type} is rendered`);
    return element.props;
  };
  flush();
  await new Promise(setImmediate);
  flush();
  return {
    saved, writes, stdinWrites, props,
    get updatesAfterUnmount() { return updatesAfterUnmount; },
    async navigate(nextPayload, query = nextPayload ? { lang: nextPayload.lang, z: `fixture-${decodes.length}` } : {}) {
      payload = nextPayload;
      searchParams = new URLSearchParams(query);
      flush();
      await new Promise(setImmediate);
      flush();
    },
    async resolveDecode(index, value) {
      assert.ok(decodes[index], `decode ${index} was requested`);
      decodes[index](value);
      await new Promise(setImmediate);
      if (!unmounted) flush();
    },
    unmount() {
      unmounted = true;
      for (const slot of slots) slot.cleanup?.();
    },
    switchTo(lang) { props("RunToolbar").onLanguageChange(lang); flush(); },
    edit(source) { props("CodeEditor").onChange(source); flush(); },
  };
}

test("C++ share then C restores the C draft instead of persisting C++ code as C", async () => {
  const h = await harness({ lang: "cpp", source: "// shared C++", stdin: "shared input" });
  assert.equal(h.props("CodeEditor").value, "// shared C++");
  assert.equal(h.props("StdinPanel").stdin, "shared input");
  h.switchTo("c");
  assert.equal(h.props("RunToolbar").language, "c");
  assert.equal(h.props("CodeEditor").value, "// saved C draft");
  assert.equal(h.saved.c, "// saved C draft");
  assert.ok(!h.writes.some(([lang, source]) => lang === "c" && source === "// shared C++"));
  h.switchTo("cpp");
  assert.equal(h.props("CodeEditor").value, "// shared C++");
});

test("clicking the already-selected language preserves the current source", async () => {
  const h = await harness({ lang: "cpp", source: "// shared C++" });
  h.edit("// edited shared C++");
  const writeCount = h.writes.length;
  h.switchTo("cpp");
  assert.equal(h.props("CodeEditor").value, "// edited shared C++");
  assert.equal(h.writes.length, writeCount);
});

test("ordinary language switching keeps independent C and C++ drafts", async () => {
  const h = await harness();
  assert.equal(h.props("CodeEditor").value, "// saved C++ draft");
  h.edit("// edited C++ draft");
  h.switchTo("c");
  assert.equal(h.props("CodeEditor").value, "// saved C draft");
  h.edit("// edited C draft");
  h.switchTo("cpp");
  assert.equal(h.props("CodeEditor").value, "// edited C++ draft");
  h.switchTo("c");
  assert.equal(h.props("CodeEditor").value, "// edited C draft");
  assert.equal(h.saved.cpp, "// edited C++ draft");
  assert.equal(h.saved.c, "// edited C draft");
});

test("C share initializes C and restores the correct source in both directions", async () => {
  const h = await harness({ lang: "c", source: "// shared C", stdin: "C input" });
  assert.equal(h.props("RunToolbar").language, "c");
  assert.equal(h.props("CodeEditor").value, "// shared C");
  assert.equal(h.props("StdinPanel").stdin, "C input");
  h.switchTo("cpp");
  assert.equal(h.props("CodeEditor").value, "// saved C++ draft");
  h.switchTo("c");
  assert.equal(h.props("CodeEditor").value, "// shared C");
  assert.equal(h.saved.cpp, "// saved C++ draft");
  assert.equal(h.saved.c, "// shared C");
});

test("readonly shares expose locked controls without overwriting either source draft", async () => {
  for (const lang of ["c", "cpp"]) {
    const h = await harness({ lang, source: "// readonly share", readonly: true });
    assert.equal(h.props("RunToolbar").readonly, true);
    assert.equal(h.props("CodeEditor").readOnly, true);
    assert.equal(h.props("StdinPanel").readonly, true);
    assert.equal(h.props("CodeEditor").value, "// readonly share");
    assert.equal(h.saved.c, "// saved C draft");
    assert.equal(h.saved.cpp, "// saved C++ draft");
    assert.ok(!h.writes.some(([, source]) => source === "// readonly share"));
  }
});


test("readonly shares preserve stored stdin during initial decoding", async () => {
  const h = await harness({ lang: "c", source: "// readonly C", stdin: "shared input", readonly: true });
  assert.equal(h.saved.stdin, "saved input");
  assert.deepEqual(h.stdinWrites, []);
});

test("readonly share to bare editor restores editable C++ draft and saved stdin", async () => {
  const share = { lang: "c", source: "// readonly C", stdin: "shared input", readonly: true, title: "Shared title" };
  const h = await harness(share);
  await h.navigate(null);
  assert.equal(h.props("RunToolbar").language, "cpp");
  assert.equal(h.props("RunToolbar").readonly, false);
  assert.equal(h.props("CodeEditor").readOnly, false);
  assert.equal(h.props("CodeEditor").value, "// saved C++ draft");
  assert.equal(h.props("StdinPanel").stdin, "saved input");
  assert.equal(h.props("TerminalPanel").title, "playground.cc");
  assert.equal(h.saved.c, "// saved C draft");
  assert.equal(h.saved.cpp, "// saved C++ draft");
  assert.equal(h.saved.stdin, "saved input");
  h.edit("// editable again");
  assert.equal(h.saved.cpp, "// editable again");
  // Back/Forward-style query changes can repeat without leaking locked state.
  await h.navigate(share);
  assert.equal(h.props("CodeEditor").readOnly, true);
  await h.navigate(null);
  assert.equal(h.props("CodeEditor").value, "// editable again");
  assert.equal(h.props("CodeEditor").readOnly, false);
});

test("malformed share restores the ordinary editor without persisting readonly content", async () => {
  const h = await harness({ lang: "c", source: "// readonly C", stdin: "shared input", readonly: true, title: "Old title" });
  await h.navigate(null, { lang: "c", z: "malformed" });
  assert.equal(h.props("RunToolbar").language, "cpp");
  assert.equal(h.props("CodeEditor").value, "// saved C++ draft");
  assert.equal(h.props("CodeEditor").readOnly, false);
  assert.equal(h.props("StdinPanel").stdin, "saved input");
  assert.equal(h.props("TerminalPanel").title, "playground.cc");
  assert.ok(!h.writes.some(([, source]) => source === "// readonly C"));
});

test("a slower share cannot replace a newer share or its persisted drafts", async () => {
  const a = { lang: "c", source: "// stale C", stdin: "stale input", readonly: true, title: "Stale" };
  const b = { lang: "cpp", source: "// current C++", stdin: "current input", title: "Current" };
  const h = await harness(a, { deferred: true });
  await h.navigate(b);
  await h.resolveDecode(1, b);
  await h.resolveDecode(0, a);
  assert.equal(h.props("RunToolbar").language, "cpp");
  assert.equal(h.props("CodeEditor").value, b.source);
  assert.equal(h.props("CodeEditor").readOnly, false);
  assert.equal(h.props("StdinPanel").stdin, b.stdin);
  assert.equal(h.props("TerminalPanel").title, "playground.cc · Current");
  assert.equal(h.saved.c, "// saved C draft");
  assert.equal(h.saved.cpp, b.source);
  assert.equal(h.saved.stdin, b.stdin);
});

test("bare navigation cancels a pending share decode", async () => {
  const share = { lang: "c", source: "// stale C", stdin: "stale input", readonly: true };
  const h = await harness(share, { deferred: true });
  await h.navigate(null);
  await h.resolveDecode(0, share);
  assert.equal(h.props("RunToolbar").language, "cpp");
  assert.equal(h.props("CodeEditor").value, "// saved C++ draft");
  assert.equal(h.props("CodeEditor").readOnly, false);
  assert.equal(h.props("StdinPanel").stdin, "saved input");
  assert.equal(h.saved.stdin, "saved input");
});

test("a stale malformed decode cannot reset a newer readonly share", async () => {
  const b = { lang: "c", source: "// current C", stdin: "current input", readonly: true, title: "Current" };
  const h = await harness({ lang: "cpp" }, { deferred: true });
  await h.navigate(b);
  await h.resolveDecode(1, b);
  await h.resolveDecode(0, null);
  assert.equal(h.props("CodeEditor").value, b.source);
  assert.equal(h.props("CodeEditor").readOnly, true);
  assert.equal(h.props("StdinPanel").stdin, b.stdin);
  assert.equal(h.props("TerminalPanel").title, "playground.cc · Current");
  assert.equal(h.saved.stdin, "saved input");
});

test("unmount cancels pending decode without state or storage writes", async () => {
  const share = { lang: "c", source: "// cancelled C", stdin: "cancelled input" };
  const h = await harness(share, { deferred: true });
  const writes = h.writes.length;
  const stdinWrites = h.stdinWrites.length;
  h.unmount();
  await h.resolveDecode(0, share);
  assert.equal(h.updatesAfterUnmount, 0);
  assert.equal(h.writes.length, writes);
  assert.equal(h.stdinWrites.length, stdinWrites);
});
