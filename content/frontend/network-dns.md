---
title: DNS
group: Network
toc: true
---

DNS translates hostnames to IP addresses.

## Lookup

```seq
Client -> Local: Domain Name
Local -> Root: Domain Name
Root -> Local: TLD IP
Local -> TLD: Domain Name
TLD -> Local: Auth IP
Local -> Auth: Domain Name
Auth -> Local: IP
Local -> Client: IP
```

## Caching

In a query chain, when a DNS server receives a DNS reply, it can cache the mapping in its local memory.

1. Operating System
2. Browser
3. DNS Servers

## Servers

| Type                          | Description                   | Example   |
| ----------------------------- | ----------------------------- | --------- |
| Local DNS Server              | Proxy Query                   |           |
| Root DNS Server               | Domain Name -> TLD Server IP  |           |
| Top-level Domain (TLD) Server | Domain Name -> Auth Server IP | com       |
| Authoritative DNS Server      | Domain Name -> IP             | apple.com |

## Records

| Type  | Description                           | Example                            |
| ----- | ------------------------------------- | ---------------------------------- |
| A     | Domain Name -> IPv4                   | `(apple.com, 1.2.3.4, A)`          |
| CNAME | Domain Name Alias -> Domain Name      | `(apple.cn, apple.com.cn, CNAME)`  |
| NS    | Domain Name -> DNS Server Domain Name | `(apple.com, dns.com, NS)`         |
| AAAA  | Domain Name -> IPv6                   |                                    |
| MX    | Domain Name Alias -> Domain Name      | `(apple.com, mail.icloud.com, MX)` |

> **If TLD returns only the domain, how do Local server kown its IP?**
>
> TLD returns a Glue Record: is a type of DNS record that associates a nameserver's hostname with its IP address

## Hijacking

DNS server cached records are tampered with, resulting in an incorrect IP address being returned.

![](network-dns-hijacking)

**Types**

- router hijacking
- local server hijacking

**Usage**

- Block a specific domain name (Great Firewall)
- Redeirect to a particular IP

**Defense**

- changing router passwords
- using VPN
- using Google DNS

## Load Balancing

DNS load balancing uses the DNS to distribute site traffic across several servers

**Round-Robin DNS**: The server cyclically returns IP addresses in different orders
![](network-dns-load-balancing)

## Appendix

### Why does DNS use UDP?

- Speed: UDP is connectionless
- Simplicity: UDP has a simple protocol structure

> When the data exceeds 512 Bytes, use TCP.

### Localhost vs 127.0.0.1

- `127.0.0.1` is a IP address.
- `localhost` is a hostname, requires DNS to obtain its IP address.

```
# /etc/hosts
127.0.0.1	localhost
```

### How to obtain root server IP address?

Built into the operating system.
