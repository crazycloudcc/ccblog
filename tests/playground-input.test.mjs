import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, {
  jsx: { runtime: "automatic" },
  alias: { "@": fileURLToPath(new URL("..", import.meta.url)) },
});
const { templates, findTemplate } = await jiti.import("../lib/playground/templates.ts");
const { StdinInput } = await jiti.import("../components/playground/StdinPanel.tsx");
const sum = templates.cpp.find((item) => item.label === "a+b.cpp");
const sort = templates.cpp.find((item) => item.label === "sort.cpp");

function elements(node) {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!node || typeof node !== "object") return [];
  return [node, ...elements(node.props?.children)];
}
function harness(initial = {}) {
  const state = { template: sum, stdin: "", readonly: false, pendingReplacement: null, ...initial };
  let changes = 0;
  const render = () => StdinInput({ ...state,
    onChange: (stdin) => { state.stdin = stdin; changes++; },
    onPendingReplacementChange: (pending) => { state.pendingReplacement = pending; },
  });
  return { state, render, changes: () => changes,
    click: (label) => {
      const button = elements(render()).find((node) => node.type === "button" && node.props.children === label);
      assert.ok(button, `button ${label}`);
      button.props.onClick();
    },
    type: (value) => elements(render()).find((node) => node.type === "textarea").props.onChange({ target: { value } }),
    html: () => renderToStaticMarkup(render()),
  };
}

test("all six input examples include sample data and an accurate format hint; hello needs none", () => {
  const examples = Object.values(templates).flat();
  assert.equal(examples.length, 8);
  assert.equal(examples.filter((item) => item.sampleStdin !== undefined).length, 6);
  for (const item of examples) {
    if (item.label.startsWith("hello")) {
      assert.equal(item.sampleStdin, undefined);
      assert.equal(item.inputHint, undefined);
    } else {
      assert.ok(item.sampleStdin.endsWith("\n"), item.label);
      assert.ok(item.inputHint.length > 5, item.label);
    }
    if (item.label.startsWith("sort")) {
      const [count, ...values] = item.sampleStdin.trim().split(/\s+/).map(Number);
      assert.equal(values.length, count);
    }
    if (item.label.startsWith("a+b")) assert.deepEqual(item.sampleStdin.trim().split(/\s+/), ["3", "4"]);
    if (item.label === "json.cpp") assert.equal(JSON.parse(item.sampleStdin).name, "Ada");
  }
});

test("matching uses exact source and language, including after editing, clearing, and switching languages", () => {
  for (const language of ["c", "cpp"]) {
    for (const item of templates[language]) {
      assert.equal(findTemplate(language, item.source), item);
      assert.equal(findTemplate(language, item.source + "\n"), undefined);
      assert.equal(findTemplate(language === "c" ? "cpp" : "c", item.source), undefined);
    }
    assert.equal(findTemplate(language, ""), undefined);
    assert.equal(findTemplate(language, "int main() { return 0; }"), undefined);
  }
});

test("empty stdin loads only on explicit click, and repeating it is a no-op", () => {
  const h = harness();
  h.render();
  assert.equal(h.state.stdin, "");
  h.click("载入示例输入");
  assert.equal(h.state.stdin, sum.sampleStdin);
  h.click("载入示例输入");
  assert.equal(h.changes(), 1);
  assert.equal(h.state.pendingReplacement, null);
});

test("existing stdin is preserved on selection, repeated requests, and cancel; replace is explicit", () => {
  const h = harness({ stdin: "3 4", template: sort });
  assert.equal(h.state.stdin, "3 4");
  h.click("载入示例输入");
  h.click("载入示例输入");
  assert.equal(h.state.stdin, "3 4");
  assert.match(h.html(), /替换现有 stdin？/);
  h.click("取消");
  assert.equal(h.state.stdin, "3 4");
  assert.doesNotMatch(h.html(), /替换现有 stdin？/);
  h.click("载入示例输入");
  h.click("替换");
  assert.equal(h.state.stdin, sort.sampleStdin);
  assert.equal(h.state.pendingReplacement, null);
  h.click("载入示例输入");
  assert.equal(h.changes(), 1);
});

test("whitespace input is protected and editing cancels pending replacement", () => {
  const h = harness({ stdin: " " });
  h.click("载入示例输入");
  assert.equal(h.state.stdin, " ");
  h.type("my own input");
  assert.equal(h.state.pendingReplacement, null);
  assert.equal(h.state.stdin, "my own input");
  assert.doesNotMatch(h.html(), /替换现有 stdin？/);
});

test("read-only inputs cannot change through load or typing, including with an old confirmation", () => {
  const h = harness({ stdin: "existing", readonly: true, pendingReplacement: "existing" });
  assert.match(h.html(), /disabled=""/);
  assert.match(h.html(), /readOnly=""/i);
  assert.doesNotMatch(h.html(), /替换现有 stdin？/);
  h.click("载入示例输入");
  h.type("changed");
  assert.equal(h.state.stdin, "existing");
  assert.equal(h.changes(), 0);
});

test("hello and custom source get no input-required hint or sample action", () => {
  for (const template of [templates.cpp[0], undefined]) {
    const html = harness({ template }).html();
    assert.doesNotMatch(html, /\.cpp 需要输入|载入示例输入|playground-input-hint/);
    assert.match(html, /程序需要输入时，在运行前填入/);
  }
});

test("page keeps example selection separate from stdin and remounts confirmation for changed context", () => {
  const page = readFileSync(new URL("../components/playground/PlaygroundPage.tsx", import.meta.url), "utf8");
  assert.match(page, /onExampleChange=\{setSource\}/);
  assert.match(page, /findTemplate\(language, source\)/);
  assert.ok(page.includes('key={`${language}:${currentTemplate?.label ?? "custom"}:${readonly}`}'));
});


test("confirmation is announced and cancel/replace restore focus to the persistent load button", () => {
  let focused = 0;
  const h = harness({ stdin: "existing", sampleButtonRef: { current: { focus: () => focused++ } } });
  h.click("载入示例输入");
  assert.match(h.html(), /aria-live="polite"/);
  h.click("取消");
  assert.equal(focused, 1);
  h.click("载入示例输入");
  h.click("替换");
  assert.equal(focused, 2);
});


test("short and embedded layouts keep editor inside its row and let stdin/output grow", () => {
  const editor = readFileSync(new URL("../components/playground/CodeEditor.tsx", import.meta.url), "utf8");
  const page = readFileSync(new URL("../components/playground/PlaygroundPage.tsx", import.meta.url), "utf8");
  assert.match(editor, /flex h-full min-h-0 flex-col overflow-hidden/);
  assert.doesNotMatch(editor, /min-h-\[420px\]/);
  assert.ok(page.includes('isEmbed ? "h-[min(280px,45vh)]" : "h-[min(560px,70vh)]"'));
  assert.ok(page.includes('isEmbed ? "min-h-[min(220px,35vh)]" : "min-h-[min(560px,70vh)]"'));
  assert.match(page, /<div className="min-h-\[220px\] flex-1">\s*<OutputPanel/);
});
