---
title: "二分查找死循环：mid 写成 (lo + hi) / 2"
excerpt: "两个独立的坑：有符号加法溢出，以及测完 mid 却不把窗口缩小。后者会在浏览器里撞上 5 秒超时。"
date: 2026-08-05
updated: 2026-09-25
coverLabel: rn-02
tags:
  - algorithm
  - cpp
  - playground
  - searching
series: "浏览器里的 C++"
seriesSlug: browser-cpp
difficulty: beginner
lang: zh-CN
runtime: browsercc
---

系列入口在 [在浏览器里编译运行 C++](/blog/liulanqi-bianyi-cpp)。这篇只讲二分查找里两个常被写到一起的错误：`(lo + hi) / 2` 会溢出；测完 `mid` 却让 `lo = mid`，窗口不缩小，循环不会结束。

数组必须已经有序。有序才允许扔掉一半。下面的正确写法把窗口收成 `[lo, hi]`，中点用 `lo + (hi - lo) / 2`，比较之后严格跳过刚测过的那一格。

:::annotate{title="bsearch.cpp · binarySearch"}
```cpp
int binarySearch(const std::vector<int>& a, int target) {
    int lo = 0;
    int hi = (int)a.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) {
            return mid;
        } else if (a[mid] < target) {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return -1;
}
```
- line 4: 不变量：目标若存在，就在 [lo, hi]；区间空了循环结束
- line 5: 中点。先减再加，避免 (lo + hi) 溢出
- line 8: 目标比 mid 大，左边连 mid 一起丢掉
- line 10: 目标比 mid 小，右边连 mid 一起丢掉
- line 14: 区间空了，目标不在数组里
:::

## (lo + hi) / 2 溢出会怎样

`lo` 和 `hi` 是 `int`。两个接近 `INT_MAX` 的下标相加，结果装不进 32 位有符号整数。以 `lo = 2000000000`、`hi = 2000000001` 为例，和是 `4000000001`，超过 `2147483647`。

这是未定义行为。常见的二进制补码实现会把和卷成负数，再除以 2，`mid` 变成负数。接下来 `a[mid]` 就不再是你以为的那个中点。

安全的写法是先做减法：`lo + (hi - lo) / 2`。`hi - lo` 不会比数组长度更大，加法的结果落在 `[lo, hi]` 里面。上面的可运行代码用的就是这一种。溢出改的是中点算错，它自己并不构成死循环。

## 窗口不缩小才会死循环

死循环来自下一行。`mid` 已经比较过了，收窄时必须跳过它。写成 `lo = mid` 而不是 `lo = mid + 1`，两格窗口会卡住。

看数组 `[1, 3]`，找 `3`：

1. `lo = 0`，`hi = 1`，`mid = 0`，`a[0]` 是 `1`，比目标小。
2. 错误写法执行 `lo = mid`，`lo` 还是 `0`。
3. 下一轮的 `lo`、`hi`、`mid` 和上一轮一样。

Playground 的墙钟是 5 秒。循环停不下来时，面板状态是 timeout，并打印：

stderr 是 `Execution timed out after 5 seconds.` 输出区另外一行是 `[timeout] execution stopped after 5s — check for infinite loops or blocking stdin reads`。这套 stdin 其实不会阻塞，那半句是提示文案；这篇的循环是真的不返回。空文件上的一次 `scanf` 会马上结束，写在 [scanf 那篇](/blog/scanf-stdin)。

:::cases{title="收窄窗口"}
### good
```cpp
lo = mid + 1;   // mid 已经比过，必须跳过
hi = mid - 1;
```
### bad
```cpp
lo = mid;       // 两格窗口可能不动，直到 5 秒超时
hi = mid;
```
:::

下面这段就是错误收窄。stdin 是 `2`、`1 3`、目标 `3`。点 Run 会一直转到超时，不会打出下标。

:::playground{title="bsearch-stall.cpp" lang="cpp" stdin="2\n1 3\n3"}
```cpp
#include <iostream>
#include <vector>

int binarySearch(const std::vector<int>& a, int target) {
    int lo = 0;
    int hi = (int)a.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) {
            return mid;
        } else if (a[mid] < target) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    return -1;
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
    int target;
    if (!(std::cin >> target)) {
        return 1;
    }
    std::cout << binarySearch(a, target) << "\n";
    return 0;
}
```
:::

## 把溢出的数算完

`2000000000 + 2000000001 = 4000000001`。`int` 的上限是 `2147483647`。语言把有符号溢出规定为未定义行为，也就是不保证你能看到哪一种结果。若实现按 32 位二进制补码把和卷回来，`4000000001 - 4294967296 = -294967295`，再除以 2，得到 `-147483647`。这个负数不再是下标。接下来读 `a[mid]` 就是越界，而不是「慢慢变慢」。

`lo + (hi - lo) / 2` 把减法放在前面。`hi - lo` 是非负的区间长度，除以 2 之后再加回 `lo`，结果仍落在 `[lo, hi]`。可运行的那份代码用的是这一种，所以即使用很大的下标，中点也不会因为这一次加法变成负数。

溢出和死循环是两件事。溢出让中点算错，程序可能立刻越界。死循环要窗口在比较之后维持原样，时间才会走满 5 秒。标题把它们写在一起，是因为两种都常被塞进同一行 `mid` 附近，修的时候要分开看。

## 正确的一次查找在做什么

数组 `[1, 3, 5, 7, 9]`，目标 `5`：

1. `lo = 0`，`hi = 4`，`mid = 2`，`a[2]` 就是 `5`，返回 2。
2. 若目标是 `9`：`a[2] = 5` 偏小，`lo` 变成 3。下一轮 `lo = 3`，`hi = 4`，`mid = 3`，`a[3] = 7` 仍偏小，`lo` 变成 4。再一轮 `mid = 4`，命中。
3. 若目标是 `6`：同样收到右边，`7` 偏大则 `hi` 变成 `mid - 1`。窗口最终空掉，返回 `-1`。

每一步区间的长度都严格变小，因为被测过的 `mid` 不再留在窗口里。这就是 `lo = mid + 1` 和 `hi = mid - 1` 在维护的不变量：目标若还在，一定还在新的 `[lo, hi]` 里。

`lo = mid` 破坏的是「严格变小」，不是有序这个前提。数组有序只保证可以扔掉一半。窗口不缩短时，有序也救不了循环。

超时信息不会告诉你是哪一行。它只说明 5 秒里进程没有退出。要确认是不是这篇的坑，看循环体有没有在比较之后把 `lo` 或 `hi` 移过 `mid`。

目标 `9` 的闭区间可以列成表。数组下标 0 到 4 是 `1 3 5 7 9`：

| 轮 | lo | hi | mid | a[mid] | 下一步 |
|----|----|----|-----|--------|--------|
| 1 | 0 | 4 | 2 | 5 | 5 < 9，lo = 3 |
| 2 | 3 | 4 | 3 | 7 | 7 < 9，lo = 4 |
| 3 | 4 | 4 | 4 | 9 | 命中，返回 4 |

每一轮 `hi - lo` 都变小。若第二轮误写成 `lo = mid`，`lo` 停在 3，`hi` 仍是 4，下一轮的 mid 还是 3，表不再往下走。这就是超时例子在 `[1, 3]` 上发生的事，只是区间更短，两轮就重复。

## 下标从 0 还是从 1

可运行的版本把 `hi` 设成 `size - 1`，循环条件是 `lo <= hi`。这是闭区间：两端都可能是答案。有人写成 `hi = size`、`lo < hi`，那是半开区间，中点更新也要一起换。两套不能各取一半。闭区间配 `lo < hi`，最后一格可能永远不被测到；半开区间配 `lo = mid`，又会回到窗口不缩小。

这篇的超时例子保持闭区间，只把更新改错，这样失败原因只有一个。你若在 Playground 里改区间写法，先选定开闭，再改中点。

## 收对之后再跑

跳过 `mid` 的版本读入 `n`、`n` 个有序整数、再一个目标，打印 0 起始的下标，找不到打印 `-1`。

:::playground{title="bsearch.cpp" lang="cpp" stdin="5\n1 3 5 7 9\n5"}
```cpp
#include <iostream>
#include <vector>

int binarySearch(const std::vector<int>& a, int target) {
    int lo = 0;
    int hi = (int)a.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) {
            return mid;
        } else if (a[mid] < target) {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return -1;
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
    int target;
    if (!(std::cin >> target)) {
        return 1;
    }
    int idx = binarySearch(a, target);
    std::cout << idx << "\n";
    return 0;
}
```
:::

找 `5` 时，窗口从 `[1, 3, 5, 7, 9]` 收到中点 `5`，stdout 是 `2`。

| stdin | stdout |
|-------|--------|
| `5` / `1 3 5 7 9` / `5` | `2` |
| `5` / `1 3 5 7 9` / `1` | `0` |
| `5` / `1 3 5 7 9` / `9` | `4` |
| `5` / `1 3 5 7 9` / `6` | `-1` |
| `1` / `5` / `5` | `0` |

下一篇是 [快排在已排序数组上退化成一条链](/blog/quicksort)。系列目录在 [浏览器里的 C++](/blog/series/browser-cpp)。
