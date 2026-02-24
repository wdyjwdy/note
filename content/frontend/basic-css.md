---
title: CSS
group: Basic
toc: true
---

## Flex Box

![](basic-css-flex)

- Flex Container

```color
flex-direction  # main axis direction.
flex-wrap       # whether items wrap when they overflow the main axis.
justify-content # how items are aligned along the main axis.
align-items     # how items are aligned along the cross axis.
align-content   # how main axis are aligned along the cross axis.
```

- Flex Item

```color
flex        # the shorthand for flex-grow, flex-shrink, flex-basis.
flex-grow   # grow items, distribute the remaining space.
  - 0       # does not take up any remaining space (default)
  - 0.5     # takes up half of the remaining space
  - 1       # takes up all of the remaining space

flex-shrink # shrink items, distribute the remaining space.
  - 0       # does not take up any remaining space
  - 0.5     # takes up half of the remaining space
  - 1       # takes up all of the remaining space (default)

flex-basis  # the size of the item along the main axis.
align-self  # how items are aligned along the cross axis.
order       # the order to lay out an item.
  - -1      # placed before items with order 0  
  -  0      # default  
  -  1      # placed after items with order 0
```

> **flex-basis vs width**
>
> - When flex-direction is row, flex-basis controls width.
> - When flex-direction is column, flex-basis controls height.

## Box Model

![](basic-css-box)

1. Content Box: `height = content`
2. Border Box: `height = content + padding + border`

```css
box-sizing: content-box; /* default */
box-sizing: border-box;
```
