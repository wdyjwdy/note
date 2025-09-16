---
title: Typescript
category: Library
---

## Types

### Basic Types

1. Primitive

```ts
type A = number;
type B = string;
type C = boolean;
type D = undefined;
type E = null;
```

2. Array

```ts
// single-type
type A = number[];
type B = Array<number>;

// multi-types
type C = (number | string)[];
type D = Array<number | string>;
```

3. Object

```ts
type A = {
  x: number;
  y?: number; // Optional Property
};
```

4. Function

```ts
type A = () => void;
type B = (x: number) => number;
type C = (x?: number) => number; // Optional Parameter
type D = (x: number, ...rest: number[]) => void; // Rest Parameters
```

5. never

```ts
// empty set
function fn(x: number) {
  if (typeof x === "number") {
  } else {
  } // x: never
}

// function never return
function fn(): never {
  // fn: () => never
  throw new Error();
}
```

6. Any & Unkonwn

```ts
function fn(x: any) {
  x(); // ✅
  x.a(); // ✅
}

function fn(x: unknown) {
  x(); // ❌
  x.a(); // ❌
}
```

### Collection Types

1. Union

```ts
type A = 1 | 2 | 3;
type B = number | string;
```

2. Intersection

```ts
type A = number | boolean;
type B = number | string;
type C = A & B; // number
```

## Type Inference

### Variable Assignment

```ts
let A = 100; // number
let B = condition ? 100 : "hi"; // string | number

B = 100;
console.log(B); // number
B = "hi";
console.log(B); // string
```

### Operator

1. equality

```ts
function fn(x: number | null | undefined) {
  if (typeof x === "number") {
  } // x: number

  if (x === null) {
  } // x: null
  if (x == null) {
  } // x: null | undefined
  if (x != null) {
  } // x: number
}

function fn(x: number | string, y: number | boolean) {
  if (x === y) {
  } // x: number
}
```

2. in

```ts
type Dog = { name: string; bark: () => string };
type Cat = { name: string; meow: () => string };

function fn(x: Dog | Cat) {
  if ("name" in x) {
  } // x: Dog | Cat
  if ("bark" in x) {
  } // x: Dog
}
```

3. instanceof

```ts
function fn(x: number[] | number) {
  if (x instanceof Array) {
  } // x: number[]
}
```

### Control Flow

1. if-else

```ts
function fn(x: number | string) {
  if (typeof x === "number") {
    // x: number
  } else {
    // x: string
  }
}
```

2. switch

```ts
function fn(x: number | string) {
  switch (typeof x) {
    case "number":
      break; // x: number
    case "string":
      break; // x: string
  }
}
```
