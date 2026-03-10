---
title: HTTP Request Methods
group: Network
toc: true
---

## Get

The GET method is used to request data from the server. GET parameters are placed in the _URL_.

```
GET /weather?city=tokyo HTTP/1.1
Host: api.example.com
```

GET method parameters are sent during the handshake.

```seq
Note: TCP Handshake
Client -> Server: 1
Server -> Client: 2
Client -> Server: 3, header
Server -> Client: 200 OK
```

## Post

The POST method is used to send data to the server. POST parameters are placed in the _request body_.

```
POST /weatther HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
  "city": "tokyo"
}
```

POST method parameters are sent after the handshake. `100 Continue` is used to avoid wasting bandwidth (for example, Unauthorized).

```seq
Note: TCP Handshake
Client -> Server: 1
Server -> Client: 2
Client -> Server: 3, header
Server -> Client: 100 Continue
Client -> Server: body
Server -> Client: 200 OK
```

## Get vs Post

1. **Parameter location**: GET parameters are in the URL, while POST parameters are in the body.
2. **Parameter length**: GET has a limit, POST has no limit.
3. **Parameter security**: GET transmits data in plain text, POST transmits data encrypted.
4. **Parameter type**: GET can only use ASCII, POST supports multiple encodings.
5. **Caching**: GET requests can be cached, POST requests cannot.
6. **Back/reload operations**: GET supports them safely, POST does not (may resubmit the form).
7. **History and favorites**: GET is supported, POST is not.
8. **Latency**: GET is faster (2 RTT), POST is slower (3 RTT, or 4 RTT, [option request](#option))).

## Option

The OPTIONS method is commonly used for CORS [preflight requests](basic-security#preflight-request).
