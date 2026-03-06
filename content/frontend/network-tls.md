---
title: TLS
group: Network
toc: true
---

## Overview

TLS provides secure communication over TCP. While it is commonly used by HTTP, it can also be employed by other application-layer protocols. TLS has three phases:

- [handshake](#handshake)
- [key derivation](#key-derivation)
- [data transfer](#data-transfer)

## Record

```
0       7 8             23 24             39
+--------+----------------+----------------+
|  Type  |    Version     |     Length     |
+--------+----------------+----------------+
|                Data + HMAC               |
+--------+----------------+----------------+
```

## Handshake

1. Alice sends a hello message.
2. Bob sends back his certificate.
3. Alice retrieves the public key from the certificate and encrypts the Master Secret (MS) with it.
4. Bob decrypts it to obtain the MS.

```seq
Note: TCP Handshake
Alice -> Bob: syn
Bob -> Alice: syn
Note: TLS Handshake
Alice -> Bob: hello
Bob -> Alice: certificate
Alice -> Bob: encrypted MS
```

## Key Derivation

In principle, the MS, now shared by Bob and Alice, could be used as the symmetric session key for all subsequent encryption and data integrity checking. It is, however, generally considered safer for Alice and Bob to each use different cryptographic keys, and also to use different keys for encryption and integrity checking.

Thus, both Alice and Bob use the MS to generate four keys:

- `Eb`: session encryption key for data sent from Bob to Alice.
- `Mb`: session HMAC key for data sent from Bob to Alice.
- `Ea`: session encryption key for data sent from Alice to Bob.
- `Ma`: session HMAC key for data sent from Alice to Bob.

## Data Transfer

If integrity were checked only after the entire data transfer, the receiver would need to store all the data. Hence, TLS breaks the data stream into [records](#record), appends an [HMAC](network-security#mac) to each record for integrity checking, and then encrypts the record and HMAC.
