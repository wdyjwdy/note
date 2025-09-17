---
title: CSS
category: Basic
---

## Selector Types

| Selector     | Weight      | Examples                |
| ------------ | ----------- | ----------------------- |
| \*           | (0,0,0)     | select all              |
| element      | (0,0,1)     | `div`, `span`           |
| class        | (0,1,0)     | `.red`, `.dark`         |
| attribute    | (0,1,0)     | `div[title]`            |
| pseudo class | (0,1,0)     | `button:hover`          |
| id           | (1,0,0)     | `#id`                   |
| inline style | (1,0,0,0)   | `style="color: red;"`   |
| !important   | (1,0,0,0,0) | `color: red !important` |

1. Class Selector

   等价于 `[class~=names]`

   ```css
   .red /* 含有 red 类的元素 */
   p.red /* 含有 red 类的 p 元素 */
   p.red.bold /* 含有 red, bold 类的 p 元素 */
   ```

2. Attribute Selector

   ```css
   a[title] /* 存在 title 属性 */
   a[title="name"] /* 存在 title 属性，且值为 name */
   a[class~="dark"] /* 存在 class 属性，且值包含 dark */
   ```

## Pseudo Classes

伪类用于指定元素的状态。

1. Link or Button

   ```css
   a:link    /* 未访问链接 */
   a:visited /* 已访问链接 */
   a:hover   /* 用户鼠标悬停 */
   a:active  /* 激活链接 */
   ```

2. Radio, Checkbox or Select Option

   ```css
   input[type="radio"]:checked {...} /* 选项被勾选 */
   ```

3. Input or Select

   ```css
   input:enabled  /* 允许输入 */
   input:disabled /* 禁止输入 */
   input:required /* 必选 */
   input:optional /* 可选 */
   ```

4. Input

   ```css
   .red-input: focus; /* 聚焦的元素 */
   ```

5. List

   ```css
   li:first-child      /* 一组兄弟元素中的第一个元素 */
   li:last-child       /* 一组兄弟元素中的最后元素 */
   li:nth-child()      /* 按规则选择兄弟元素 */
   li:nth-last-child() /* 按规则选择兄弟元素 */
   ```

6. HTML

   `:root` 优先级高于 `html`，常用于声明全局变量。

   ```css
   :root {...} /* 选择文档的根元素 */
   ```

7. Anchor

   ```css
   h1:target {...} /* 锚点指向的元素 */
   ```

## Pseudo Elements

- before, after

  ```css
  /* 在 <a> 前创建一个元素 */
  a::before {
    content: "🔗";
  }
  ```

- backdrop

  ```css
  /* 选中 popover 后的背景 */
  ::backdrop {
    backdrop-filter: blur(3px);
  }
  ```

- first-letter, first-line

  ```css
  /* 放大首字母 */
  p::first-letter {
    font-size: 2rem;
  }

  /* 高亮首行 */
  p::first-line {
    color: red;
  }
  ```

- selection

  ```css
  /* 高亮选中的文字 */
  p::selection {
    background-color: yellow;
  }
  ```

## Nesting

1. Child Selector

   ```css
   /* 以下语句等价 */
   section {
     p {...}
   }
   section {
     & p {...}
   }
   section p {...}
   ```

2. Compound Selector

   ```css
   /* 以下语句等价 */
   .app {
     .theme {...}
   }
   .app .theme {...}

   /* 以下语句等价 */
   .app {
     &.theme {...}
   }
   .app.theme {...}

   /* 以下语句等价 */
   button {
     &:hover {...}
   }
   button:hover {...}
   ```

3. Combinators

   ```css
   /* 以下语句等价 */
   section {
     + p {...}
   }
   section {
     & + p {...}
   }
   section + p {...}
   ```

4. At

   ```css
   /* 以下语句等价 */
   section {
     @media (prefers-color-scheme: dark) {...}
   }
   @media (prefers-color-scheme: dark) {
     section {...}
   }
   ```

## Flex

![flex](/imgs/basic-css-flex.svg)

1. Flex Container
   - `flex-direction`: 主轴的方向，默认为 row。

     ```
     row row-reverse column column-reverse
     ```

   - `flex-wrap`: 元素溢出时是否换行，默认为 no-wrap。

     ```
     wrap no-wrap
     ```

   - `justify-content`: 主轴上元素的对齐方式，默认为 start。

     ```
     flex-start center flex-end space-between space-around space-evenly
     ```

   - `align-items`: 交叉轴上元素的对齐方式，默认为 stretch。

     ```
     flex-start center flex-end baseline stretch
     ```

   - `align-content`: 交叉轴上主轴的对齐方式。

     ```
     flex-start center flex-end space-between space-around space-evenly stretch
     ```

2. Flex Item
   - `flex`: grow, shrink, basis 的简写。
   - `flex-grow`: 延展元素，按比例分配剩余空间，默认为 0。

     ```
     [0, 1): 占比百分数
     [1, Infinity): 占比数
     ```

   - `flex-shrink`: 收缩元素，按比例分配收缩空间，默认为 1。

     ```
     [0, 1): 占比百分数
     [1, Infinity): 占比数
     ```

   - `flex-basis`: 设置元素的宽度，默认为 auto。
   - `align-self`: 交叉轴上指定元素的对齐方式。

     ```
     flex-start center flex-end baseline stretch
     ```

   - `order`: 元素的排列顺序

## Box Model

![box](/imgs/basic-css-box.svg)

1. 标准盒模型：`height` 指定 content 高度。
2. 替代盒模型：`height` 指定 content + padding + border 高度。

   ```css
   .box {
     box-sizing: border-box; /* 使用替代盒模型 */
   }
   ```

## Media Query

媒体查询语法: `@media media-type operator (media-feature) {...}`

- `media-type`

  ```
  all print screen
  ```

- `operator`

  ```
  and or not only
  ```

- `media-feature`

  ```
  aspect-ratio height width prefers-color-scheme
  ```

媒体查询例子

1. 宽度范围

   ```css
   @media (min-width: 10em) {-} /* 等价于 width >= 10em */
   @media (max-width: 10em) {-} /* 等价于 width < 10em */
   @media (40em <= width <= 50em) {-}
   ```

2. 夜间模式

   ```css
   @media (prefers-color-scheme: dark) {-}
   ```

## Functions

- calc

  ```css
  body {
    width: calc(100% - 80px);
    width: calc((100% - 80px) / 2);
    width: calc(var(--width) / 2);
  }
  ```

- min, max

  ```css
  body {
    width: min(1vw, 4em, 80px);
  }
  ```

- var

  ```css
  :root {
    --bg-color: pink;
  }

  body {
    background-color: var(--bg-color);
  }
  ```

- minmax (used with grid)

  ```css
  body {
    display: grid;
    grid-template-columns: minmax(200px, 1fr);
    grid-template-columns: minmax(max-content, 300px);
  }
  ```

- repeat (used with grid)

  ```css
  body {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
  ```

- translate (used with transform)

  ```css
  body {
    transform: translate(20px, 20px);
    transform: translate(-50%);
  }
  ```
