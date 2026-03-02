---
title: TCP
group: Network
toc: true
---

## Overveiw

- TCP is connection-oriented.
- TCP is full-duplex.
- TCP is point-to-point (broadcast is not possible).

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
|        |             |U|A|P|R|S|F|                                   |
| Offset |   Unused    |R|C|S|S|Y|I|               Window              |
|        |             |G|K|H|T|N|N|                                   |
+--------+-------------+-+-+-+-+-+-+-----------------------------------+
|            Checksum              |          Urgent Pointer           |
+----------------------------------+-----------------------------------+
|                               Options                                |
+----------------------------------------------------------------------+
|                                                                      |
|                               data...                                |
|                                                                      |
+----------------------------------------------------------------------+
```

### Sequence Numbers

TCP views data as stream of bytes. The sequence number for a segment is therefore the byte-stream number of the first byte in the segment.

![](network-tcp-sequence-number)

Suppose that the file consisting of 500000 bytes, that the MSS (Maximum Segment Size) is 1000 bytes.

- segment 1 gets assigned sequence number 0
- segment 2 gets assigned sequence number 1000
- segment 500 gets assigned sequence number 499000

> We assumed that the initial sequence number was zero. In truth, both sides of a TCP connection randomly choose an initial sequence number. This is done to minimize the possibility that a segment that is still present in the network from an earlier, already-terminated connection.

### Acknowledgment Numbers

The acknowledgment number is the sequence number of the next byte expected to be received.

```seq
Sender -> Receiver: seq=535
Receiver -> Sender: ack=536
```

Suppose that Receiver has received all bytes numbered 0 through 535. Then Receiver puts 536 in the acknowledgment number field.

## Multiplexing

TCP socket is fully identified by `(source IP, source Port, destination IP, destination Port)`. if two TCP segments have different source IP or Port, they will be directed to two different sockets.

## Reliable Data Transfer

### ARQ (Automatic Repeat reQuest)

Assume that the network layer satisfies the following conditions:

- ✅ no packet loss
- ❌ bit errors may occur

To achieve reliable data transmission, a protocol needs to provide the following capabilities:

1. **Error Detection**: the receiver can detect bit errors. ([Checksum field](#header))
2. **Receiver Feedback**: the receiver can provide feedback to the sender. ([Acknowledgment Number field](#header))
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

4. **Packet Number**: the sender can assign a number to each packet. ([Sequence Number field](#header))

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

6. **Packet Number**: The range of sequence numbers must be increased, since each in-transit packet must have a unique sequence number. ([Sequence Number field](#header))
7. **Buffer**: The sender and receiver sides may have to buffer more than one packet. The sender needs to buffer unacknowledged packets, and the receiver needs to buffer out-of-order packets. ([Window field](#header))

There are two common pipelined protocols: [GBN](#go-back-n-(gbn)) and [SR](#selective-repeat-(sr)).

### Go-Back-N (GBN)

GBN is a [pipelined](#pipelining) protocol, but it limits the maximum number of packets in the pipeline to _window size_.

![](network-tcp-gbn)

- **Sender**: When the packet with SEQ = N is unacknowledged or timeout, retransmit packet N and all subsequent packets. When the first packet in the window is acknowledged, the window slides to the right.
- **Receiver**: Receives in-order packets and discards out-of-order packets.

```seq
Note: Packet Loss
Sender -> Receiver: seq=0, checksum, data
Sender -> Receiver: seq=1, checksum, data
Receiver -> Sender: ack=0, checksum
Note: Retansmit
Sender -> Receiver: seq=0, checksum, data
Sender -> Receiver: seq=1, checksum, data
```

### Selective Repeat (SR)

A single packet error can thus cause [GBN](#go-back-n-(gbn)) to retransmit a large number of packets. The SR protocol avoids unnecessary retransmissions by retransmitting _only lost or corrupted_ packets.

![](network-tcp-sr)

- **Sender**: When the packet with SEQ = N is unacknowledged or timeout, retransmit only packet N.
- **Receiver**: Receives in-order packets and discards out-of-order packets. When the first packet in the window is received, slide the window to the right.

```seq
Note: Packet Loss
Sender -> Receiver: seq=0, checksum, data
Sender -> Receiver: seq=1, checksum, data
Receiver -> Sender: ack=1, checksum
Note: Retansmit
Sender -> Receiver: seq=0, checksum, data
Receiver -> Sender: ack=0, checksum
```

> **Sequence Number Ambiguity**
>
> - Ambiguity occurs when the tail of the receiving window overlaps with the head of the sending window. The solution is to keep the window size less than half of the sequence number space.
> - Ambiguity occurs when a delayed packet arrives. The solution is for the sender to ensure that a packet with sequence number N is no longer in the pipeline (by relying on the packet’s maximum lifetime, about 3 minutes).

### TCP Connection

Establishing a TCP connection requires a **three-way handshake** to synchronize TCP parameters.

1. Initialize parameters `client_seq_num`.
2. Initialize parameters `server_seq_num` and `server_buffer_size`.
3. Initialize parameters `client_buffer_size`. (_Can carry data._)

```seq
Client -> Server: syn=1, seq=x
Server -> Client: syn=1, seq=y, ack=x+1
Client -> Server: syn=0, seq=x+1, ack=y+1
```

> **Why not two-way handshake?**
>
> 1. It cannot guarantee that the sender has the ability to receive data.
> 2. An delayed SYN segment may also establish a connection.

> **What happens if handshake packets are lost?**
>
> 1. Handshake 1 lost: Client retransmit.
> 2. Handshake 2 lost: Client retransmit.
> 3. Handshake 3 lost: Server retransmit.

Closing a TCP connection requires a **four-way handshake**.

```seq
Client -> Server: fin=1, seq=x
Server -> Client: fin=1, seq=y, ack=x+1
Server -> Client: fin=1, seq=y, ack=x+1
Client -> Server: fin=0, seq=x+1, ack=y+1
```

> **Why not three-way handshake?**
>
> 1. If the server has no data to send, the second and third handshake messages can be combined.

> **What happens if handshake packets are lost?**
>
> 1. Handshake 1 lost: Client retransmit.
> 2. Handshake 2 lost: Client retransmit.
> 3. Handshake 3 lost: Server retransmit.
> 4. Handshake 4 lost: Server retransmit. (Therefore, after sending the ACK, the client needs to wait for about one minute to allow for ACK retransmission.)

### TCP Fast Retransmit

Timeout-based retransmission may be too slow. The solution is to retransmit when _three duplicate ACKs_ are received.

```seq
Note: Packet Loss
Sender -> Receiver: seq=100
Sender -> Receiver: seq=120
Sender -> Receiver: seq=140
Sender -> Receiver: seq=160
Receiver -> Sender: ack=100
Receiver -> Sender: ack=100
Receiver -> Sender: ack=100
Note: Retansmit
Sender -> Receiver: seq=100
```

### TCP Flow Control

TCP uses flow control to ensure that data does not overflow the buffer.

- **Sender**: Ensure that the amount of sent but unacknowledged data is less than the `receive window` size.
- **Receiver**: The `receive window` size is sent to the sender through the [Window field](#header).

![](network-tcp-flow-control)

When the `receive window = 0`, the sender stops sending data. As a result, the window size cannot be updated, and no subsequent data can be transmitted. The solution is that when the `receive window = 0`, the sender continues to send one byte of data.
