---
title: JS
group: Basic
toc: true
---

## Object

### Own Property

Own property defined directly on an object.

```js
let obj = { a: 1 }
```

The `in` operator returns `true` if the object has an own property or an inherited property.

```js
'a' in obj // true
'toString' in obj // true
```

The `hasOwn()` method returns `true` if the object has an own property.

```js
Object.hasOwn(obj, 'a') // true
Object.hasOwn(obj, 'toString') // false
```

### Prototype

Almost every JavaScript object has a second JavaScript object associated with it. This second object is known as a prototype, and the first object inherits properties from the prototype.

```js
let obj = {}                   // prototype is Object.prototype
let obj = new Object()         // prototype is Object.prototype
let obj = new Array()          // prototype is Array.prototype
let obj = Object.create(proto) // prototype is proto
let obj = Object.create(null)  // prototype is null
```

### Inheritance

JavaScript objects have a set of [own properties](#own-property), and they also inherit a set of properties from their [prototype object](#prototype).

```js
let b = { y: 2 } // inherited properties
let a = Object.create(b)
a.x = 1 // own properties
```

Property access follows the prototype chain until it reaches `null`.

```js
// prototype chain: a -> b -> Object.prototype -> null
a.x // 1, found in a
a.y // 2, found in b
a.z // undefind, not found until null
```

The `null` and `undefined` values have no properties, and it is an error to query properties of these values.

```js
null.a // error
undefined.a // error
```

> In JavaScript, inheritance occurs during property lookup, but not during property assignment.

## Array

### Length Property

Modifying the `length` property truncates the array or creates empty slots.

```js
let a = [1, 2, 3]
a.length = 1 // a is [1]
a.length = 3 // a is [1, , ,]
```

### Array-Like Object

An array-like object must satisfy the following conditions:

1. It has a `length` property.
2. It has non-negative integer indices.

```js
let obj = {
	0: 'a',
	1: 'b',
	2: 'c',
	length: 3,
}
```

Since array-like objects do not inherit from `Array.prototype`, you cannot invoke array methods on them directly.

```js
console.log(Array.prototype.slice.call(obj, 1)) // ['b', 'c']
```

### Iterable Object

An iterable object must satisfy the following conditions:

1. Implements a `[Symbol.iterator]()` method.

### Traversing an Array

|                    | for | for-of | forEach |
| ------------------ | :-: | :----: | :-----: |
| continue           |  O  |   O    |    X    |
| break              |  O  |   O    |    X    |
| return             |  O  |   O    |    X    |
| skip array element |  O  |   X    |    X    |
| skip array hole    |  X  |   X    |    O    |

## Function

### This

| Invoke Way     | This Value                          |
| -------------- | ----------------------------------- |
| Function       | undefind, globalThis (non-strict)   |
| Method         | calling object                      |
| Constructor    | instance                            |
| Arrow Function | inherit from their defining context |

```js
// function

function f() {
	console.log(this) // undefined
}
f()

// method

let o1 = {
	f() {
		console.log(this) // o1
	},
}
o1.f()

// nested function

let o2 = {
	f() {
		function g() {
			console.log(this) // undefined
		}
		g()
	},
}
o2.f()

// arrow function

let o3 = {
	f() {
		const g = () => {
			console.log(this) // o3
		}
		g()
	},
}
o3.f()

// constructor

function Dog() {
	console.log(this) // dog
}
let dog = new Dog()
```

### Closure

The closure capture the local variable bindings of the outer function within which they are defined.

```js
function Counter() {
	let count = 0 // captured variable
	return {
		increment() {
			count++
		},
		print() {
			console.log(count)
		},
	}
}

let counter = Counter()
counter.increment()
counter.increment()
counter.print()
```
