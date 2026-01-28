---
title: Sorting
group: Algorithm
toc: true
---

## Selection Sort

|         | Time | Space | Compares | Exchanges |
| ------- | ---- | ----- | -------- | --------- |
| Worst   | NN   | 1     | NN/2     | N         |
| Best    | NN   | 1     | NN/2     | N         |
| Average | NN   | 1     | NN/2     | N         |

1. Swap the smallest element in `[0..n-1]` with `[0]`.
2. Swap the smallest element in `[1..n-1]` with `[1]`.
3. ...
4. Swap the smallest element in `[n-1..n-1]` with `[n-1]`.

> Data movement is minimal (only N exchanges).

## Insertion Sort

|         | Time | Space | Compares | Exchanges |
| ------- | ---- | ----- | -------- | --------- |
| Worst   | NN   | 1     | NN/2     | NN/2      |
| Best    | N    | 1     | N        | 0         |
| Average | NN   | 1     | NN/4     | NN/4      |

1. Insert element `[1]` into `[0..1]`.
2. Insert element `[2]` into `[0..2]`.
3. ...
4. Insert element `[n-1]` into `[0..n-1]`.

> Fastest when the array is nearly sorted.

## Shell Sort

|         | Time   | Space | Compares | Exchanges |
| ------- | ------ | ----- | -------- | --------- |
| Worst   | NN     | 1     | NN       | NN        |
| Best    | NlgN   | 1     | NlgN     | 0         |
| Average | N**1.5 | 1     | N**1.5   | N**1.5    |

1. H-Sorting
2. Insertion Sort

## Merge Sort

|         | Time | Space | Compares | Accesses |
| ------- | ---- | ----- | -------- | -------- |
| Worst   | NlgN | N     | NlgN     | 6NlgN    |
| Best    | NlgN | N     | NlgN/2   | 6NlgN    |
| Average | NlgN | N     |          | 6NlgN    |

1. Recursive
2. Merge

## Quick Sort

|         | Time | Space | Compares | Exchanges |
| ------- | ---- | ----- | -------- | --------- |
| Worst   | NN   | N     | NN/2     | N/6       |
| Best    | NlgN | N     | NlgN     | NlgN/2    |
| Average | NlgN | N     | 1.4NlgN  | NlgN/3    |

1. Partition
2. Recursive

> Improvements
>
> - Switch to insertion sort for tiny subarrays.
> - Use `median(l,m,h)` as the partitioning item.
> - Skip subarrays with same items.
