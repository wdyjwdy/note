---
title: Network Security
group: Network
toc: true
---

## Overview

Secure communication has the following properties:

1. [Confidentiality](#confidentiality): Only the sender and the receiver can understand the message content.
2. [Message integrity](#message-integrity): The message has not been altered.
3. [End-point authentication](#end-point-authentication): The sender and the receiver can authenticate each other.

## Implementation

### Confidentiality

We can ensure confidentiality by using [encryption algorithms](#encryption-algorithms). Alice encrypts the data using a key, and Bob decrypts it with the same key.

- Alice: `c = K(m)`
- Bob: `m = K(c)`

```seq
Alice -> Bob: K(m)
```

A drawback of symmetric encryption is that the two parties must somehow _agree on a shared key_. But to do so in itself requires secure communication. Public-key Encryption solves this problem. It uses a public key for encryption and a private key for decryption.

- Alice: `c = Kb+(m)`
- Bob: `m = Kb-(c)`

```seq
Alice -> Bob: Kb+(m)
```

Because public-key encryption is _computationally expensive_, it is typically used together with symmetric encryption. First, a symmetric **session key** is exchanged using public-key encryption, and then the actual communication is encrypted using symmetric encryption.

- Alice: `s = Kb+(Ks)`, `c = Ks(m)`
- Bob: `Ks = Kb-(s)`, `m = Ks(c)`

```seq
Alice -> Bob: Kb+(Ks), Ks(m)
```

### Message Integrity

Although [confidentiality](#confidentiality) is ensured, it does not guarantee that the message has not _been tampered with_. We can use [hash function](#hash-functions) to ensure message integrity. Alice sends the message along with its hash value. Bob computes the hash of the message and checks whether it matches.

- Alice: `h = H(m)`
- Bob: `h = H(m)`

```seq
Alice -> Bob: m, H(m)
```

### End-point Authentication

Although [confidentiality](#confidentiality) and [message integrity](#message-integrity) are ensured, the sender of the message cannot be verified. We can achieve end-point authentication using **digital signatures**. Alice signs the message using its private key. Bob uses Alice's public key to decrypt and verifies whether it matches. Therefore, digital signatures are _verifiable and nonforgeable_.

- Alice: `ds = Ka-(m)`
- Bob: `m = Ka+(ds)`

```seq
Alice -> Bob: m, Ka-(m)
```

Signing the entire message is computationally expensive. The solution is to use a message digest to create the signature.

- Alice: `h = H(m)`, `ds = Ka-(h)`
- Bob: `h = H(m)`, `h = Ka+(ds)`,

```seq
Alice -> Bob: m, Ka-(H(m))
```

The last problem is: how to prove that a public key belongs to Alice. Binding a public key to a particular entity is typically done by a **Certification Authority (CA)**, whose job is to validate identities and issue certificates.

- CA: `ca = Kca-(Ka+, 'Alice')`
- Bob: `Ka+ = Kca+(ca)`

> **How can the CA's public key be verified?**
>
> The CA's public key is pre-installed in the operating system or browser.

How can Bob determine that Alice is live rather than a replay attack? The solution is to use a **nonce** (a random number).

```seq
Alice -> Bob: hello
Bob -> Alice: R
Alice -> Bob: m, K(R)
```

## Encryption Algorithms

**Symmetric Encryption** uses the same key for both encryption and decryption. (two parties must somehow agree on a shared key.)

- Alice: `c = K(m)`
- Bob: `m = K(c)`

**Public-key Encryption** uses a public key (known to everyone) for encryption and a private key (known only to the receiver) for decryption.

- Alice: `c = K+(m)`
- Bob: `m = K-(c)`

Private keys can also be used for encryption, with public keys used for decryption.

- Alice: `c = K-(m)`
- Bob: `m = K+(c)`

Common symmetric encryption algorithms include [DES](#DES) and [AES](#AES), while [RSA](#rsa) is a public-key encryption algorithm.

### Block Ciphers

In a block cipher, the message to be encrypted is processed in blocks of k bits, and each block is encrypted independently.

- **Substitution**: Replace the input with another value. (Perform one-to-one mapping using a mapping table.)
- **Permutation**: Rearrange the positions of the bits.
- **Loop**: Feed the output back into the input. (To make each input bit affect most of the final output bits.)

![](network-security-block-cipher)

> **Why divide the data into blocks?**
>
> Because without blocking, the mapping table maintained by the user would be very large.

### DES

@TODO: DES

### AES

@TODO: AES

### RSA

The key generation process is as follows.

1. Choose two large prime numbers `p = 3` and `q = 11`.
2. Compute `n = pq = 33` and `z = (p - 1)(q - 1) = 20`.
3. Choose a number `e = 3` less than `n` such that `e` and `z` are coprime.
4. Choose a number `d = 7` such that `ed mod z = 1`.
5. Finally, the public key is `(n, e)` and the private key is `(n, d)`.

The encryption and decryption steps are as follows. where `m` denotes the plaintext and `c` denotes the ciphertext.

```
c = m^e mod n = 13^3 mod 33 = 19
m = c^d mod n = 19^7 mod 33 = 13
```

The security of RSA relies on the fact that there are no known algorithms for
quickly factoring a number, in this case the public value `n`, into the primes `p` and `q`.

## Key Exchange Algorithms

Used to exchange the session key in symmetric encryption.

### RSA

The key exchange process is as follows:

- Alice: Generate the key and encrypt. `s = Kb+(K)`
- Bob: Decrypt the message to retrieve the key. `K = Kb-(s)`

```seq
Alice -> Bob: hello
Bob -> Alice: Kb+
Alice -> Bob: Kb+(K)
```

### DH

The key exchange process is as follows:

- Alice: `p = 7`, `g = 3`, private key `a = 10`, public key `A = g^a mod p = 4`.
- Bob: private key `b = 20`, public key `B = g^b mod p = 2`.
- Finally, Alice computes the shared key `K = B^a mod p = 2`, Bob computes the shared key `K = A^b mod p = 2`.

```seq
Alice -> Bob: p, g, A
Bob -> Alice: B
```

## Hash Functions

A hash function converts an input into a _fixed-length_ output, and it is difficult to find two different inputs that produce the same hash value. Common hash algorithms include [MD5](#md5) and [SHA-1](#sha-1).

### MD5

1. **Padding**: Pad the input to a multiple of 512 bits, with the last 64 bits storing the original message length.
2. **Block Processing**: Divide the input into 512-bit blocks, and further split each block into 32-bit words.
3. **Initialize Buffer**: Initialize with default values.
4. **Loop**: Mix each 32-bit input with the default values.
5. **Output**: Produce the final 128-bit output.

![](network-security-md5)

### SHA-1

SHA-1 has a 160 bit output length, which is longer than [MD5](#md5). It is slower than MD5 but more secure.
