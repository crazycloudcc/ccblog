---
title: 在浏览器里编译运行 C++，不用装编译器
excerpt: 打开就能 Run。clang 在浏览器里把 C++ 编成 WebAssembly，不用安装、没有后台容器。
date: 2026-08-14
coverLabel: wasm-zh
tags:
  - cpp
  - playground
  - wasm
  - 教程
series: "Runnable Notes"
difficulty: beginner
lang: zh-CN
---

这篇可以直接跑。下面的程序读几个整数，快排后打印。改一个数字，再点 **run**。

同一套编译器也在 [`/playground`](/playground)。整站是一份 [可 fork 的终端博客模板](https://github.com/crazycloudcc/ccblog/generate)。

浏览器里跑的是真的 **clang + lld**，编成 WebAssembly，在 Web Worker 里执行，限时 5 秒。第一次会拉工具链，之后就在本地缓存。

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

没有远程容器，请求不会把你的代码送到别人的机器上编译。

## 分区：快排真正干活的地方

选一个基准，扫一遍区间，小的放左边、大的放右边，基准落到最终位置：

:::annotate{title="quicksort.cpp · partition"}
```cpp
int partition(std::vector<int>& a, int lo, int hi) {
    int pivot = a[hi];
    int i = lo - 1;
    for (int j = lo; j < hi; j++) {
        if (a[j] <= pivot) {
            i++;
            std::swap(a[i], a[j]);
        }
    }
    std::swap(a[i + 1], a[hi]);
    return i + 1;
}
```
- line 2: 取最后一个元素当基准
- line 3: i 是「小于等于基准」一侧的边界，从 lo 再往左一格开始
- line 4: 扫描除基准外的每个元素
- line 5: 这个值应该去左边
- line 10: 把基准挪到左边那一堆的后面
- line 11: 返回值就是递归切开的位置
:::

平均 `O(n log n)`。如果每次都选到最边上的值（比如对已排序数组取第一个元素当基准），会退化成 `O(n^2)`。

:::cases{title="基准怎么选"}
### good
```cpp
int pivot = a[hi];   // 末元素：随机数据上大致均衡
```
### bad
```cpp
int pivot = a[lo];   // 首元素：已排序输入上会递归 n 层
```
:::

## 在这里跑

stdin 已填好 `5` 和 `3 1 4 1 5`。点 run，stdout 应是 `1 1 3 4 5`。

:::playground{title="quicksort.cpp" lang="cpp" stdin="5\n3 1 4 1 5"}
```cpp
#include <iostream>
#include <vector>

int partition(std::vector<int>& a, int lo, int hi) {
    int pivot = a[hi];
    int i = lo - 1;
    for (int j = lo; j < hi; j++) {
        if (a[j] <= pivot) {
            i++;
            std::swap(a[i], a[j]);
        }
    }
    std::swap(a[i + 1], a[hi]);
    return i + 1;
}

void quicksort(std::vector<int>& a, int lo, int hi) {
    if (lo < hi) {
        int p = partition(a, lo, hi);
        quicksort(a, lo, p - 1);
        quicksort(a, p + 1, hi);
    }
}

int main() {
    int n;
    if (!(std::cin >> n) || n <= 0) {
        return 1;
    }
    std::vector<int> a(n);
    for (int i = 0; i < n; i++) {
        std::cin >> a[i];
    }
    quicksort(a, 0, n - 1);
    for (int i = 0; i < n; i++) {
        std::cout << a[i] << (i + 1 < n ? ' ' : '\n');
    }
    return 0;
}
```
:::

一次成功的运行大致是这样：

:::trace{title="quicksort.cpp run"}
toolchain: 380ms
compile: 90ms
link: 40ms
run: 6ms
stdout: |
  1 1 3 4 5
:::

| stdin | 期望 stdout |
|-------|-------------|
| `5` 然后 `3 1 4 1 5` | `1 1 3 4 5` |
| `6` 然后 `6 5 4 3 2 1` | `1 2 3 4 5 6` |

第一次会慢一些，那是下载工具链。之后通常是几十毫秒。

英文版逐步讲解在 [Quicksort in C++](/blog/quicksort)。要自己写，打开 [`/playground`](/playground)；要把这套终端站拿走，用 [GitHub 模板](https://github.com/crazycloudcc/ccblog/generate)。
