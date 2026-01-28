---
title: Data Structure
group: Algorithm
toc: true
---

## Array

|             | Array |
| ----------- | ----- |
| insertFirst | O(n)  |
| insertLast  | O(1)  |
| removeFirst | O(n)  |
| removeLast  | O(1)  |

## Linked List

|             | Singly Linked List | Doubly Linked List |
| ----------- | ------------------ | ------------------ |
| insertFirst | O(1)               | O(1)               |
| insertLast  | O(1)               | O(1)               |
| removeFirst | O(1)               | O(1)               |
| removeLast  | O(n)               | O(1)               |

## Bag

A bag is a collection where removing items is not supported. The order is immaterial.

|     | Bag (Array) | Bag (Singly Linked List) |
| --- | ----------- | ------------------------ |
| add | O(1)        | O(1)                     |

## Stack

A stack is a collection that is based on the last-in-first-out (LIFO) policy.

|      | Stack (Array) | Stack (Singly Linked List) |
| ---- | ------------- | -------------------------- |
| push | O(1)          | O(1)                       |
| pop  | O(1)          | O(1)                       |

## Queue

A queue is a collection that is based on the first-in-first-out (FIFO) policy.

|         | Queue (Array) | Queue (Singly Linked List) |
| ------- | ------------- | -------------------------- |
| enqueue | O(1)          | O(1)                       |
| dequeue | O(n)          | O(1)                       |
