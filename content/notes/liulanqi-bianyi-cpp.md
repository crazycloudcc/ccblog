---
title: 在浏览器里编译运行 C++，不用装编译器
excerpt: 打开就能 Run。clang 在浏览器里把 C++ 编成 WebAssembly，源码不上传，也没有后台容器。
date: 2026-08-14
updated: 2026-10-01
coverLabel: wasm-zh
tags:
  - cpp
  - playground
  - wasm
  - 教程
series: "浏览器里的 C++"
seriesSlug: browser-cpp
difficulty: beginner
lang: zh-CN
---

这是系列的入口。后面每一篇只拆一个坑，代码就在文里跑。同一套编译器在 [`/playground`](/playground)，系列目录在 [浏览器里的 C++](/blog/series/browser-cpp)。

你写的源码留在这台浏览器里。点 **Run** 不会把代码送到别人的机器上编译。第一次会下载工具链，之后走本地缓存。

## 点一下 Run 会发生什么

:::steps{title="run pipeline"}
```cpp
// 1. 拉取 WASM 工具链（第二次起走缓存）
// 2. clang 把源码编成目标文件
// 3. lld 链成 wasm 模块
// 4. WebAssembly.instantiate + WASI 跑 _start
```
1. 拉取工具链
2. 编译源码
3. 链接模块
4. 执行 main
:::

四步都在页面自己的 Web Worker 里：

1. 下载 clang、lld 和一份 WASI sysroot。体积不小，所以第一次会停一下。浏览器把它们缓存之后，再跑就不再走网络。
2. `clang++` 按 C++17 编译，旗帜是 `-std=c++17 -Wall -O0 -fno-exceptions`。`-O0` 是为了看行为，不适合拿来比性能。`-fno-exceptions` 禁用 C++ 异常，直接写 `throw` / `try` 会在编译期被拒绝；这套 WASI 也没有可用的 C++ 异常运行时。
3. `wasm-ld` 把目标文件链成一个 wasm 模块。
4. `WebAssembly.instantiate` 配上 WASI，从 `_start` 跑你的 `main`。墙钟限制是 5 秒。到点之后面板写的是：`[timeout] execution stopped after 5s — check for infinite loops or blocking stdin reads`。

C 走另一条：`clang`，`-std=c11 -Wall -O0`，源文件名是 `main.c`。语言在 Playground 的工具栏里切换。

## 和把代码送到服务器的编译器

JDoodle、Wandbox 这类站点把源码发到它们的机器上，用那边安装的 g++ 跑。这里的 clang 本身被编成了 WebAssembly，编译和运行都发生在你打开的标签页里。

由此来的差别：

- 源码不出浏览器。没有「帮你编译」的后台容器。
- 不能用服务器上才有的系统库、包管理器或本机磁盘。
- 第一次要先把工具链拉下来。
- 线程、网络、超过 5 秒的循环，都跑不了。

输出仍然是真的编译器诊断和真的程序 stdout，不是在服务端模拟的结果。

## 现在能跑什么

- C11 和 C++17 的常见写法。
- sysroot 里的标准库头，例如 `iostream`、`vector`、`algorithm`、`string`、`stdio.h`。
- 标准输入。程序要读 `cin` 或 `scanf` 时，把内容填进运行面板的 stdin。空着不填，这段输入是一个长度为 0 的文件，`scanf` 会立刻得到 EOF，而不是等到超时。实测写在 [空 stdin 上的 scanf](/blog/scanf-stdin)。
- 分享链接。带 `?z=` 的地址会还原代码和 stdin，这种地址不进入搜索索引。

下面这段不读输入，点 Run 就会在 stdout 打出一行：

:::playground{title="hello.cpp" lang="cpp"}
```cpp
#include <iostream>

int main() {
    std::cout << "hello from the browser\n";
    return 0;
}
```
:::

## 做不到什么

这些不是你少装了一个包，是这套沙箱的边界：

- **线程和网络。** 没有 pthread，也没有 socket。想连网的代码链接或运行时会失败。
- **第三方库。** sysroot 里没有它们，也没有包管理器可以把它们装进来。
- **读你的磁盘。** WASI 看见的文件系统是工具链准备好的那一份，不是你电脑上的目录。
- **不返回的循环。** 执行超过 5 秒会被停掉。一次 `scanf` 遇到空文件会马上返回，不会靠这个超时。两者的差别写在 [scanf 那篇](/blog/scanf-stdin)。
- **C++ 异常。** 当前旗帜禁用了异常，`throw` / `try` 会在编译期报 `with exceptions disabled`。用返回值或 `std::optional` 表达失败；最小复现见 [clang 报错说明](/blog/clang-diagnostics)。
- **性能结论。** `-O0` 加上 WASM 的启动成本，不能拿来和本机 `clang -O2` 比快慢。

编译失败时长什么样，四则最小例子在 [浏览器里 clang 报错怎么读](/blog/clang-diagnostics)。

## 页面上实际有什么

[`/playground`](/playground) 左边是编辑器，右边是输出。工具栏切 C 或 C++，**Run** 开始编译。stdin 是单独一栏，只有程序要读输入时才需要填，标签是 `stdin (for cin / scanf)`，空框提示「程序需要输入时，在运行前填入」。

输出面板先给阶段耗时，再给 clang 的诊断。编译失败时，诊断带文件名和行号，点一下会跳到编辑器对应行。编译通过之后，同一块区域改显示 stdout / stderr。正常返回时状态显示实际退出码：`return 0` 是 `exit 0`，`return 1` 是 `exit 1`，stdout / stderr 都会保留。编译或链接失败是 `compile error`，还没有可运行的 wasm 模块。真正的 WASM trap 或运行异常才显示 `runtime error`，没有程序返回的退出码。执行超过五秒是 `timeout`。具体输入和退出码可以对照 [scanf 那篇](/blog/scanf-stdin)。

分享会复制一条带压缩参数的链接，打开后恢复代码和 stdin。带 `?z=` 或 `embed=1` 的地址响应头是 `noindex`，免得每一份草稿都变成搜索结果。

## 工具链从哪来

预加载的三个文件是 `clang.wasm`、`lld.wasm` 和 `sysroot.tar`。开发模式走本机的 `/api/toolchain`。生产默认是 `https://unpkg.com/browsercc@0.1.1/dist`，也就是依赖里的 browsercc 0.1.1。部署时可以设 `NEXT_PUBLIC_TOOLCHAIN_BASE` 换成别的地址，文件名不变。

同一次打开页面，这三个文件进了内存，再点 Run 不会为了同一次会话重新下载。下一次访问是否还要下，取决于浏览器和 CDN 的缓存头，不是页面里另做了一套离线包。

## 这四面旗帜分别做什么

C++ 的命令是 `clang++ main.cpp -std=c++17 -Wall -O0 -fno-exceptions`。

- `-std=c++17` 决定能用哪些语言特性。更新的标准没有打开。
- `-Wall` 打开一批常见警告。警告不会让 Run 失败，诊断区收的是 error 和 fatal error。
- `-O0` 几乎不做优化。循环还在，变量也还在，方便对照源码。它不代表这段 C++ 在本机上的速度。
- `-fno-exceptions` 关掉异常。直接写 `throw` / `try` 会得到 `cannot use … with exceptions disabled` 编译错误。移除这面旗帜也不代表这套 WASI 就能提供 C++ 异常运行时。

C 是 `clang main.c -std=c11 -Wall -O0`，没有最后那面旗帜，因为 C 没有这套异常运行时。

把上面的 hello 放进去，四步走完，stdout 只有一行 `hello from the browser`。它不读 stdin，所以空着输入框也行。程序若调用 `scanf` 或 `cin`，空输入是 EOF，不是编译错误，也不是 5 秒超时。

## 建议的读法

先在这篇下面的 hello 上点一次 Run，确认 stdout 是 `hello from the browser`。第一次会去拉 `clang.wasm`、`lld.wasm` 和 `sysroot.tar`，同一次打开里再点就不用重新下载。然后按系列往下，每次只改一个地方：二分那篇只改中点或窗口，快排那篇只改基准，LIS 那篇只改比较符。改完看 stdout，不要同时改三处，否则失败时对不上是哪一行。

诊断和超时不要混着看。有 `error:` 或 `fatal error:`，编译没产出模块，去 [报错那篇](/blog/clang-diagnostics)。没有诊断、stdout 立刻打出 `scanf=-1`，输入是空文件，去 [scanf 那篇](/blog/scanf-stdin)。stderr 是 `Execution timed out after 5 seconds.`，进程没返回，多半是循环，二分那篇的错误收窄就是这种。

## 这篇不打算教会的事

它不是一份 C++ 语法课。`iostream` 怎么写、类怎么声明，不在这里展开。也不是安装指南：你不需要在机器上装 clang，页面自带的就是编译器。

它也不证明浏览器比本机快。`-O0`、WASM 的启动、第一次下载工具链，这三样都让计时不好跟 `clang -O2` 比。系列里出现的毫秒，只说明某一次运行的阶段，不拿来排名。

适合拿它做的事：确认一段短程序的输出、看一条诊断长什么样、把一个会失败的输入留在文章里让读者自己改。程序要读文件、开线程、链第三方库，换到本机工具链。

## 这个系列

每篇保留一个能跑的程序，只讲一个坑：

- [二分查找死循环：mid 写成 (lo + hi) / 2](/blog/binary-search)：溢出，以及窗口不缩小。
- [快排退化成 O(n²)：已排序数组却取 a[lo] 当基准](/blog/quicksort)：基准贴边时递归成一条链。
- [最长上升子序列 O(n log n)：lower_bound 要严格递增](/blog/longest-increasing-subsequence)：相等元素不该把长度加一。
- [空 stdin 上 scanf 立刻得到 EOF](/blog/scanf-stdin)。
- [浏览器里 clang 报错怎么读](/blog/clang-diagnostics)。

要自己改代码，打开 [`/playground`](/playground)。

## 作者还做了这些 App

笔记以外，App Store 上有一组实用工具和游戏，目录在 [`/apps`](/apps)。其中 [LocalBeats: Offline Player](/blog/localbeats) 离线播放设备上的音乐和媒体文件。
