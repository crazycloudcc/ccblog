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
const { CopyButton } = await jiti.import("../components/ui/CopyButton.tsx");

function panel(overrides = {}) {
  return OutputPanel({
    status: "success", stdout: "", stderr: "",
    compileOutput: "", timing: null, metadata: null,
    metrics: { exitCode: 0 }, diagnostics: [],
    ...overrides,
  });
}

function render(overrides) {
  return renderToStaticMarkup(panel(overrides));
}

function elements(node) {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!node || typeof node !== "object") return [];
  // Expand only this ordinary component. CopyButton uses hooks, so inspect its
  // props without calling it (or other function components) outside React.
  if (typeof node.type === "function" && node.type.name === "OutputStream") {
    return [node, ...elements(node.type(node.props))];
  }
  return [node, ...elements(node.props?.children)];
}

function section(tree, label) {
  return elements(tree).find((node) =>
    node.type === "section" && node.props["aria-label"] === `${label} output`);
}

function assertStream(tree, label, text) {
  const stream = section(tree, label);
  assert.ok(stream, `${label} has its own labeled section`);
  const children = elements(stream);
  const contents = children.find((node) =>
    node.type === "pre" && node.props["aria-label"] === `${label} contents`);
  assert.ok(contents, `${label} has raw preformatted contents`);
  assert.equal(contents.props.children, text, `${label} displayed text is exact`);
  const copies = children.filter((node) => node.type === CopyButton);
  assert.equal(copies.length, 1, `${label} has one copy button`);
  assert.equal(copies[0].props.text, text, `${label} copy payload is exact`);
  assert.equal(copies[0].props.label, `copy ${label}`);
  assert.equal(copies[0].props.copiedLabel, `${label} copied`);
}

test("successful output shows exit 0 with stdout", () => {
  const props = { stdout: "42\n" };
  const html = render(props);
  assert.match(html, /output ·.*>exit 0</);
  assert.match(html, /aria-label="stdout output"/);
  assertStream(panel(props), "stdout", "42\n");
  assert.doesNotMatch(html, /\[exit 0\]/);
});

test("nonzero exits show their code separately from raw stdout and stderr", () => {
  for (const exitCode of [1, 7, 42]) {
    const props = {
      status: "nonzero_exit", metrics: { exitCode },
      stdout: "before exit\n", stderr: "program diagnostic\n",
    };
    const html = render(props);
    assert.match(html, new RegExp(`output ·.*>exit ${exitCode}<`));
    assertStream(panel(props), "stdout", props.stdout);
    assertStream(panel(props), "stderr", props.stderr);
    assert.doesNotMatch(html, /runtime error|\[exit /);
  }
});

test("runtime failures retain output and never display a synthetic process exit", () => {
  const props = {
    status: "runtime_error", metrics: {},
    stdout: "before trap\n", stderr: "program diagnostic\nunreachable",
  };
  const html = render(props);
  assert.match(html, /output ·.*>runtime error</);
  assertStream(panel(props), "stdout", props.stdout);
  assertStream(panel(props), "stderr", props.stderr);
  assert.doesNotMatch(html, /\[exit /);
});

test("timeout guidance describes preloaded stdin without claiming blocking reads", () => {
  for (const stderr of ["", "Execution timed out after 5 seconds."]) {
    const props = { status: "timeout", metrics: {}, stderr };
    const html = render(props);
    assert.match(html, /output ·.*>timeout</);
    assert.ok(html.includes("check for infinite loops or input loops that ignore EOF"));
    assert.doesNotMatch(html, /blocking stdin|waiting for stdin|\[exit /);
    if (!stderr) {
      assert.ok(html.includes("stdin is preloaded and ends at EOF"));
      assert.equal(elements(panel(props)).filter((node) => node.type === CopyButton).length, 0);
    } else {
      assertStream(panel(props), "stderr", stderr);
      assert.ok(!html.includes("stdin is preloaded and ends at EOF"));
    }
  }
});

const rawSamples = [
  ["whitespace-only text", " \t \n  \t"],
  ["CRLF line endings", "first\r\nsecond\r\n"],
  ["tabs and trailing spaces", "\tfirst\tsecond  \t\n"],
  ["no trailing newline", "last line"],
  ["leading blank lines", "\n\nfirst visible line\n"],
  ["HTML-like text", "<output>& \"quoted\"\n"],
];

for (const [label, prop] of [["compiler", "compileOutput"], ["stdout", "stdout"], ["stderr", "stderr"]]) {
  for (const [description, raw] of rawSamples) {
    test(`${label} display and copy preserve ${description} exactly`, () => {
      const props = { compileOutput: "compiler only", stdout: "stdout only", stderr: "stderr only", [prop]: raw };
      const tree = panel(props);
      assertStream(tree, "compiler", props.compileOutput);
      assertStream(tree, "stdout", props.stdout);
      assertStream(tree, "stderr", props.stderr);
      assert.equal(elements(tree).filter((node) => node.type === CopyButton).length, 3);
    });
  }
}

test("identical stdout and stderr remain independent streams and copy payloads", () => {
  const raw = "\nshared text\t\r\n";
  for (const status of ["success", "nonzero_exit", "runtime_error", "timeout"]) {
    const tree = panel({ status, stdout: raw, stderr: raw });
    assertStream(tree, "stdout", raw);
    assertStream(tree, "stderr", raw);
    assert.notEqual(section(tree, "stdout"), section(tree, "stderr"));
    assert.equal(elements(tree).filter((node) => node.type === CopyButton).length, 2);
  }
});

test("commands, timing, diagnostics, status, and guidance never contaminate copy payloads", () => {
  const props = {
    status: "timeout", metrics: {},
    compileOutput: "compiler bytes\r\n", stdout: "\nstdout bytes", stderr: "\tstderr bytes\n",
    timing: { compileMs: 13, runMs: 5000, totalMs: 5013 },
    metadata: {
      compilerProgram: "clang++", fileName: "metadata.cpp", flags: ["-O2", "-std=c++20"],
      driverSummary: "driver metadata",
    },
    diagnostics: [{
      file: "metadata.cpp", line: 3, column: 2, message: "diagnostic metadata",
      raw: "diagnostic raw metadata", hints: ["diagnostic hint metadata"],
    }],
  };
  const html = render(props);
  assert.ok(html.includes("$ clang++ metadata.cpp -O2 -std=c++20"));
  assert.ok(html.includes("$ done in 5013ms"));
  assert.ok(html.includes("diagnostic metadata"));
  assert.ok(html.includes("diagnostic hint metadata"));
  assert.ok(html.includes("check for infinite loops or input loops that ignore EOF"));
  const tree = panel(props);
  assertStream(tree, "compiler", props.compileOutput);
  assertStream(tree, "stdout", props.stdout);
  assertStream(tree, "stderr", props.stderr);
  assert.deepEqual(elements(tree).filter((node) => node.type === CopyButton).map((node) => node.props.text), [
    props.compileOutput, props.stdout, props.stderr,
  ]);
});

test("idle instructions and completed empty stdout are distinct and cannot be copied", () => {
  const idle = panel({ status: "idle", metrics: null });
  assert.ok(renderToStaticMarkup(idle).includes("Run your code to see output here."));
  assert.equal(section(idle, "stdout"), undefined);
  assert.equal(elements(idle).filter((node) => node.type === CopyButton).length, 0);

  for (const status of ["success", "nonzero_exit", "runtime_error", "timeout"]) {
    const tree = panel({ status });
    const html = renderToStaticMarkup(tree);
    assert.ok(section(tree, "stdout"));
    assert.ok(html.includes("No stdout output."));
    assert.ok(!html.includes("Run your code to see output here."));
    assert.ok(!html.includes("Waiting for output…"));
    assert.equal(section(tree, "compiler"), undefined);
    assert.equal(section(tree, "stderr"), undefined);
    assert.equal(elements(tree).filter((node) => node.type === CopyButton).length, 0);
  }
});

test("compiling and running show a waiting placeholder before streams arrive", () => {
  for (const status of ["compiling", "running"]) {
    const tree = panel({ status, metrics: null });
    const html = renderToStaticMarkup(tree);
    assert.ok(html.includes("Waiting for output…"));
    assert.ok(!html.includes("Run your code to see output here."));
    assert.ok(!html.includes("No stdout output."));
    assert.equal(section(tree, "stdout"), undefined);
    assert.equal(elements(tree).filter((node) => node.type === CopyButton).length, 0);

    const withOutput = panel({ status, stdout: "\t" });
    assertStream(withOutput, "stdout", "\t");
    assert.ok(!renderToStaticMarkup(withOutput).includes("Waiting for output…"));
  }
});

test("compile errors suppress stderr only when it exactly duplicates compiler output", () => {
  const compileOutput = "\nmain.cpp:3:2: error: example\r\n";
  const duplicate = panel({ status: "compile_error", compileOutput, stderr: compileOutput });
  assertStream(duplicate, "compiler", compileOutput);
  assert.equal(section(duplicate, "stderr"), undefined);
  assert.equal(elements(duplicate).filter((node) => node.type === CopyButton).length, 1);

  for (const stderr of [compileOutput.trim(), `${compileOutput}\n`, compileOutput.replaceAll("\r\n", "\n"), "separate error"]) {
    const tree = panel({ status: "compile_error", compileOutput, stderr });
    assertStream(tree, "compiler", compileOutput);
    assertStream(tree, "stderr", stderr);
    assert.equal(elements(tree).filter((node) => node.type === CopyButton).length, 2);
  }

  const stderrOnly = panel({ status: "compile_error", stderr: "compiler failed" });
  assert.equal(section(stderrOnly, "compiler"), undefined);
  assertStream(stderrOnly, "stderr", "compiler failed");
});

test("matching compiler and stderr text is retained for program results", () => {
  const raw = "matching output\n";
  for (const status of ["success", "nonzero_exit", "runtime_error", "timeout"]) {
    const tree = panel({ status, compileOutput: raw, stderr: raw });
    assertStream(tree, "compiler", raw);
    assertStream(tree, "stderr", raw);
    assert.equal(elements(tree).filter((node) => node.type === CopyButton).length, 2);
  }
});
