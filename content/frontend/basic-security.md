---
title: Web Security
group: Basic
toc: true
---

## Cross-Site Scripting (XSS)

XSS injects scripts into a website, and the scripts execute when users visit the site. There are mainly the following types of attacks:

1. **Stored XSS:** For example, if a comment form does not validate input, an attacker can upload a script as a comment. When users view that comment, the script is executed.
2. **Reflected XSS:** For example, an attacker places a script in a URL parameter. When a user clicks the link in an email, the script is executed.

There are the following defenses against XSS:

1. Validate user input to prevent script injection.
2. Use CSP (Content Security Policy) and HttpOnly to prevent script execution.

```color
Content-Security-Policy: script-src 'self'; # Only allow same-origin scripts.
Set-Cookie: HttpOnly # Disallow JS access to cookies.
```

## Cross-Site Request Forgery (CSRF)

CSRF exploits the user's logged-in status to carry out attacks. For example:

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

### CSRF Token

1. The server sends a token to the client.
2. The client includes this token when submitting a form.
3. Since `danger.com` cannot obtain the token, the request will be rejected by the server.
