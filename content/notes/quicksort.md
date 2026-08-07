---
title: Quicksort in C++
excerpt: "Sort an array with quicksort - partition, recurse, and run it live in the browser playground."
date: 2026-08-04
coverLabel: rn-01
tags:
  - algorithm
  - cpp
  - playground
  - sorting
series: "Runnable Notes"
difficulty: intermediate
lang: en
---

This is the first of the **Runnable Notes** - short algorithm write-ups where every snippet actually runs in your browser. No copy-paste into an IDE: hit run, feed it stdin, read the output.

**Quicksort** sorts in-place by picking a pivot, partitioning the array into values smaller and larger, then recursing on each side. Average `O(n log n)`, worst case `O(n^2)`.

## The partition step

Everything interesting happens in `partition` - pick a pivot, sweep the range, and end with the pivot in its final sorted position:

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
- line 2: pick the last element as the pivot
- line 3: i tracks the boundary of values <= pivot; start one below lo
- line 4: scan every element except the pivot itself
- line 5: this value belongs on the left side
- line 6: grow the boundary, then swap the value into it
- line 10: move the pivot to just after the last small value
- line 11: its index is the split point for recursion
:::

After `partition` returns `p`, everything at indices `<= p` is `<= pivot` and the pivot itself is fixed. Recurse on `[lo, p-1]` and `[p+1, hi]` until the range is empty.

## Pivot choice matters

The pivot decides how balanced the recursion is. Picking the last element (above) is simple and correct, but the classic trap is picking the first element on already-sorted input - one side is empty every time, and you recurse `n` deep:

:::cases{title="Pivot choice"}
### good
```cpp
int pivot = a[hi];   // last element: balanced on random input
```
### bad
```cpp
int pivot = a[lo];   // first element: O(n^2) on sorted input
```
:::

For random data the choice barely matters. For hostile or nearly-sorted data, randomize the pivot or use median-of-three.

## Run it

The full program reads `n`, then `n` integers, and prints them sorted. It runs right here - edit the code, change the stdin, hit run:

:::playground{title="quicksort.cpp" lang="cpp"}
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

A run looks like this - the four compile phases, then the sorted output on stdout:

:::trace{title="quicksort.cpp run"}
toolchain: 380ms
compile: 90ms
link: 40ms
run: 6ms
stdout: |
  1 1 3 4 5
:::

## Try it

Paste into the stdin box and run:

| stdin | expected stdout |
|-------|-----------------|
| `5` then `3 1 4 1 5` | `1 1 3 4 5` |
| `6` then `6 5 4 3 2 1` | `1 2 3 4 5 6` |
| `4` then `2 2 2 2` | `2 2 2 2` |

The first run is slower - that is the one-time WASM toolchain fetch. After that, runs drop to tens of milliseconds.

Next in the series: **Binary Search** - the divide-and-conquer counterpart, where the pivot choice is fixed and the trap is off-by-one.
