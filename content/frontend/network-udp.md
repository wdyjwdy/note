---
title: UDP
group: Network
toc: true
---

## Overveiw

1. **UDP is connectionless.** (low latency, broadcast)
2. **UDP has no congestion control.** (high throughput)
3. **UDP is unreliable.**

## Header

```
0               15 16                31
+-----------------+-------------------+
|   Source Port   |  Destination Port |
+-----------------+-------------------+
|      Length     |      Checksum     |
+-----------------+-------------------+
|                                     |
|              data...                |
|                                     |
+-------------------------------------+
```

## Multiplexing

UDP socket is fully identified by `(Destination IP, Destination Port)`. if two UDP segments have different source IP or Port, but have the same destination IP and Port, they will be directed to the same process via the same socket.

## Error Detection

The UDP `Checksum` is used to determine whether bits within the UDP segment have been altered.

> **Why does UDP still need error detection if the link layer already provides error detection?**
>
> - there is no guarantee that all the links provide error checking.
> - bit errors could be introduced when a segment is stored in a router’s memory.
