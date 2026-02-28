---
title: TCP
group: Network
toc: true
---

## Overveiw

## Header

```
0                                15 16                                31
+----------------------------------+-----------------------------------+
|           Source Port            |         Destination Port          |
+----------------------------------+-----------------------------------+
|                          Sequence Number                             |
+----------------------------------------------------------------------+
|                       Acknowledgment Number                          |
+--------+-------------+-+-+-+-+-+-+-----------------------------------+
|  Data  |             |U|A|P|R|S|F|                                   |
| Offset |  Reserved   |R|C|S|S|Y|I|               Window              |
|        |             |G|K|H|T|N|N|                                   |
+--------+-------------+-+-+-+-+-+-+-----------------------------------+
|            Checksum              |          Urgent Pointer           |
+----------------------------------+-------------+---------------------+
|                    Options                     |       Padding       |
+------------------------------------------------+---------------------+
|                                                                      |
|                               data...                                |
|                                                                      |
+----------------------------------------------------------------------+
```

## Multiplexing

TCP socket is fully identified by `(source IP, source Port, destination IP, destination Port)`. if two TCP segments have different source IP or Port, they will be directed to two different sockets.

## Reliable Data Transfer

### ARQ (Automatic Repeat reQuest)

Assume that the network layer satisfies the following conditions:

- ✅ no packet loss
- ❌ bit errors may occur
- ✅ can accept packets sent at any rate

To achieve reliable data transmission, a protocol needs to provide the following capabilities:

1. **Error Detection**: the receiver can detect bit errors. (`Checksum`)
2. **Receiver Feedback**: the receiver can provide feedback to the sender. (`Acknowledgment Number`)
3. **Retransmission**: the sender can retransmit packet to the receiver.

When the receiver receives a corrupted packet, it returns ACK = 0. Then the sender will retransmit the packet.

```seq
Note: Corrupted Packet
Sender -> Receiver: data, checksum
Receiver -> Sender: ack=0
Note: Retansmit Packet
Sender -> Receiver: data, checksum
Receiver -> Sender: ack=1
```

The above protocol has a drawback: ACK packets may be corrupted. We need to add a new capability:

4. **Packet Number**: the sender can assign a number to each packet. (`Sequence Number`)

When the sender receives a corrupted ACK packet, it retransmits the packet directly, and the receiver uses the sequence number to _avoid accepting duplicate packets_.

```seq
Sender -> Receiver: seq=0, checksum, data
Note: Corrupted ACK Packet
Receiver -> Sender: ack=1, checksum
Note: Retansmit Packet
Sender -> Receiver: seq=0, checksum, data
Receiver -> Sender: ack=1, checksum
```

We can accomplish the same effect as a ACK = 0 if, instead of sending a ACK = 0, we send an ACK = SEQ (last correctly received packet). A sender that receives two _duplicate ACKs_ for the same packet knows that the receiver did not correctly receive the packet.

```seq
Note: Corrupted Packet
Sender -> Receiver: seq=0, checksum, data
Note: Duplicate ACK Packet
Receiver -> Sender: ack=1, checksum
Note: Retansmit Packet
Sender -> Receiver: seq=0, checksum, data
Receiver -> Sender: ack=0, checksum
```

Assume that the network layer satisfies the following conditions:

- ❌ packet loss may occur
- ❌ bit errors may occur
- ✅ can accept packets sent at any rate

We need to add a new capability to solve the packet loss problem:

5. **Timer**: the sender can set a timer for each packet.

Whether the data packet is lost or the ACK packet is lost, the sender will not receive the ACK. After waiting for 2 RTTs, the sender will retransmit the packet. When the ACK packet is received, the sender stops the timer. (Therefore, a late packet will not result in duplicate data packet.)

```seq
Note: Packet Loss
Sender -> Receiver: seq=0, checksum, data
Note: Retansmit Packet After 2RTTs
Sender -> Receiver: seq=0, checksum, data
Receiver -> Sender: ack=0, checksum
Sender -> Receiver: seq=1, checksum, data
Note: ACK Packet Loss
Receiver -> Sender: ack=1, checksum
Note: Retansmit Packet After 2RTTs
Sender -> Receiver: seq=1, checksum, data
Receiver -> Sender: ack=1, checksum
```

### Pipelining

[ARQ](#arq-(automatic-repeat-request)) is a **stop-and-wait** protocol, meaning the sender must receive an ACK before sending the next packet. Therefore, the performance of ARQ is poor. The solution is simple: allow the sender to transmit multiple packets without waiting for ACKs. This technique is called **pipelining**.

![](network-tcp-pipelining)

To implement pipelining, the protocol needs to be further enhanced:

6. **Packet Number**: The range of sequence numbers must be increased, since each in-transit packet must have a unique sequence number. (`Sequence Number`)
7. **Buffer**: The sender and receiver sides may have to buffer more than one packet. The sender needs to buffer unacknowledged packets, and the receiver needs to buffer out-of-order packets. (`Window`)

There are two common pipelined protocols: [GBN](#go-back-n-(gbn)) and [SR](#selective-repeat-(sr)).

### Go-Back-N (GBN)

### Selective Repeat (SR)
