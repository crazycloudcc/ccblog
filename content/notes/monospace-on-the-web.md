---
title: playground.cc
excerpt: A browser-based C/C++ playground — write code, pass stdin, run, and share a link.
date: 2014-04-14
coverLabel: runtime
tags:
  - playground
  - c
  - cpp
  - web
---

[playground.cc](/playground) is a small in-browser compiler for **C** and **C++**. Edit code on the left, optional stdin on the right, hit **Run** — clang compiles to WASM and executes locally in a Web Worker. No server round-trip for your source.

## Open it

From the home session or nav:

```bash
cd ./playground.cc
```

Or go directly to [/playground](/playground).

On first load the page fetches the WASM toolchain (clang, lld, sysroot). A progress bar appears; once it reaches 100%, you are ready to run.

## Layout

| Area | Purpose |
|------|---------|
| **Editor** | Monaco editor — full C/C++ syntax highlighting |
| **stdin** | Optional input for `scanf`, `cin`, `getline`, etc. |
| **Output** | Compile log, stdout, stderr, exit status, duration |

Drafts and stdin are saved in **localStorage** — reload the page and your last code is still there.

## Example 1 — Hello, World

Select **C++** and pick `hello.cpp` from the examples dropdown (or paste):

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World\n";
    return 0;
}
```

Leave **stdin** empty. Click **Run** (or `Cmd/Ctrl + Enter`).

Expected stdout:

```text
Hello, World
```

The C version (`hello.c`) works the same with `printf`.

## Example 2 — Read two integers

Programs that read input need values in the **stdin** panel.

Code (`a+b.cpp`):

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

stdin:

```text
3 7
```

Expected stdout:

```text
10
```

## Example 3 — Sort a list

The `sort.cpp` example reads a count, then that many integers, and prints them sorted.

stdin:

```text
5
42 8 15 3 99
```

Expected stdout:

```text
3 8 15 42 99
```

More built-in examples: `regex.cpp` (extract numbers from a line), `json.cpp` (pull a `"name"` field from a JSON string). Switch language with the **C / C++** toggle — each mode has its own draft.

## Share a snippet

Click **Share** to copy a URL with your code and stdin compressed into the query string (`?lang=cpp&z=...`). Open the link on another device and the editor restores the same state.

## Limits worth knowing

- **5 second** execution timeout — long loops are cut off
- **C11** and **C++17**, `-Wall -O0`
- Compile errors jump the editor to the reported line
- Toolchain files are cached by the browser after the first load

## When to use it

- Try a short algorithm without opening a local project
- Share a reproducible snippet in a note or chat
- Sanity-check C/C++ syntax before pasting into a larger codebase

Open [/playground](/playground) and run something — that is the whole workflow.
