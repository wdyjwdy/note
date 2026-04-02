---
title: Testing
group: Tools
toc: true
---

## Unit Testing

A unit test is an automated piece of code that invokes the unit of work through an entry
point and then checks one of its exit points.

### Unit

A unit stands for a "unit of work", it can be a function, a component, or a module.

A unit always has an **entry point** and one or
more **exit points**. it's a good idea to have a _separate test_ for each exit point.

![](tools-testing-unit)

The following functions has one entry point and one exit point.

```js
function sum(a, b) { // entry
	return a + b // exit
}
```

```js
let count = 0 // exit
function increment() { // entry
	count++
}
```

```js
import { logger } from 'logger'
function log() { // entry
  logger.info('message') // exit
}
```

## Integration Testing

Integration testing is just [unit testing](#unit-testing) with some _real_ dependencies.

## Dependency

there are two main types of dependencies that our unit of work can use:

- **Outgoing dependencies**: Dependencies that represent an exit point. [Mocks](#mocks) break outgoing dependencies.

```js
function log() {
  logger.info('message') // outgoing dependency
}
```

- **Incoming dependencies**: Dependencies that are not exit points. [Stubs](#stubs) break incoming dependencies.

```js
function isWeekend() {
	const today = new Date().getDay() // incoming dependency
	return [0, 6].includes(today)
}
```

### Stubs

Stubs are fake modules, objects, or functions that provide fake behavior or data into the code under test. We can have many stubs in a single test.

```js
const stubToday = 0
```

### Mocks

Mocks are fake modules, objects, or functions that we check whether they were called. We can have only one mock per test.

```js
const mockLogger = {
	info(text) {
		console.log(text)
	}
}
```

## Code Quality

### Readability

A good unit test _name_ should include the following three points.

- The entry point
- The scenario
- The expected behavior

```js
describe('sum', () => {                        // entry
	describe('given strings as input', () => {   // scenario
		test('it will concatenate them', () => {}) // behavior
	})
})

// entry, scenario, behavior
test('sum, given strings as input, it will concatenate them.', () => {})
```

A good unit test _structure_ should follow the Arrange Act Assert (AAA) pattern.

```js
test('returns true when age is 18 or above', () => {
  // Arrange
  const age = 20

  // Act
  const result = isAdult(age)

  // Assert
  expect(result).toBe(true)
})
```

It's more readable to initialize mock objects within the test than in `beforeEach`.

```js
describe('', () => {
	let mockFn
	beforeEach(() => {
		mockFn = makeFn() // bad
	})
})

describe('', () => {
	test('', () => {
		const mockFn = makeFn() // good
	})
})
```

It's more readable to use meaningful names for constants.

```js
expect(isWeekends(0)).toBe(true)      // bad
expect(isWeekends(SUNDAY)).toBe(true) // good
```

### Maintainability

@TODO

### Trustworthy

It’s more trustworthy when a unit test verifies only a single exit point.

```js
// bad
test('', () => {
	expect(result).toBe(0)
	expect(callback).toHaveBeenCalled()
})

// good
test('', () => {
	expect(result).toBe(0)
})
```

It’s more trustworthy to avoid using conditional logic in unit tests.

- if, else, for, try, catch

```js
expect(result).toBe([1, 2, 3].join(',')) // bad
expect(result).toBe('1,2,3')             // good
```
