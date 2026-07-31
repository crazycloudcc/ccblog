---
title: Content Blocks
excerpt: "A reference for the custom ::: directives - trace, bench, steps, cases, annotate, and playground."
date: 2026-07-02
coverLabel: blocks
tags:
  - meta
  - markdown
---

Posts are Markdown, plus a few custom directives that render as terminal-style panels. Each starts with `:::name{title="..."}` and ends with `:::`.

## trace

A timeline of labelled steps - good for run or build logs.

:::trace{title="hello.cpp run"}
compile: 420ms
link: 180ms
run: 12ms
stdout: |
  Hello, World
:::

## bench

A small benchmark table.

:::bench{title="clang -O levels"}
| variant | time |
|---------|------|
| O0 | 15ms |
| O2 | 12ms |
| O3 | 11ms |
:::

## steps

An ordered pipeline with an optional code summary.

:::steps{title="Worker pipeline"}
```cpp
// 1. fetch WASM toolchain (cached after first load)
// 2. clang compile to object
// 3. lld link to wasm module
// 4. instantiate + WASI run
```
1. fetch toolchain
2. compile source
3. link module
4. execute main
:::

## cases

Side-by-side good vs bad.

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

## annotate

Code with line-by-line notes.

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

## playground

Embed a runnable C/C++ snippet that opens in `/playground`.

:::playground{title="hello.cpp" lang="cpp" readonly="true"}
```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World\n";
    return 0;
}
```
:::

Mix and match these inside any post under `content/notes/`.
