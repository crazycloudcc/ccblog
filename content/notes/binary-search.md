---
title: Binary Search in C++
excerpt: "Find a value in a sorted array - the loop invariant, the mid-update trap, and a live run in the browser."
date: 2026-08-05
coverLabel: rn-02
tags:
  - algorithm
  - cpp
  - playground
  - searching
series: "Runnable Notes"
difficulty: beginner
lang: en
---

Part two of **Runnable Notes** - snippets that run in the browser. **Binary search** finds a value in a sorted array in `O(log n)`: keep a window `[lo, hi]`, test the middle, throw away the half that cannot contain the target, repeat until the window is empty or you hit it.

## The loop

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
- line 4: invariant - if target is present, it lies in [lo, hi]; the loop ends when the range empties
- line 5: overflow-safe midpoint - (lo + hi) / 2 can overflow for huge indices
- line 8: target is larger than mid, so discard the left half including mid
- line 10: target is smaller, discard the right half including mid
- line 14: range emptied - target is absent
:::

The array must be sorted - that is the precondition that makes discarding a half safe.

## The mid-update trap

The single most common binary-search bug is not excluding `mid` when narrowing. Use `lo = mid` instead of `lo = mid + 1` and, when the target sits in the upper half of a two-element window, `lo` never advances - the loop never terminates and the playground kills it after 5 seconds:

:::cases{title="Narrowing the window"}
### good
```cpp
lo = mid + 1;   // mid was tested: skip past it
hi = mid - 1;
```
### bad
```cpp
lo = mid;       // can stall -> infinite loop -> 5s timeout
hi = mid;
```
:::

Always shrink strictly past the element you just tested.

## Run it

The program reads `n`, then `n` sorted integers, then a `target`, and prints the index (0-based) or `-1`. Run it here:

:::playground{title="bsearch.cpp" lang="cpp"}
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

A run on a 5-element array, searching for `5`:

:::trace{title="bsearch.cpp run"}
toolchain: 360ms
compile: 70ms
link: 35ms
run: 5ms
stdout: |
  2
:::

## Try it

stdin is `n`, then the array, then the target:

| stdin | expected stdout |
|-------|-----------------|
| `5` / `1 3 5 7 9` / `5` | `2` |
| `5` / `1 3 5 7 9` / `1` | `0` |
| `5` / `1 3 5 7 9` / `9` | `4` |
| `5` / `1 3 5 7 9` / `6` | `-1` |
| `1` / `5` / `5` | `0` |

Next in the series: **Longest Increasing Subsequence** - from `O(n^2)` DP to the `O(n log n)` patience variant.
