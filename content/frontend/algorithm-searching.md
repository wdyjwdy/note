---
title: Searching
group: Algorithm
toc: true
---

## Sequential Search

|      | Search | Insert | Insert N |
| ---- | ------ | ------ | -------- |
| Time | N      | N      | NN       |

## Binary Search

|      | Search | Insert | Insert N |
| ---- | ------ | ------ | -------- |
| Time | lgN    | NlgN   | NN       |

## Binary Search Tree

|      | Search | Insert | Insert N |
| ---- | ------ | ------ | -------- |
| Time | lgN    | lgN    | NlgN     |

## Hash Tables

|      | Search | Insert | Insert N |
| ---- | ------ | ------ | -------- |
| Time | M      | M      | NM       |

1. **Hash Function**: transforms the search key into an array index.
2. **Collision Resolution**: different keys may hash to the same array index.
   - separate chaining
   - linear probing

separate chaining uses a small block of memory for each key-value pair, while linear probing uses two large arrays for the whole table.
