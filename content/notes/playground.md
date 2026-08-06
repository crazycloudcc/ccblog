---
title: Playground
excerpt: Compile and run C/C++ in the browser - what /playground does and how to use it.
date: 2026-08-06
coverLabel: playground
tags:
  - meta
  - playground
  - wasm
lang: en
---

`/playground` is a C/C++ environment that runs entirely in your browser. Write code on the left, hit **run**, and a real compiler builds it to WebAssembly and executes it - no server, no install, no container behind the request. The toolchain is a WASM build of clang + lld + a WASI sysroot, fetched once and cached.

This post is the tour: what the page does, the controls, and a few runs from hello world to a compile error.

## How it runs

Every click of **run** drives the same pipeline inside a Web Worker:

:::steps{title="run pipeline"}
```cpp
// 1. fetch WASM toolchain (cached after first load)
// 2. clang compiles source to an object
// 3. lld links the object to a wasm module
// 4. WebAssembly.instantiate + WASI runs _start
```
1. fetch toolchain
2. compile source
3. link module
4. execute main
:::

Because it runs off the main thread, the editor stays responsive while clang works. Execution is hard-capped at **5 seconds** - infinite loops and blocking reads are killed, not hung.

## The toolbar

| Control | What it does |
|---------|--------------|
| **C / C++** | Switch language. C uses `clang -std=c11`, C++ uses `clang++ -std=c++17`, both with `-Wall -O0` |
| `file: main.cpp` | The filename the compiler sees (read-only) |
| `example` | Load a reference snippet - hello, a+b, sort, and for C++ also regex/json. It fills the editor; it does not lock editing |
| **run** | Compile + link + execute. Shortcut: `Cmd/Ctrl + Enter` |
| **clear** | Reset the editor to an empty skeleton for the current language |
| **share** | Copy a compressed link that restores this code and stdin |
| `toolchain: ready` | Live status of the WASM toolchain - `loading` until the first fetch finishes |

Drafts are saved to your browser as you type, per language - reload the page and your code is still there.

## 1. Hello, World

The simplest run. Type it, or pick `hello.cpp` from the example dropdown:

:::annotate{title="hello.cpp"}
```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World\n";
    return 0;
}
```
- line 1: pull in iostream for std::cout
- line 3: program entry point
- line 4: write to stdout
- line 5: exit successfully
:::

Hit **run** (or `Cmd/Ctrl + Enter`). The output panel shows the compile pipeline and the program's stdout:

:::trace{title="hello.cpp run"}
toolchain: 420ms
compile: 180ms
link: 60ms
run: 8ms
stdout: |
  Hello, World
:::

The first run is slower - that is the one-time toolchain fetch shown as the `toolchain` bar. Subsequent runs skip the fetch and drop to tens of milliseconds.

## 2. Reading input

Below the editor is a small **stdin** panel. It only matters when your program reads input - leave it empty for hello world. Pick `a+b.cpp` and type two numbers into stdin:

:::annotate{title="a+b.cpp"}
```cpp
#include <iostream>

int main() {
    int a, b;
    if (!(std::cin >> a >> b)) {
        return 1;
    }
    std::cout << a + b << "\n";
    return 0;
}
```
- line 4: read two ints from stdin
- line 5: bail out cleanly on bad input
- line 7: write the sum to stdout
:::

With `3 4` in the stdin box, the run prints `7`. If you forget to fill stdin and the program blocks, execution times out after 5 seconds and the panel hints that the program may be waiting for input.

## 3. Reading the output

The right panel has three parts:

- A **phase timeline** - toolchain, compile, link, run - with per-phase timings.
- **Diagnostics** (only on compile error) - one row per error, clickable to jump the cursor to the line and column.
- **stdout / stderr** - the echoed compile command, compiler messages, program output, a `$ done in Xms` total, and an `[exit N]` marker.

The status chip on the right tells you how it ended:

| Status | Meaning |
|--------|---------|
| `exit 0` | Compiled, linked, ran, returned 0 |
| `compile error` | clang or lld failed - see diagnostics |
| `runtime error` | Ran but threw (e.g. bad memory access) |
| `timeout` | Hit the 5-second cap |

## 4. When it goes wrong

Drop the semicolon and run it:

:::cases{title="Missing semicolon"}
### good
```cpp
int main() {
    std::cout << "ok\n";
    return 0;
}
```
### bad
```cpp
int main() {
    std::cout << "ok\n"
    return 0;
}
```
:::

The output panel switches to diagnostics: `main.cpp:4 - expected ';'`. Click the row and the cursor lands on line 4 - no scanning, no line counting. Runtime failures print to stderr and end with a non-zero exit instead.

## 5. Share and embed

**share** compresses your source (and stdin, if any) with gzip and base64url, then copies a link like:

```
https://crazycloud.cc/playground?lang=cpp&z=H4sIA...&in=...
```

Opening it restores the code, the stdin, and the language. A shared link can be marked read-only (`readonly=1`) so recipients can run it but not edit it, or embedded compactly with `embed=1`.

You can also drop a runnable snippet straight into a note with the `:::playground` directive - it renders as a button that opens the code in `/playground`:

:::playground{title="hello.cpp" lang="cpp" readonly="true"}
```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World\n";
    return 0;
}
```
:::

See **Content Blocks** for the full set of `:::` directives.

## Under the hood

The toolchain loads from different places depending on environment:

| Environment | Source |
|-------------|--------|
| **Development** | `/api/toolchain` -> `node_modules/browsercc`, falling back to a GitHub release |
| **Production** | [unpkg](https://unpkg.com/browsercc@0.1.1/dist/) CDN (default) |
| **Self-hosted** | Set `NEXT_PUBLIC_TOOLCHAIN_BASE` to your own CDN |

Production never bundles the WASM files into the deploy - the browser fetches them directly from unpkg with CORS enabled. See **Start Up** section 8 for the deployment details.

## Quick reference

- **Run**: click **run**, or `Cmd/Ctrl + Enter`
- **Languages**: C (`clang -std=c11`), C++ (`clang++ -std=c++17`), both `-Wall -O0`
- **Timeout**: 5 seconds, then killed
- **Drafts**: auto-saved per language in your browser
- **Share**: gzip-compressed link, copied to clipboard, max 7500 chars
- **Embed in a post**: `:::playground{title="..." lang="cpp" readonly="true"}` ... `:::`

Checklist for a first session:

- [ ] Open `/playground` and wait for `toolchain: ready`
- [ ] Run `hello.cpp` - expect `Hello, World` and `[exit 0]`
- [ ] Load `a+b.cpp`, type `3 4` in stdin, run - expect `7`
- [ ] Break a line on purpose, click the diagnostic - cursor jumps to it
- [ ] Hit **share** and open the copied link in a new tab
