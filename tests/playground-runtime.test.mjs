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

let additionModule;
let outputModule;
let scanfModule;

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
