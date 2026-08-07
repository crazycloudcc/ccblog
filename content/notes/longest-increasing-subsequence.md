---
title: Longest Increasing Subsequence in C++
excerpt: "LIS length in O(n log n) - the patience array, the strict-vs-non-strict trap, and a live run."
date: 2026-08-06
coverLabel: rn-03
tags:
  - algorithm
  - cpp
  - playground
  - dp
series: "Runnable Notes"
difficulty: intermediate
lang: en
---

Part three of **Runnable Notes**. The **Longest Increasing Subsequence** (LIS) of an array is the longest subsequence whose values strictly increase. The naive `O(n^2)` DP is easy; the `O(n log n)` patience method is the interesting one - and it reuses the binary search from the previous note.

## The patience method

Keep a `tails` array where `tails[i]` is the smallest value that can end an increasing subsequence of length `i+1`. For each value, binary-search where it belongs and either extend `tails` or lower an existing entry:

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
- line 2: tails[i] = smallest possible tail of an increasing subsequence of length i+1
- line 4: binary search tails for the first index where tails[i] >= x (lower_bound)
- line 7: strict < so equal values replace instead of extend
- line 10: x beats every tail - it extends the longest subsequence, grow tails
- line 11: otherwise x improves a shorter subsequence - lower its tail
- line 13: tails.size() is the LIS length
:::

The array never holds a real subsequence - only the tail values - but its length always equals the LIS length.

## Strict vs non-strict

The `<` on line 7 is what keeps the subsequence *strictly* increasing. Swap it for `<=` and equal values start extending instead of replacing, so `2 2 2` reports LIS 3 instead of 1:

:::cases{title="Strict vs non-strict"}
### strict (correct)
```cpp
if (tails[mid] < x) lo = mid + 1;   // equal values replace -> strictly increasing
else hi = mid;
```
### non-strict (bug)
```cpp
if (tails[mid] <= x) lo = mid + 1;  // equal values extend -> over-counts on dups
else hi = mid;
```
:::

If you want a non-strictly-increasing subsequence, `<=` is correct on purpose - just be deliberate about which one you mean.

## Why bother

The `O(n^2)` DP (`dp[i] = max(dp[j] + 1)` for every `j < i`) is simpler to write but falls behind fast:

:::bench{title="LIS variants, n=10000"}
| variant | time |
|---------|------|
| O(n^2) DP | 18ms |
| O(n log n) patience | 4ms |
:::

The patience version turns one of the `n` factors into `log n` - the same win binary search always buys you.

## Run it

Reads `n`, then `n` integers, prints the LIS length. Run it here:

:::playground{title="lis.cpp" lang="cpp"}
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

A run on `10 9 2 5 3 7 101` - the LIS is `2 5 7 101`, length 4:

:::trace{title="lis.cpp run"}
toolchain: 350ms
compile: 80ms
link: 38ms
run: 5ms
stdout: |
  4
:::

## Try it

stdin is `n` then the array:

| stdin | expected stdout |
|-------|-----------------|
| `7` / `10 9 2 5 3 7 101` | `4` |
| `8` / `1 3 2 4 5 8 9 10` | `7` |
| `6` / `1 2 3 4 5 6` | `6` |
| `6` / `6 5 4 3 2 1` | `1` |
| `3` / `2 2 2` | `1` |

That closes the first batch of Runnable Notes - [Quicksort](/blog/quicksort), [Binary Search](/blog/binary-search), and this one. More algorithms land as the series grows.
