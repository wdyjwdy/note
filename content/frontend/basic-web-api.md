---
title: Web API
group: Basic
toc: true
---

## Fetch

```js
fetch(url, {
	method,
	headers,
	body,
	mode,
	credentials,
	signal,
})
```

- You can use AbortController to terminate a request (not yet sent).
- Fetch only rejects on network errors, so you have to check the response status manually.
- Fetch does not send cookies by default.

## Local Storage

- **Storage**: Data persists until manually deleted.
- **Size**: About 5 MB.
- **Scope**: Shared across pages of the _same origin_.

## Session Storage

- **Storage**: Data is automatically removed when the session is closed.
- **Size**: About 5 MB.
- **Scope**: Shared within the _same session_ (tabs).

## File Upload

### Form based

```html
<form action="localhost:4000/upload" method="POST" enctype="multipart/form-data">
  <input type="file" name="file">
  <button type="submit">Upload</button>
</form>
```

Disadvantages are as follows:

- Cannot display upload progress.
- Does not support resuming interrupted uploads.

### Fetch based

```js
fetch('localhost:4000/upload', {
	method: 'POST',
	body: formData,
})
```

Advantages are as follows:

1. Supports chunked upload.
2. Supports resuming interrupted uploads.
3. Supports displaying progress.
