---
title: DNS
category: Network
---

## Lookup

```mermaid
sequenceDiagram
  Client ->> Local: Domain Name
  Local ->> Root: Domain Name
  Root ->> Local: TLD Server IP
  Local ->> TLD: Domain Name
  TLD ->> Local: Auth Server IP
  Local ->> Auth: Domain Name
  Auth ->> Local: IP
  Local ->> Client: IP
```
