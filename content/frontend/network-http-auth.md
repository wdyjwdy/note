---
title: HTTP Authentication Methods
group: Network
toc: true
---

## Cookie

After the user logs in for the first time, the server generates a **Session ID** and writes it into the client's _Cookie_. When the user logs in again, the browser sends the session ID, and the server can determine the user's identity by _comparing_ it.

```seq
Note: first
Client -> Server: visit
Server -> Client: login page
Client -> Server: login
Server -> Client: page, SetCookie=id
Note: second
Client -> Server: visit, Cookie=id
Server -> Client: page
```

This login method has the following drawbacks:

- The server needs to store session IDs.
- Synchronizing session IDs across multiple servers is relatively difficult.
- The session ID is stored in a cookie, making it vulnerable to [XSS](basic-security#xss) and [CSRF](basic-security#csrf) attacks.

## Token

After the user logs in for the first time, the server generates a Token and writes it into the client's _Local Storage_. When the user logs in again, the browser sends the Token, and the server can determine the user's identity by _decrypting_ the token.

```seq
Note: first
Client -> Server: visit
Server -> Client: login page
Client -> Server: login
Server -> Client: page, token
Note: second
Client -> Server: visit, Authorization=token
Server -> Client: page
```

This login method has the following drawbacks:

1. It is difficult to revoke a token.

One solution is to use two tokens. The **Access Token** is used to access resources, while the **Refresh Token** is used to obtain a new access token when the current one expires.

```seq
Client -> Server: login
Server -> Client: AT, RT
Note: AT has expired
Client -> Server: RT
Server -> Client: AT
Note: RT has expired
Client -> Server: login
Server -> Client: AT, RT
```

## SSO

The goal of SSO (Single Sign-On) is: _log in once_ and access everywhere. The **Ticket** serves as the authentication credential and can only be used once.

```seq
Client -> Server: login
Server -> Client: redirect
Client -> SSO: login
SSO -> Client: redirect with Ticket
Client -> Server: Ticket
Server -> SSO: validate Ticket
SSO -> Server: ok
Server -> Client: page, AT
```

## OAuth

The goal of OAuth (Open Authority) is: _login with third-party_ (Google, Github). The reason for using an **authorization code (AC)** to obtain an access token (AT) is to prevent the access token from being exposed to the browser.

```seq
Client -> Server: login with github
Server -> Client: redirect
Client -> Github: login
Github -> Client: redirect with AC
Client -> Server: AC
Server -> Github: AC
Github -> Server: AT
Server -> Github: AT
Github -> Server: user profile
Server -> Client: login success
```
