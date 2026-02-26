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

Objects can use `Object.getPrototypeOf()` to inspect their prototype, while functions can access their prototype through the `prototype` property.

```js
Object.getPrototypeOf({}) === Object.prototype // true
```

The prototype object has a `constructor` property that points to the constructor function.

```js
Object.prototype.constructor === Object // true
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

## Class

### Creating

Creating classes before ES6.

```js
function Dog(name) {
	this.name = name                 // instance property
}
Dog.prototype.run = function () {} // instance method
Dog.type = 'animal'                // static property
Dog.isDog = function () {}         // static method
```

Creating classes after ES6.

```js
class Dog {
	constructor(name) {
		this.name = name     // instance property
	}
	run() {}               // instance method
	static type = 'animal' // static property
	static isDog() {}      // static method
}
```

### Inheritance

Class inheritance before ES6.

```js
function Animal() {}
function Dog() {
	Animal.call(this)
}
Object.setPrototypeOf(Dog.prototype, Animal.prototype)
```

Class inheritance after ES6.

```js
class Animal {}
class Dog extends Animal {
	constructor() {
		super()
	}
}
```

### Composition

Create a new class not by subclassing, but instead by wrapping other classes.

```js
class Stack {
	items = [] // Use an Array instead of inheriting from Array.
	push(item) {
		this.items.push(item)
	}
	pop() {
		return this.items.pop()
	}
}
```

## Iteration

### Iterator

An iterator consists of three components:

1. **iterable object**: an object that returns an iterator object, via the `Symbol.iterator()` method.
2. **iterator object**: an object that returns an iteration result object, via the `next()` method.
3. **iteration result object**: an object with `value` and `done` properties.

```js
class Range { // iterable object
	constructor(from, to) {
		this.from = from
		this.to = to
	}

	[Symbol.iterator]() {
		let [start, end] = [this.from, this.to]
		return { // iterator object
			next() {
				return start < end
					? { value: start++ } // iteration result object
					: { done: true } // iteration result object
			},
		}
	}
}
```

To iterate an iterable object, you first call its `Symbol.iterator()` method to get an iterator object. Then, you call the `next()` method of the iterator object repeatedly until the returned value has its `done` property set to true.

```js
let iterable = new Range(1, 5)
let iterator = iterable[Symbol.iterator]()
let result = iterator.next() // { value: 1 }
```

### Generator

A generator is a kind of iterator defined with powerful new ES6 syntax.

```js
class Range {
	constructor(from, to) {
		this.from = from
		this.to = to
	}

	*[Symbol.iterator]() {
		for (let i = this.from; i < this.to; i++) {
			yield i
		}
	}
}
```

When you invoke a generator function, it does not actually execute the function body, but instead returns an iterator. Calling its `next()` method causes the body of the generator function to run from the current position until it reaches a yield statement.

### Yield

When the `next()` method is invoked, the generator function runs until it reaches a yield expression. The expression that follows the yield keyword is evaluated, and that value becomes the return value of the `next()` invocation.

```color
function* Nums() {
	let x1 = yield @[red]{1}
	let x2 = yield 2
}

let nums = Nums()
let y1 = nums.next().value // @[red]{1}
```

The next time the `next()` method is called, the argument passed to `next()` becomes the value of the yield expression that was paused.

```color
function* Nums() {
	let x1 = yield 1 // @[red]{200}
	let x2 = yield 2
}

let nums = Nums()
let y1 = nums.next(100).value // 1
let y2 = nums.next(@[red]{200}).value // 2
```

## Asynchronous

### Callback

A callback is a function that pass to some other function. That other function then invokes your function when some condition is met or some event occurs.

```js
setTimeout(fn, 1000)                 // timer
button.addEventListener("click", fn) // event
request.onload = fn                  // network
fs.readFile("file", fn)              // node
```

#### Callback Hell

One problem with callbacks is that it is common to end up with callbacks inside callbacks inside callbacks, with lines of code so highly indented that it is difficult to read.

```js
setTimeout(() => {
	console.log('Step 1')
	setTimeout(() => {
		console.log('Step 2')
		setTimeout(() => {
			console.log('Step 3')
		}, 1000)
	}, 1000)
}, 1000)
```

#### Difficult Error Handling

Another problem with callbacks is that they can make handling errors difficult. If an asynchronous function throws an exception, there is no way for that exception to propagate back to the initiator of the asynchronous operation.

### Promise

A Promise is an object that represents the result of an asynchronous computation.

```js
fetch('url') // retrun a promise
	.then(onFullfiled) // callback on success
	.catch(onRejected) // callback on failure
```

A Promise has three states:

1. **Pending**: neither fulfilled nor rejected.
2. **Fulfilled**: when the success callback is called.
3. **Rejected**: when the failure callback is called.

Other related terms:

- **Settled**: when a promise is fulfilled or rejected.

> TODO: page 620
