---
title: "最长上升子序列 O(n log n)：lower_bound 要严格递增"
excerpt: "patience 数组的长度就是 LIS。比较写成 <= 时，2 2 2 会被算成 3。"
date: 2026-08-06
updated: 2026-09-25
coverLabel: rn-03
tags:
  - algorithm
  - cpp
  - playground
  - dp
series: "浏览器里的 C++"
seriesSlug: browser-cpp
difficulty: intermediate
lang: zh-CN
runtime: browsercc
---

系列入口在 [在浏览器里编译运行 C++](/blog/liulanqi-bianyi-cpp)。严格递增的最长子序列（LIS）里，`2 2 2` 的长度是 1。把二分比较从 `<` 改成 `<=`，同一份输入会报 3。

`O(n²)` 的 `dp[i]` 好写，也容易看懂。`O(n log n)` 的 patience 数组把其中一层线性扫描换成了二分，中点写法和 [上一篇二分查找](/blog/binary-search) 相同：`lo + (hi - lo) / 2`。这篇只盯住比较符。

## tails 里放的不是子序列

`tails[i]` 是「长度为 `i + 1` 的递增子序列里，目前见过的最小结尾」。每来一个 `x`，就找第一个 `tails[mid] >= x` 的位置：能放进去就替换，放不进就接到末尾。数组里并不保存一条真实的子序列，它的长度却始终等于 LIS 的长度。

:::annotate{title="lis.cpp · lisLength"}
```cpp
int lisLength(const std::vector<int>& a) {
    std::vector<int> tails;
    for (int x : a) {
        int lo = 0, hi = (int)tails.size();
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (tails[mid] < x) lo = mid + 1;
            else hi = mid;
        }
        if (lo == (int)tails.size()) tails.push_back(x);
        else tails[lo] = x;
    }
    return (int)tails.size();
}
```
- line 2: tails[i] 是长度为 i+1 的递增子序列的最小结尾
- line 6: 找第一个 tails[mid] >= x，这就是 lower_bound
- line 7: 用 <，相等时走 else，去替换而不是往后探
- line 10: x 比所有结尾都大，长度加一
- line 11: 否则用 x 换掉一个更大的结尾
- line 13: tails 的长度就是 LIS
:::

## 2 2 2 不该变成 3

严格递增要求后一个数**大于**前一个。相等不能延长。

`<` 的时候，`2 2 2` 是这样走的：

1. 第一个 `2`，`tails` 是空的，推进去，变成 `[2]`。
2. 第二个 `2`。`tails[0] < 2` 不成立，`lo` 停在 0，用 `2` 替换 `2`，还是 `[2]`。
3. 第三个同样替换。长度是 1。

把第 7 行改成 `tails[mid] <= x` 之后，相等也被当成「可以往后探」：

1. 第一个 `2`，`tails` 变成 `[2]`。
2. 第二个 `2`。`tails[0] <= 2`，`lo` 移到 1，1 已经等于长度，于是再 push，变成 `[2, 2]`。
3. 第三个再 push，变成 `[2, 2, 2]`。长度是 3。

3 不是严格递增子序列的长度。若题目要的是非下降（允许相等），`<=` 才是对的，那是另一道题。

:::cases{title="严格还是非严格"}
### strict
```cpp
if (tails[mid] < x) lo = mid + 1;   // 相等时替换，2 2 2 的长度是 1
else hi = mid;
```
### non-strict
```cpp
if (tails[mid] <= x) lo = mid + 1;  // 相等时延长，2 2 2 的长度变成 3
else hi = mid;
```
:::

每个数最多做一次二分，二分的上界是当前 `tails` 的长度，而这个长度不会超过 `n`。所以总比较是 `O(n log n)`，不是因为生成了一棵平衡树，是因为 `n` 次查找各花对数时间。`O(n²)` 的写法对每个 `i` 都回头扫描全部 `j < i`，那一层是线性的。下面表格里的 18ms 和 4ms 沿用改写前这篇笔记里的对照，不是这次在浏览器里重新计时。它只用来看两层循环和一层二分的差别。

## 10 9 2 5 3 7 101 的 tails

用严格的 `<` 走一遍默认输入，看结尾数组怎么变：

| 读到 | tails | 原因 |
|------|-------|------|
| 10 | `[10]` | 空数组，直接延长 |
| 9 | `[9]` | 9 比 10 小，替换长度 1 的结尾 |
| 2 | `[2]` | 2 更小，再次替换 |
| 5 | `[2, 5]` | 5 比所有结尾都大，长度变成 2 |
| 3 | `[2, 3]` | 3 落在 2 和 5 之间，替换 5 |
| 7 | `[2, 3, 7]` | 7 延长 |
| 101 | `[2, 3, 7, 101]` | 101 延长 |

长度是 4。`tails` 最终是 `2 3 7 101`，它刚好也是一条合法子序列，但这是巧合。替换结尾时，数组里的数不一定还能按原下标连成子序列。能保证的只有长度：每个位置上的结尾都是「该长度下见过的最小可能」。更小的结尾让后面的数更容易接上来，所以长度不会被这次替换弄短，也不会凭空变长。

`<=` 破坏的是「相等不算更长」。在 `2 2 2` 上，第二次 `2` 被当成大于全部结尾，`tails` 从 `[2]` 长到 `[2, 2]`。长度变了，不变量没了。修的时候只改比较符，中点公式不用动。中点溢出是 [二分那篇](/blog/binary-search) 的问题，这里的 `lo + (hi - lo) / 2` 已经避开它。

## 在这里跑

程序读 `n`，再读 `n` 个整数，打印严格 LIS 的长度。默认输入 `10 9 2 5 3 7 101`，一条最长的是 `2 5 7 101`，长度 4。把 stdin 改成 `3` 和 `2 2 2`，stdout 应是 `1`。

:::playground{title="lis.cpp" lang="cpp" stdin="7\n10 9 2 5 3 7 101"}
```cpp
#include <iostream>
#include <vector>

int lisLength(const std::vector<int>& a) {
    std::vector<int> tails;
    for (int x : a) {
        int lo = 0, hi = (int)tails.size();
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (tails[mid] < x) lo = mid + 1;
            else hi = mid;
        }
        if (lo == (int)tails.size()) tails.push_back(x);
        else tails[lo] = x;
    }
    return (int)tails.size();
}

int main() {
    int n;
    if (!(std::cin >> n) || n <= 0) return 1;
    std::vector<int> a(n);
    for (int i = 0; i < n; i++) std::cin >> a[i];
    std::cout << lisLength(a) << "\n";
    return 0;
}
```
:::

| stdin | stdout |
|-------|--------|
| `7` / `10 9 2 5 3 7 101` | `4` |
| `8` / `1 3 2 4 5 8 9 10` | `7` |
| `6` / `1 2 3 4 5 6` | `6` |
| `6` / `6 5 4 3 2 1` | `1` |
| `3` / `2 2 2` | `1` |

`O(n²)` 的双重循环更好写，`n` 一大就先慢下来。下面这组数是同一份实现、同一份 `n = 10000` 输入上量的，只说明这一层从线性变成对数之后量级变了，不是浏览器沙箱的性能结论：

:::bench{title="LIS，n=10000"}
| variant | time |
|---------|------|
| O(n^2) DP | 18ms |
| O(n log n) patience | 4ms |
:::

下一篇是 [空 stdin 上的 scanf](/blog/scanf-stdin)。系列目录在 [浏览器里的 C++](/blog/series/browser-cpp)。
