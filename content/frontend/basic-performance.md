---
title: Web Performance
group: Basic
toc: true
---

## CRP

The Critical Rendering Path (CRP) is the sequence of steps the browser goes through to convert the HTML, CSS, and JavaScript into pixels on the screen. Optimizing the critical render path improves render performance.

![](basic-performance-crp)

1. [Building the DOM](#building-the-dom)
2. [Building the CSSOM](#building-the-cssom)
3. [Building the Render Tree](#building-the-render-tree)
4. [Calculating Layout](#calculating-layout)
5. [Painting to the Screen](#painting-to-the-screen)

#### Building the DOM

After receiving the HTML, the browser begins _synchronously_ parsing the HTML tags and creating nodes. Some tags are handled specially:

1. `<script>`: Download and execute JavaScript immediately, and pause DOM construction.
2. `<style>`, `<link rel="stylesheet">`: Download and constructs the CSSOM immediately, but does not pause DOM construction.

Optimization:

- Delay JS execution. `<script defer>`
- Avoid using synchronous JavaScript.

#### Building the CSSOM

When a CSS tag is parsed, the browser starts downloading it and building the CSSOM. Subsequent CSS tags that are parsed will be merged into the existing CSSOM.

- CSSOM construction does not block DOM construction.
- CSSOM construction blocks Render Tree construction.

Optimization:

- Inline critical CSS.
- Preload CSS. `<link rel="preload">`

#### Building the Render Tree

The render tree is the tree the browser uses to calculate element layout and paint them on the screen. Once the DOM and CSSOM are ready, the browser merges them to form the render tree.

#### Calculating Layout

The browser calculates the geometry of each element based on the structure and styles of the render tree.

- _Reflow_: if a parent node’s size changes, its child nodes need to be recalculated.

Optimization:

- Reduce reflows: batch DOM updates and avoid frequent modifications.
- Reduce nodes: use virtual lists and lazy loading.

#### Painting to the Screen

The browser fills each element’s visual information onto the screen pixels based on the layout of the render tree.

- _Repaint_: modifying properties like node color will trigger a repaint of the screen.

Optimization:

- Reduce repaints: avoid frequently changing colors.
- Layered rendering.

## Event Loop

JavaScript is single-threaded, and all tasks must be queued for execution. There are two types of tasks as follows:

1. **macrotask**: setTimeout, setInterval, I/O, UI Rendering
2. **microtask**: Promise.then, queueMicrotask, process.nextTick (Node)

![](basic-performance-event-loop)

The order of task execution is as follows:

1. Execute synchronous code.
2. Execute all microtasks.
3. Execute one macrotask.
4. Return to step 2.

```js
console.log('script 1')
setTimeout(() => {console.log('macrotask')}, 0) // added to the macrotask queue
new Promise((resolve) => {
  console.log('script 2')
  resolve()
})
.then(() => {console.log('microtask')}) // added to the microtask queue
 
// script 1
// script 2
// microtask
// macrotask
```

## Event Flow

**Event bubbling** is a propagation mechanism of DOM events. When an element triggers an event, the event starts from the _target element_ and then propagates upward through its parent elements until it reaches the `document`.

![](basic-performance-event-flow)

We can use `stopPropagation()` to prevent the event from continuing to propagate.

```js
div.addEventListener('click', (e) => {
  e.stopPropagation()
})
```

One advantage of event bubbling is that it enables **event delegation**. We can attach a listener to a parent element instead of setting one on each child element individually.

```html
<div id="parent">
  <div id="a"></div>
  <div id="b"></div>
  <div id="c"></div>
</div>

<script>
  const parent = document.getElementById("parent");
  parent.onclick = (e) => {
    console.log(e.target.id);
  }
</script>
```
