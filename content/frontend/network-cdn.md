---
title: CDN
group: Network
toc: true
---

## Overview

CDN reduces the distance between the user and the assets.

![](network-cdn)

## Lookup

```seq
Client -> Local: Domain Name
Local -> DNS Auth: Domain Name
DNS Auth -> Local: CDN Auth IP
Local -> CDN Auth: Domain Name
CDN Auth -> Local: IP
Local -> Client: IP
```

## Servers

| Type                     | Description                          |
| ------------------------ | ------------------------------------ |
| CDN Authoritative Server | Domain Name -> CDN Content Server IP |
| CDN Content Server       | Stores copies of the Web content     |

## Cluster Selection Strategies

1. **Geographically Closest**: select the CDN cluster that is closest to the user's location based on their IP address.
2. **RTT Closest**: select the CDN cluster that has the lowest round-trip time to the user's location.

## Cache Update

If the CDN does not storing the assets or the assets are expired, then the assets needs to be updated.

1. **Push Caching**: Manually push the assets to the origin server, then propagate to other CDN.
2. **[Pull Caching](network-http#web-caching)**: CDN automatically pull the assets from the origin server (or another CDN cluster).

> **Canary Deployment**
>
> allows a small percentage of users to access the updated content, thus updating the CDN cache.

## Appendix

### How to avoid DNS redirection?

App directly tells the client to use a particular CDN server.
