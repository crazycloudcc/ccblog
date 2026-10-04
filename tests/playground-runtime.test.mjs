import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, {
  alias: { "@": fileURLToPath(new URL("..", import.meta.url)) },
});
const { compileSource, runModule } = await jiti.import("../lib/playground/compile-run.ts");
const { templates } = await jiti.import("../lib/playground/templates.ts");
const { WASI } = await jiti.import("@bjorn3/browser_wasi_shim");

const { buildPlaygroundShareUrl, decodeSharePayload } = await jiti.import("../lib/playground/share.ts");

let additionModule;
let outputModule;
let scanfModule;
let quicksortModule;
const sortingModules = {};

before(async () => {
  // Use the locked browsercc toolchain and the real WASI shim, without a CDN.
  const toolchainBase = fileURLToPath(new URL("../node_modules/browsercc/dist", import.meta.url));
  const sysroot = await readFile(`${toolchainBase}/sysroot.tar`);
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    assert.equal(url, `${toolchainBase}/sysroot.tar`);
    return new Response(sysroot);
  };

  async function compile(language, source) {
    const result = await compileSource(toolchainBase, language, source);
    assert.ok(result.module, result.compileOutput);
    return result.module;
  }

  try {
    for (const language of ["c", "cpp"]) {
      sortingModules[language] = await compile(language, templates[language].find(({ label }) => label === `sort.${language}`).source);
    }
    additionModule = await compile("cpp", templates.cpp.find(({ label }) => label === "a+b.cpp").source);
    outputModule = await compile("c", `#include <stdio.h>
int main(void) {
    int code = 0;
    scanf("%d", &code);
    fputs("before exit\\n", stdout);
    fflush(stdout);
    fputs("program diagnostic\\n", stderr);
    fflush(stderr);
    if (code < 0) __builtin_trap();
    return code;
}`);
    const article = await readFile(new URL("../content/notes/scanf-stdin.md", import.meta.url), "utf8");
    const source = article.match(/```cpp\n([\s\S]*?)\n```/)[1];
    scanfModule = await compile("cpp", source);
    const quicksortArticle = await readFile(new URL("../content/notes/quicksort.md", import.meta.url), "utf8");
    const quicksortSource = quicksortArticle.match(/:::playground[^\n]*\n```cpp\n([\s\S]*?)\n```/)?.[1];
    assert.ok(quicksortSource, "quicksort article has one runnable example");
    quicksortModule = await compile("cpp", quicksortSource);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("built-in a+b.cpp exits 1 for empty stdin", async () => {
  assert.deepEqual(await runModule(additionModule, ""), {
    status: "nonzero_exit",
    stdout: "",
    stderr: "",
    exitCode: 1,
  });
});

test("built-in a+b.cpp prints 42 and exits 0 for stdin 20 22", async () => {
  assert.deepEqual(await runModule(additionModule, "20 22"), {
    status: "success",
    stdout: "42\n",
    stderr: "",
    exitCode: 0,
  });
});

test("successful WASI exit preserves both output streams", async () => {
  assert.deepEqual(await runModule(outputModule, "0"), {
    status: "success",
    stdout: "before exit\n",
    stderr: "program diagnostic\n",
    exitCode: 0,
  });
});

test("nonzero WASI exits retain their exact codes and both output streams", async () => {
  for (const exitCode of [1, 7, 42]) {
    assert.deepEqual(await runModule(outputModule, String(exitCode)), {
      status: "nonzero_exit",
      stdout: "before exit\n",
      stderr: "program diagnostic\n",
      exitCode,
    });
  }
});

test("a WASM trap retains prior output and has no process exit code", async () => {
  const result = await runModule(outputModule, "-1");
  assert.equal(result.status, "runtime_error");
  assert.equal(result.stdout, "before exit\n");
  assert.match(result.stderr, /^program diagnostic\n.*unreachable/);
  assert.equal(result.exitCode, undefined);
});

test("a WASI start function that returns normally exits 0", async () => {
  // (module (memory (export "memory") 1) (func (export "_start")))
  const wasmModule = new WebAssembly.Module(Uint8Array.from([
    0, 97, 115, 109, 1, 0, 0, 0,
    1, 4, 1, 96, 0, 0,
    3, 2, 1, 0,
    5, 3, 1, 0, 1,
    7, 19, 2, 6, 109, 101, 109, 111, 114, 121, 2, 0, 6, 95, 115, 116, 97, 114, 116, 0, 0,
    10, 4, 1, 2, 0, 11,
  ]));
  assert.deepEqual(await runModule(wasmModule, ""), {
    status: "success",
    stdout: "",
    stderr: "",
    exitCode: 0,
  });
});

test("non-Error exceptions from the shim retain their diagnostic", async (t) => {
  t.mock.method(WASI.prototype, "start", () => { throw "raised signal 2"; });
  const result = await runModule(additionModule, "");
  assert.equal(result.status, "runtime_error");
  assert.equal(result.stderr, "raised signal 2");
  assert.equal(result.exitCode, undefined);
});

test("instantiation failures return runtime errors without a process exit code", async () => {
  // (module (import "env" "missing" (func)))
  const wasmModule = new WebAssembly.Module(Uint8Array.from([
    0, 97, 115, 109, 1, 0, 0, 0,
    1, 4, 1, 96, 0, 0,
    2, 15, 1, 3, 101, 110, 118, 7, 109, 105, 115, 115, 105, 110, 103, 0, 0,
  ]));
  const result = await runModule(wasmModule, "");
  assert.equal(result.status, "runtime_error");
  assert.equal(result.stdout, "");
  assert.match(result.stderr, /env/);
  assert.equal(result.exitCode, undefined);
});

test("the scanf article example reports EOF, valid input, and invalid input accurately", async () => {
  for (const [stdin, stdout, exitCode] of [
    ["", "scanf=-1 value=0\n", 1],
    ["42\n", "scanf=1 value=42\n", 0],
    ["abc\n", "scanf=0 value=0\n", 1],
  ]) {
    assert.deepEqual(await runModule(scanfModule, stdin), {
      status: exitCode === 0 ? "success" : "nonzero_exit",
      stdout,
      stderr: "",
      exitCode,
    });
  }
});

for (const language of ["c", "cpp"]) {
  test(`sort.${language} sorts its unchanged sample and supports zero elements`, async () => {
    const template = templates[language].find(({ label }) => label === `sort.${language}`);
    for (const [stdin, stdout] of [[template.sampleStdin, "1 2 3 4 5 \n"], ["0\n", "\n"], ["10000\n" + "1 ".repeat(10000), "1 ".repeat(10000) + "\n"], ["4\n-2 8 -2 0\n", "-2 -2 0 8 \n"], ["3\n2147483647 -2147483648 +0\n", "-2147483648 0 2147483647 \n"]]) {
      assert.deepEqual(await runModule(sortingModules[language], stdin), {
        status: "success", stdout, stderr: "", exitCode: 0,
      });
    }
  });
  test(`sort.${language} rejects missing, invalid, negative, and oversized counts`, async () => {
    for (const stdin of ["", "hello\n", "-1\n", "10001\n", "2147483647\n", "4294967296\n", "-4294967296\n", "4294967297\n9\n", "0oops\n", "999999999999999999999999999999999999999999999999999999999999999999999999999\n"]) {
      assert.deepEqual(await runModule(sortingModules[language], stdin), {
        status: "nonzero_exit", stdout: "", stderr: "Expected a count from 0 to 10000.\n", exitCode: 1,
      });
    }
  });
  test(`sort.${language} rejects truncated and invalid element input without invented output`, async () => {
    for (const stdin of ["3\n9\n", "3\n9 nope 2\n", "3\n9 4294967296 2\n", "3\n9 2 7oops\n", "3\n9 2147483648 2\n"]) {
      assert.deepEqual(await runModule(sortingModules[language], stdin), {
        status: "nonzero_exit", stdout: "", stderr: "Expected 3 integers after the count.\n", exitCode: 1,
      });
    }
  });
}


test("quicksort article sorts valid input, including the maximum recursive case", async () => {
  for (const [stdin, stdout] of [
    ["5\n3 1 4 1 5", "1 1 3 4 5\n"],
    ["5\n1 2 3 4 5", "1 2 3 4 5\n"],
    ["6\n6 5 4 3 2 1", "1 2 3 4 5 6\n"],
    ["4\n2 2 2 2", "2 2 2 2\n"],
    ["1\n-7", "-7\n"],
    ["3\n2147483647 -2147483648 +0", "-2147483648 0 2147483647\n"],
    ["2\n9 -2 100", "-2 9\n"],
    ["1000\n" + "1 ".repeat(1000), Array(1000).fill(1).join(" ") + "\n"],
  ]) {
    assert.deepEqual(await runModule(quicksortModule, stdin), {
      status: "success", stdout, stderr: "", exitCode: 0,
    });
  }
});

test("quicksort article rejects invalid counts before allocating the vector", async () => {
  for (const stdin of ["", "hello", "0", "-1", "1001", "2147483647", "4294967296", "3oops"]) {
    assert.deepEqual(await runModule(quicksortModule, stdin), {
      status: "nonzero_exit", stdout: "", stderr: "Expected a count from 1 to 1000.\n", exitCode: 1,
    });
  }
});

test("quicksort article rejects missing or malformed integers without fabricating zeroes", async () => {
  for (const stdin of ["3\n9", "3\n9 nope 2", "3\n9 2 7oops", "3\n9 2147483648 2", "3\n9 -2147483649 2", "3\n9 1.5 2"]) {
    assert.deepEqual(await runModule(quicksortModule, stdin), {
      status: "nonzero_exit", stdout: "", stderr: "Expected 3 integers after the count.\n", exitCode: 1,
    });
  }
});

test("sharing leading-BOM stdin preserves actual scanf failure rather than succeeding", async () => {
  for (const stdin of ["\uFEFF20 22\n", "\uFEFF", "20 22\n"]) {
    const source = templates.cpp.find(({ label }) => label === "a+b.cpp").source;
    const url = new URL(await buildPlaygroundShareUrl({ lang: "cpp", source, stdin }, "https://preview.example"));
    const decoded = await decodeSharePayload(url.searchParams);
    assert.ok(decoded);
    const before = await runModule(additionModule, stdin);
    const after = await runModule(additionModule, decoded.stdin ?? "");
    assert.deepEqual(after, before, `runtime parity for ${JSON.stringify(stdin)}`);
    assert.equal(after.exitCode, stdin.startsWith("\uFEFF") ? 1 : 0);
    assert.equal(decoded.stdin, stdin);
  }
});
