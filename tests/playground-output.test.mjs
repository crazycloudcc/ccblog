import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, {
  jsx: { runtime: "automatic" },
  alias: { "@": fileURLToPath(new URL("..", import.meta.url)) },
});
const { OutputPanel } = await jiti.import("../components/playground/OutputPanel.tsx");

function render(status, exitCode, stdout = "", stderr = "") {
  return renderToStaticMarkup(OutputPanel({
    status, stdout, stderr,
    compileOutput: "", timing: null, metadata: null,
    metrics: { exitCode }, diagnostics: [],
  }));
}

test("successful output shows exit 0 with stdout", () => {
  const html = render("success", 0, "42\n");
  assert.match(html, /stdout \/ stderr ·.*>exit 0</);
  assert.ok(html.includes("42\n[exit 0]"));
});

test("nonzero exits show their code in both the heading and copied output", () => {
  for (const exitCode of [1, 7, 42]) {
    const html = render("nonzero_exit", exitCode, "before exit\n", "program diagnostic\n");
    assert.match(html, new RegExp(`stdout / stderr ·.*>exit ${exitCode}<`));
    assert.ok(html.includes(`before exit\nprogram diagnostic\n[exit ${exitCode}]`));
    assert.ok(!html.includes("runtime error"));
    assert.ok(!html.includes("[exit 0]"));
  }
});

test("runtime failures retain output and never display a synthetic process exit", () => {
  const html = render("runtime_error", undefined, "before trap\n", "program diagnostic\nunreachable");
  assert.match(html, /stdout \/ stderr ·.*>runtime error</);
  assert.ok(html.includes("before trap\nprogram diagnostic\nunreachable"));
  assert.ok(!html.includes("[exit "));
});


test("timeout guidance describes preloaded stdin without claiming blocking reads", () => {
  for (const stderr of ["", "Execution timed out after 5 seconds."]) {
    const html = render("timeout", undefined, "", stderr);
    assert.ok(html.includes("check for infinite loops or input loops that ignore EOF"));
    assert.ok(!html.includes("blocking stdin"));
    assert.ok(!html.includes("waiting for stdin"));
    assert.ok(!html.includes("[exit "));
    if (!stderr) {
      assert.ok(html.includes("stdin is preloaded and ends at EOF"));
    }
  }
});
