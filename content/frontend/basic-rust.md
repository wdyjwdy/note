---
title: Rust
group: Basic
toc: true
---

## Memory Management

Other languages manage memory through manual allocation, garbage collection, or reference counting, whereas Rust uses ownership.

### Ownership

Rust frees memory when a variable _goes out of scope_.

```rs
fn main() {
	let s = String::from("hello"); // allocate s
} // free s
```

When a variable is assigned, Rust does not copy the heap data, making memory usage efficient. However, this means two variables could point to the same heap memory, and freeing the memory twice would cause an error.

```rs
fn main() {
	let s = String::from("hello"); // allocate s
	let t = s;
} // free s, t (error)
```

Rust solves this by _invalidating the first_ variable’s reference to the data after assignment.

```rs
fn main() {
	let s = String::from("hello"); // allocate s
	let t = s; // invalidates s
} // free t
```

When assign a new value to an existing variable, Rust will _free the original_ value's memory immediately.

```rs
fn main() {
	let mut s = String::from("hello"); // allocate s
	s = String::from("hi"); // free s (old), allocate s (new)
} // free s
```

Rust allows us to explicitly perform a deep copy of data on the heap.

```rs
fn main() {
	let s = String::from("hello"); // allocate s
	let t = s.clone(); // allocate t
} // free s, t
```

Function parameters also transfer ownership.

```rs
fn main() {
	let s = String::from("hello");
	let t = take_back(s); // s was moved to x
}

fn take_back(x: String) -> String {
	x // x was moved to t
}
```

### Reference

Moving ownership into and out of functions is cumbersome.

```rs
fn main() {
	let s = String::from("hello");
	let (len, t) = get_len(s); // move into
}

fn get_len(s: String) -> (usize, String) {
	(s.len(), s) // move out
}
```

Rust uses the `&` syntax to create references. References allow you to refer to a value _without taking ownership_ of it.

```rs
fn main() {
	let s = String::from("hello");
	let len = get_len(&s); // no move
}

fn get_len(s: &String) -> usize {
	s.len()
}
```

Rust can also create mutable references using `&mut`.

```rs
fn main() {
	let mut s = String::from("hello");
	change(&mut s);
	println!("{}", s);
}

fn change(s: &mut String) {
	s.push_str(" world");
}
```

When multiple references access the same data simultaneously, a data race can occur, leading to undefined behavior.

```rs
fn main() {
	let mut s = String::from("hello");
	let s1 = &s;
	let s2 = &mut s;
	s2.clear();
	println!("{s1}"); // s1 is modified before it is used
}
```

Rust ensures that references are always valid at compile time through the following rules.

- At the same time, there can be multiple references to the same data.
- At the same time, there can be only one mutable reference to the same data.

```rs
fn main() {
	let mut s = String::from("hello");
	let s1 = &s;
	let s2 = &mut s; // error
	s2.clear();
	println!("{s1}");
}
```

### Slice

Slices let you reference a contiguous sequence of elements in a collection.

```rs
fn main() {
	let s = String::from("hello world");
	let hello = &s[0..5]; // "hello"
}
```

Because you cannot have both a reference and a mutable reference at the same time, you don’t have to worry about the data being modified before it is used.

```rs
fn main() {
	let mut s = String::from("hello world");
	let hello = &s[0..5];
	s.clear(); // error
	println!("{hello}");
}
```

## Structs

### Automatic Referencing And Dereferencing

```rs
impl Counter {
	fn increment(&mut self) {}
	fn print(&self) {}
}
```

When you call a method, Rust automatically adds in `&` ,`&mut` or `*` so that object matches the signature of the method.

```rs
// automatic referencing
counter.increment();
counter.print();

// equivalent to
(&mut counter).increment();
(&counter).print();
```

```rs
let borrow = &counter;

// automatic dereferencing
borrow.print();

// equivalent to
(*borrow).print();
```

## Enum

Enums in Rust have two main advantages:

- They can store data.
- Variants can have different types.

```rs
enum IP {
	v4(u8, u8, u8, u8),
	v6(String),
}
```

### Match

Rust uses `match` to execute code based on different patterns.

```rs
fn get_type(&self) -> &str {
	match self {
		Self::v4(..) => "ipv4",
		Self::v6(..) => "ipv6",
	}
}
```

You can also execute multiple lines of code.

```rs
fn get_type(&self) {
	match self {
		Self::v4(..) => {
			println!("ipv4");
		}
		Self::v6(..) => {
			println!("ipv6");
		}
	}
}
```

You can extract values out of enum variants.

```rs
fn get_value(&self) {
	match self {
		Self::v4(a, b, c, d) => {
			println!("{a}.{b}.{c}.{d}");
		}
		Self::v6(a) => {
			println!("{a}");
		}
	}
}
```

You can use a catch-all pattern.

```rs
let num = 1;
let result = match num {
	1 => 1,
	2 => 2,
	_ => 0,
};
```

### If Let and Let Else

`if let` is a shorthand for ignoring remaining values.

```rs
let num = Some(1);

// original
match num {
	Some(value) => println!("{value}"),
	_ => (),
}

// shorthand
if let Some(value) = num {
	println!("{value}");
}
```

You can include an `else` with an `if let`.

```rs
let num = Some(1);

// original
match num {
	Some(value) => println!("{value}"),
	_ => println!("NaN"),
}

// shorthand
if let Some(value) = num {
	println!("{value}");
} else {
	println!("NaN");
}
```

`let else` is a shorthand for early returns.

```rs
let num = Some(1);

// original
let value = if let Some(x) = num { x } else { return };

// shorthand
let Some(value) = num else { return };
```

### Option

Rust does not have `null`, but it can be represented using an `enum`.

- When we have a `Some` value, we know that a value is present.
- When we have a `None` value, we don't have a valid value.

```rs
enum Option<T> {
	None,
	Some(T),
}
```

When you use that value, you are required to explicitly handle the case when the value is null.

```rs
let num = Some(1);
match num {
	None => {
		println!("null");
	}
	Some(x) => {
		println!("{x}");
	}
}
```

### Result

```rs
enum Result<T, E> {
	Ok(T),
	Err(E),
}
```

```rs
match File::open("hello.txt") {
	Ok(..) => println!("file open"),
	Err(..) => panic!("file not exist"),
}
```

## Crate

- Binary Crate: programs you can compile to an executable, must have a `main` function.
- Library Crate: provide utility functions across multiple projects, no `main` function.

### Mod

We define a module with the `mod` keyword.

```rs
pub mod math {
	pub mod basic {
		pub fn sum() {}
	}
}
```

We use a path `::` to find an item.

```rs
fn test() {
	crate::math::basic::sum(); // absolute path
	math::basic::sum();        // relative path
}
```

We can create a shortcut to a path with the `use` keyword.

```rs
use crate::math::basic;

fn test() {
	basic::sum(); // shortcut
}
```

## Functional Programming

### Closures

Rust's closures are anonymous functions you can save in a variable or pass as arguments to other functions. Unlike functions, closures can _capture values_ from the scope in which they're defined.

```rs
let c = |x: i32| -> i32 { x }; // closure with type annotations
let c = |x| x;                 // closure without type annotations
```

A closure's type is fixed the first time it is used.

```rs
let c = |x| x;
let v1 = c(0);
let v2 = c(true); // error
```

Ownership of captured variables is inferred through the closure's body implementation. You can use `move` keyword to force the closure to take ownership.

```rs
let mut s = String::from("hello");

let c = || println!("{}", s);      // &s,     trait: Fn
let c = || s.push_str("hi");       // &mut s, trait: FnMut
let c = || s;                      // s,      trait: FnOnce
let c = move || println!("{}", s); // s,      trait: Fn
```

Ownership transfer occurs at definition, not at invocation.

```rs
let s = String::from("hello");
let c = || println!("{}", s); // move
c();
```

### Iterators

```rs
let arr = vec![1, 2, 3];
let iter = arr.iter();
for i in iter {
	println!("{}", i);
}
```

## Appendix

### Stack and Heap

Both the stack and the heap are parts of memory available to your code to use at runtime, but they are structured in different ways.

- The stack follows the LIFO (Last In, First Out) rule.
- All data stored on the stack must have a known, fixed size.
- Data with an unknown size at compile time or a size that might change must be stored on the heap

When you put data on the heap, you request a certain amount of space. The memory allocator finds an empty spot in the heap that is big enough, marks it as being in use, and returns a pointer, which is the address of that location.

Because the pointer to the heap is a known, fixed size, you can store the pointer on the stack, but when you want the actual data, you must follow the pointer.

- Pushing to the stack is faster than allocating on the heap because the allocator never has to search for a place to store new data.
- Accessing data in the heap is generally slower than accessing data on the stack because you have to follow a pointer to get there.
