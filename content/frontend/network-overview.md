---
title: An Overview of Computer Networks
group: Network
toc: true
---

## Transport Layer

- **Services**: A transport-layer protocol provides for logical communication between application _processes_ running on different hosts.
- **Locations**: Host.
- **Protocols**: UDP, TCP.

![](network-overview-transport-layer)

### Multiplexing

Extending the host-to-host delivery service provided by the network layer to a process-to-process delivery service.

- **multiplexing**: gathering data from different sockets, and passing the segments to the network layer.
- **demultiplexing**: delivering the data in segment to the correct socket.

![](network-overview-multiplexing)
