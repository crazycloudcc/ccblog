---
title: 在浏览器里编译运行 C++，不用装编译器
excerpt: 打开就能 Run。clang 在浏览器 Worker 里把 C++ 编成 WebAssembly，无需把源码上传到编译服务器。
date: 2026-08-14
updated: 2026-10-06
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

点 **Run** 在浏览器 Worker 中编译和运行，不会把源码上传到编译服务器。工具链仍需要从站点或 CDN 下载；后续是否走网络取决于浏览器 HTTP 缓存，不保证离线可用。分享链接另有数据边界，见下方「代码、输入与分享链接」。

## 点一下 Run 会发生什么

:::steps{title="run pipeline"}
```cpp
// 1. 拉取 WASM 工具链（请求可能命中 HTTP 缓存）
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

1. 下载 clang、lld 和一份 WASI sysroot。体积不小，所以第一次会停一下。每次 Run 都会初始化编译模块并读取 sysroot；浏览器可能用 HTTP 缓存复用下载结果，但不保证第二次没有网络请求。
2. `clang++` 按 C++17 编译，旗帜是 `-std=c++17 -Wall -O0 -fno-exceptions`。`-O0` 是为了看行为，不适合拿来比性能。`-fno-exceptions` 禁用 C++ 异常，直接写 `throw` / `try` 会在编译期被拒绝；这套 WASI 也没有可用的 C++ 异常运行时。
3. `wasm-ld` 把目标文件链成一个 wasm 模块。
4. `WebAssembly.instantiate` 配上 WASI，从 `_start` 跑你的 `main`。编译完成后的执行阶段墙钟限制是 5 秒，不包括下载、编译和链接时间。到点之后面板写的是：`[timeout] execution stopped after 5s — check for infinite loops or input loops that ignore EOF`。

C 走另一条：`clang`，`-std=c11 -Wall -O0`，源文件名是 `main.c`。语言在 Playground 的工具栏里切换。

## 和把代码送到服务器的编译器

JDoodle、Wandbox 这类站点把源码发到它们的机器上，用那边安装的 g++ 跑。这里的 clang 本身被编成了 WebAssembly，编译和运行都发生在你打开的标签页里。

由此来的差别：

- 编译和运行在浏览器 Worker 里完成，没有「帮你编译」的后台容器。主动分享代码时则不同。
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
- **第三方库。** 不能任意安装第三方库，也没有包管理器。可用头文件和库受工具链内置 sysroot 限制。
- **读你的磁盘。** 编译器使用自己的虚拟 sysroot；运行中的用户程序只获得 stdin、stdout、stderr 三个描述符，没有预打开的目录，也不能读取编译器的 sysroot 或电脑上的目录。
- **不返回的循环。** 执行超过 5 秒会被停掉。一次 `scanf` 遇到空文件会马上返回，不会靠这个超时。两者的差别写在 [scanf 那篇](/blog/scanf-stdin)。
- **C++ 异常。** 当前旗帜禁用了异常，`throw` / `try` 会在编译期报 `with exceptions disabled`。用返回值或 `std::optional` 表达失败；最小复现见 [clang 报错说明](/blog/clang-diagnostics)。
- **性能结论。** `-O0` 加上 WASM 的启动成本，不能拿来和本机 `clang -O2` 比快慢。

编译失败时长什么样，四则最小例子在 [浏览器里 clang 报错怎么读](/blog/clang-diagnostics)。

## 页面上实际有什么

[`/playground`](/playground) 左边是编辑器，右边是输出。工具栏切 C 或 C++，**Run** 开始编译。stdin 是单独一栏，只有程序要读输入时才需要填，标签是 `stdin (for cin / scanf)`，空框提示「程序需要输入时，在运行前填入」。

输出面板先给阶段耗时，再给 clang 的诊断。能解析出文件、行、列的编译错误会进入可点击诊断，点一下会跳到编辑器对应行；链接器等不带这种位置格式的错误留在原始编译器日志中。编译器日志、stdout 和 stderr 分区显示，各自的复制按钮只复制对应的原文，保留空格、制表符和换行，不混入命令、耗时或退出状态。正常返回时状态显示实际退出码：`return 0` 是 `exit 0`，`return 1` 是 `exit 1`，stdout / stderr 都会保留。编译或链接失败是 `compile error`，还没有可运行的 wasm 模块。WASM trap 或运行异常会显示 `runtime error`，没有程序返回的退出码；工具链加载或编译流程本身抛出异常时，也可能显示这个状态，需结合阶段和错误原文判断。执行超过五秒是 `timeout`。具体输入和退出码可以对照 [scanf 那篇](/blog/scanf-stdin)。

分享会复制一条带压缩参数的链接，打开后恢复代码和 stdin。带 `?z=` 或 `embed=1` 的地址响应头是 `noindex`，免得每一份草稿都变成搜索结果。

## 代码、输入与分享链接

普通可编辑会话会把代码草稿按语言、stdin 单独保存到当前浏览器的 localStorage；浏览器禁用或清除存储时无法保证恢复。只读分享不覆盖你的本地草稿。

**share** 将源码和 stdin 压缩后放入 URL 查询参数，再复制到剪贴板。这是可还原的编码，不是加密。打开链接会把这些查询参数发送到站点；拿到链接的人可以读取内容。`noindex` 不是访问控制，`readonly=1` 也不是保密或授权机制。不要把密码、令牌或敏感资料放进代码、stdin 或分享链接。

页面加载、工具链下载和站点既有的分析功能仍会联网；「本地编译」不等于整个网站没有网络活动，也不是整站隐私保证。

需要支持 WebAssembly、Web Worker 的现代浏览器；压缩分享链接还依赖 CompressionStream / DecompressionStream，自动复制依赖 Clipboard API 与浏览器权限。当前不是完整的桌面 IDE 或原生系统环境。

## 工具链从哪来

预加载的三个文件是 `clang.wasm`、`lld.wasm` 和 `sysroot.tar`。开发模式走本机的 `/api/toolchain`。生产默认是 `https://unpkg.com/browsercc@0.1.1/dist`，也就是依赖里的 browsercc 0.1.1。部署时可以设 `NEXT_PUBLIC_TOOLCHAIN_BASE` 换成别的地址，文件名不变。

预加载会发起下载。每次 Run 仍会初始化编译模块并读取 sysroot；请求能否命中缓存取决于浏览器和 CDN 的缓存策略。页面没有提供一套保证离线运行的工具链安装包。

## 这四面旗帜分别做什么

C++ 的命令是 `clang++ main.cpp -std=c++17 -Wall -O0 -fno-exceptions`。

- `-std=c++17` 决定能用哪些语言特性。更新的标准没有打开。
- `-Wall` 打开一批常见警告。警告不会让 Run 失败，诊断区收的是 error 和 fatal error。
- `-O0` 几乎不做优化。循环还在，变量也还在，方便对照源码。它不代表这段 C++ 在本机上的速度。
- `-fno-exceptions` 关掉异常。直接写 `throw` / `try` 会得到 `cannot use … with exceptions disabled` 编译错误。移除这面旗帜也不代表这套 WASI 就能提供 C++ 异常运行时。

C 是 `clang main.c -std=c11 -Wall -O0`，没有最后那面旗帜，因为 C 没有这套异常运行时。

把上面的 hello 放进去，四步走完，stdout 只有一行 `hello from the browser`。它不读 stdin，所以空着输入框也行。程序若调用 `scanf` 或 `cin`，空输入是 EOF，不是编译错误，也不是 5 秒超时。

## 建议的读法

先在这篇下面的 hello 上点一次 Run，确认 stdout 是 `hello from the browser`。第一次会去拉 `clang.wasm`、`lld.wasm` 和 `sysroot.tar`，后续请求可能命中浏览器 HTTP 缓存。然后按系列往下，每次只改一个地方：二分那篇只改中点或窗口，快排那篇只改基准，LIS 那篇只改比较符。改完看 stdout，不要同时改三处，否则失败时对不上是哪一行。

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
