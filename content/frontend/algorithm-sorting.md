---
title: Sorting
group: Algorithm
toc: true
---

| Name           | Time     | Space | Compares | Exchanges | Stability |
| -------------- | -------- | ----- | -------- | --------- | --------- |
| Selection Sort | N**2     | 1     | N(N-1)/2 | N         | ❌        |
| Insertion Sort | N**2     | 1     | N(N-1)/2 | N(N-1)/2  | ✅        |
| Shell Sort     | N**(3/2) | 1     |          |           | ❌        |
| Quick Sort     | NlgN     | 1     | 2*NlnN   | NlnN/3    | ❌        |

## Selection Sort

1. Swap the smallest element in `[0, n-1]` with `[0]`.
2. Swap the smallest element in `[1, n-1]` with `[1]`.
3. ...
4. Swap the smallest element in `[n-1, n-1]` with `[n-1]`.

> Data movement is minimal (only N exchanges).

## Insertion Sort

1. Insert element `[1]` into `[0, 1]`.
2. Insert element `[2]` into `[0, 2]`.
3. ...
4. Insert element `[n-1]` into `[0, n-1]`.

> Fastest when the array is nearly sorted.

## Shell Sort

1. H-Sorting
2. Insertion Sort

## Merge Sort

1. Partition: break the array into two subarrays to be sorted
2. Merge: combine the ordered subarrays

## Quick Sort

> Improvements
>
> - Switch to insertion sort for tiny subarrays.
> - Use `median(l,m,h)` as the partitioning item.
> - Skip subarrays with same items.
