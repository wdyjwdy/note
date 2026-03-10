---
title: Web Security
group: Basic
toc: true
---

## XSS

The **Cross-Site Scripting** (XSS) injects scripts into a website, and the scripts execute when users visit the site. There are mainly the following types of attacks:

1. **Stored XSS:** For example, if a comment form does not validate input, an attacker can upload a script as a comment. When users view that comment, the script is executed.
2. **Reflected XSS:** For example, an attacker places a script in a URL parameter. When a user clicks the link in an email, the script is executed.

There are the following defenses against XSS:

1. Validate user input to prevent script injection.
2. Use CSP (Content Security Policy) and HttpOnly to prevent script execution.

```color
Content-Security-Policy: script-src 'self'; # Only allow same-origin scripts.
Set-Cookie: HttpOnly # Disallow JS access to cookies.
```

## CSRF

The **Cross-Site Request Forgery** (CSRF) exploits the user's logged-in status to carry out attacks. For example:

1. The user logs in to `bank.com` and leaves a cookie.
2. The user is tricked into visiting `danger.com`.
3. `danger.com` sends a request to `bank.com`, and the browser includes `bank.com`’s cookie.

There are the following defenses against CSRF:

1. Disallow cookies in cross-origin requests.

```
Set-Cookie: SameSite=Strict
```

2. Verify the origin of the request.

```
Origin: https://apple.com
```

3. [CSRF Token](#csrf-token)

## CSRF Token

1. The server sends a token to the client.
2. The client includes this token when submitting a form.
3. Since `danger.com` cannot obtain the token, the request will be rejected by the server.

## SOP

The **Same-Origin Policy** (SOP) is a security policy implemented by _browsers_ that allows a webpage to access only resources from the same origin. The SOP can be bypassed using [CORS](#cors) or a [Proxy](#proxy).

Two URLs are considered of the same origin if they satisfy the following conditions:

1. same Protocol: `https://`
2. same Host: `www.apple.com`
3. same Port: `:80`

The following resources are not restricted by the SOP:

1. **Cross-Origin Embedding**: `<script>`, `<link rel="stylesheet">`, `<img>`, `<video>`, `<audio>`
2. **Cross-Origin Writes**: url link, form submit

The following resources are restricted by the SOP:

1. **Cross-Origin Reads**: fetch, read cookie

## CORS

**Cross-Origin Resource Sharing** (CORS) is a mechanism based on HTTP headers. It allows browsers to access resources from other origins. The server specifies the allowed origins in the response headers.

```color
access-control-allow-origin: * # allow any origin access this response
```

### Simple Request

Simple requests do not require a [preflight request](#preflight-request). A request is considered simple if it meets the following conditions:

1. **Method:** GET, POST, or HEAD
2. **Headers:** Accept, Accept-Language, Content-Language, Content-Type, Range
3. **Content-Type:** text/plain, multipart/form-data, or application/x-www-form-urlencoded

### Preflight Request

For [non-simple requests](#simple-request), a preflight request (using the [OPTIONS](network-http-request#option) method) is sent first to check whether the server allows the request.

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

If the server allows the POST method, the browser will send the POST request.

```seq
Note: Post Request
Client -> Server: OPTION
Server -> Client: Support GET, POST
Client -> Server: POST
Server -> Client: Response
```

If the server does not allow the DELETE method, the browser will not send the DELETE request.

```seq
Note: Delete Request
Client -> Server: OPTION
Server -> Client: Support GET, POST
```

## Proxy

![](basic-security-proxy)

### Forward Proxy

- A forward proxy acts on behalf of the _client_.
- The client sends the request to the proxy server first. The proxy server then requests the target server.
- Example: Shadowsocks

### Reverse Proxy

- A reverse proxy acts on behalf of the _server_.
- The client sends requests to the proxy server. The proxy server forwards them to internal servers.
- Example: NginX
