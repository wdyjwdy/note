---
title: Bundler
group: Basic
toc: true
---

## Overview

In JavaScript development, a bundler is responsible for compiling small pieces of code into something larger and more complex, such as a library or application.

For web applications, this makes your application load and run significantly faster. For libraries, this can avoid your consuming application having to bundle the source again, and can also improve runtime execution performance.

Bundlers can make web applications more performant in some ways:

1. Reduce the amount of network requests and waterfalls.
2. Reduce total bytes sent over the network.
3. Improve JavaScript execution performance.

## Build

### Module Resolution

The task of module resolution is to parse your `import` statements and generate a dependency graph. The dependency tree is typically used to perform bundling, [Tree Shaking](#tree-shaking), and [HMR](#hmr). The resolution steps are as follows:

1. Select the entry file main.js.
2. Find the dependency names via import statement.
3. Recursively find the dependencies of the dependencies.
4. Generate the dependency tree.

### Tree Shaking

Tree Shaking is used to eliminate _unused code (has no side effects)_, and it relies on the _static structure_ of import and export syntax.

```js
console.log('') // has side effect
let a = 1       // unused
```

You can also manually mark a function as side-effect free.

```js
/* @__NO_SIDE_EFFECTS__ */
export function hello() {
	console.log('hello')
}
```

### Code Splitting

Bundling all code into a single large chunk has the following drawbacks:

1. It cannot support on-demand loading (code that is not needed for the current page will still be loaded).
2. It cannot take advantage of caching (a small change in the code will cause the entire bundle to change).

Code splitting solves this problem by splitting the code into multiple smaller chunks. The following types of files will be split into chunks:

1. js
2. js (dynamic import)
3. css
4. html

### HMR

**Hot Module Replacement** (HMR) allows all kinds of modules to be updated at runtime without the need for a full refresh. This feature is great for productivity.
