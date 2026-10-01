---
title: "空 stdin 上 scanf 立刻得到 EOF"
excerpt: "输入框空着不是卡住。browsercc 0.1.1 里这段 stdin 是已经给完的文件，scanf(\"%d\") 马上返回 -1。"
date: 2026-09-25
updated: 2026-10-01
coverLabel: stdin
tags:
  - cpp
  - playground
  - wasm
  - stdin
series: "浏览器里的 C++"
seriesSlug: browser-cpp
difficulty: beginner
lang: zh-CN
runtime: browsercc
---

系列入口在 [在浏览器里编译运行 C++](/blog/liulanqi-bianyi-cpp)。面板上的 timeout 文案提到 blocking stdin，容易让人以为输入框空着，`scanf` 会等到 5 秒。用这套运行时量过：不会。

## 空文件会马上结束

点 Run 之前，面板里的 stdin 被编码成一段字节，放进 WASI 的 0 号文件。`@bjorn3/browser_wasi_shim` 的 `fd_read` 从这段字节里切一片返回。文件到了末尾，它返回长度为 0 的数据，而且立刻返回，不挂起。

空输入框就是长度为 0 的文件。C 库把这次 0 字节读当成 EOF。对 `%d` 来说，`scanf` 的返回值是 `-1`，写进变量的值保持 0。下面的程序把返回值和变量打出来。嵌入块没有预填 stdin。

用 browsercc 0.1.1、和 `/playground` 相同的 C++ 旗帜编过一次，再在同一套 WASI 里跑，耗时约 2 毫秒，stdout 是：

```text
scanf=-1 value=0
```

:::playground{title="read-one.cpp" lang="cpp"}
```cpp
#include <stdio.h>

int main(void) {
    int value = 0;
    int n = scanf("%d", &value);
    printf("scanf=%d value=%d\n", n, value);
    return n == 1 ? 0 : 1;
}
```
:::

没有 `got`，也没有 timeout。程序打印完那一行就返回了，面板显示 `[exit 1]`，因为 `n` 不是 1。

## 42 和 abc 不是同一种失败

stdin 为 `42` 加换行时，同一次测量的 stdout 是 `scanf=1 value=42`。转换成功。

stdin 为 `abc` 加换行时，stdout 是 `scanf=0 value=0`。文件里有字节，但不是整数，`scanf` 返回 0，不是 EOF。`value` 不会被写成读到的数。

:::playground{title="read-one.cpp" lang="cpp" stdin="42\n"}
```cpp
#include <stdio.h>

int main(void) {
    int value = 0;
    int n = scanf("%d", &value);
    printf("scanf=%d value=%d\n", n, value);
    return n == 1 ? 0 : 1;
}
```
:::

把上面第二段的 stdin 改成 `abc`，再 Run，应看到 `scanf=0 value=0`。

| stdin | stdout | 退出码 | 含义 |
|-------|--------|--------|------|
| 空 | `scanf=-1 value=0` | 1 | 文件结束 |
| `42` 加换行 | `scanf=1 value=42` | 0 | 读到整数 |
| `abc` 加换行 | `scanf=0 value=0` | 1 | 有输入，但不是整数 |

`cin >> value` 走的也是这个文件。空文件上提取失败，流会置位，函数返回，同样不会为了等下一次按键停住。这个面板不是终端，没有人会在运行途中再往里面打字。

## 5 秒超时是另一条路

`/playground` 在编译完成、开始执行时启动 5000 毫秒的定时器。到点还没收到结果，就把 worker 停掉。状态变成 `timeout`，stderr 写成 `Execution timed out after 5 seconds.`，输出区再加一行：

`[timeout] execution stopped after 5s — check for infinite loops or blocking stdin reads`

这句把死循环和阻塞读写在一起。当前这个 shim 的 stdin 不会阻塞。会走到这句的，是进程一直不返回，例如 [二分查找](/blog/binary-search) 里窗口不缩小的那个循环。`scanf` 本身在空文件上 2 毫秒就返回了。

若你自己写了 `while (scanf("%d", &x) != 1) {}` 这种不看 EOF 的循环，空输入上 `scanf` 每次都立刻返回 `-1`，循环倒是会转满 5 秒。烧掉时间的是循环，不是读。

面板会显示程序实际的 WASI 退出码。`wasi.start` 捕获 `proc_exit` 后返回退出码，运行器保留这个值：`return 0` 显示 `[exit 0]`，`return 1` 显示 `[exit 1]`，stdout 和 stderr 都会保留。旧版运行器曾忽略这个返回值，导致 `return 1` 也显示 0；这个问题已修复。

内建的 `a+b.cpp` 也可以验证：stdin 空着时，`cin` 提取失败，stdout 为空，退出码为 1；输入 `20 22` 后输出 `42`，退出码为 0。选择这个示例只会载入代码，保留输入框已有的内容；点 stdin 旁的「载入示例输入」会填入 `3 4`，再 Run 得到 `7`。输入框非空时会先让你确认替换，取消则保留原输入。placeholder 不是预填输入。

非零退出说明程序主动返回了非零值，不会被标成 `runtime error`。真正的 WASM trap 或运行异常会显示 `runtime error`，保留异常前的输出并追加错误信息；这种情况没有程序返回的退出码。

编译失败是还没有模块。四则真实诊断在 [浏览器里 clang 报错怎么读](/blog/clang-diagnostics)。系列目录在 [浏览器里的 C++](/blog/series/browser-cpp)。
