---
title: 浏览器里 clang 报错怎么读
excerpt: 四则用 browsercc 0.1.1 实际编译得到的诊断：缺分号、未定义符号、异常被禁用、找不到头文件。
date: 2026-09-25
updated: 2026-10-06
coverLabel: diag
tags:
  - cpp
  - playground
  - wasm
  - diagnostics
series: "浏览器里的 C++"
seriesSlug: browser-cpp
difficulty: beginner
lang: zh-CN
runtime: browsercc
---

系列入口在 [在浏览器里编译运行 C++](/blog/liulanqi-bianyi-cpp)。下面四则都用浏览器里的同一套编译器编过：browsercc 0.1.1，`clang++`，旗帜是 `-std=c++17 -Wall -O0 -fno-exceptions`，和 `/playground` 的 C++ 配置一致。诊断原文照抄那一次输出。临时目标文件名每次会变，错误类型不会变。

编译失败时还没有可以执行的 wasm。面板状态是 `compile error`，不会出现 5 秒超时。超时是模块已经在跑、进程没有退出。空 stdin 上的一次 `scanf` 不会触发它，见 [scanf 那篇](/blog/scanf-stdin)。

## 缺分号

```cpp
#include <iostream>
int main() {
    std::cout << "hi" << std::endl
    return 0;
}
```

输出：

```text
main.cpp:3:35: error: expected ';' after expression
    3 |     std::cout << "hi" << std::endl
      |                                   ^
      |                                   ;
1 error generated.
```

`3:35` 是第 3 行第 35 列，箭头指在 `std::endl` 后面。clang 认为表达式到这里应该结束。下一行的 `return` 不是这行输出的一部分，所以它不会说「return 写错了」。补上分号再编，这则 error 就消失。

警告不会让 Run 停在 compile error。诊断区收的是带有文件、行、列位置的 `error` 和 `fatal error`；链接器的 undefined symbol 等消息通常只显示在原始 compiler 日志中。

## 未定义符号

```cpp
int missing();
int main() {
    return missing();
}
```

这一则能通过编译。声明告诉 clang `missing` 存在于别处，所以生成了目标文件。链接时 wasm-ld 发现没有任何地方定义它：

```text
wasm-ld: error: /tmp/main-3d5242.o: undefined symbol: missing()
```

`/tmp/main-3d5242.o` 是这一次链接用的临时目标文件，后缀会变。稳定的部分是 `undefined symbol: missing()`。它不是「头文件没找到」，也不是语法错误。要么把 `missing` 的函数体写在同一个程序里，要么不要调用它。这套沙箱没有别的 `.o` 可以再链进来。

## 异常被禁用：先在编译期失败

当前 C++ 旗帜带 `-fno-exceptions`。下面这份最小程序在 2026-10-01 用站点的 browsercc 0.1.1 实测：

```cpp
int main() { throw 1; }
```

诊断是：

```text
main.cpp:1:14: error: cannot use 'throw' with exceptions disabled
```

面板显示 `compile error`，还没进入链接或运行。直接写 `try` 也受异常禁用旗帜限制。读到 `with exceptions disabled` 时，改用返回值或 `std::optional` 表达失败。它与上面的 `undefined symbol: missing()` 属于不同阶段；不能一概说成链接器缺少 `__cxa_*`。这套 WASI 没有可用的 C++ 异常运行时，移除旗帜也不是这里支持的解决方案。

## 找不到头文件

```cpp
#include <not_a_real_header.h>
int main() {
    return 0;
}
```

输出：

```text
main.cpp:1:10: fatal error: 'not_a_real_header.h' file not found
    1 | #include <not_a_real_header.h>
      |          ^~~~~~~~~~~~~~~~~~~~~
1 error generated.
```

`fatal error` 会停掉这一次编译，后面的行不会再报。尖括号里的名字要在 sysroot 的头文件路径上。`iostream`、`vector`、`stdio.h` 在。`not_a_real_header.h` 不在，第三方库的头也不在。改成系统里有的头，或把自己的声明直接写进这个文件。没有包管理器可以把一个新头装进这次运行。

## 面板上的 hint 对得上哪一句

诊断列表会按报错文本找一条现成说明。`expected ';'` 能对上缺分号这则，提示大意是上一句可能少了分号。`file not found` 只有在文本里同时出现 `iostream` 和 `file not found` 时才给「你是不是用 C 编译器编了 C++ 头」那条。`not_a_real_header.h` 对不上，所以只有原文，没有那条 hint。

链接错误是 `undefined symbol`，hint 表里写的是 `undefined reference`。这一则 wasm-ld 的输出不会带上那条说明。读的时候以链接器原文为准：符号名在 `missing()`，临时目标文件名可以忽略。

## 四则怎么对上面板

| 你看到的 | 发生在 | 下一步 |
|----------|--------|--------|
| `expected ';' after expression` | 编译 | 按行号补上分号或括号 |
| `undefined symbol` | 链接 | 把函数定义放进同一份源码 |
| `with exceptions disabled` | 编译 | 改用返回值或 `std::optional` |
| `file not found` | 编译，且是 fatal | 换 sysroot 里有的头 |
| `timeout`，stderr 为 `Execution timed out after 5 seconds.` | 运行超过 5 秒 | 看死循环。一次 scanf 的空输入不是这种 |

四份最小程序都可以贴进 [`/playground`](/playground) 再跑一次。行号和冒号后面的英文应和上面一致，临时文件名的那一段数字不必相同。

上一篇是 [空 stdin 上的 scanf](/blog/scanf-stdin)。系列目录在 [浏览器里的 C++](/blog/series/browser-cpp)。
