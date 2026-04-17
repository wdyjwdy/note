---
title: Rust
group: Basic
toc: true
---

## Basic

### Statements

- Statements do not return a value.

```rs
fn hello() {} // function definition
let x = 0;    // assigning a value
```

### Expressions

- Expressions evaluate to a value.
- Expressions do not include ending semicolons.
- Expressions can be part of statements.
- Adding a semicolon to an expression turns it into a statement.

```rs
1 + 1          // math operation
hello()        // calling a function
println!("hi") // calling a macro
{              // new scope block (return the last expression implicitly)
	0
}
```

### Control Flow

`if` is an [expression](#expressions), so it returns a value.

```rs
let x = if condition { 1 } else { 0 };

fn hello(condition: bool) -> i32 {
	if condition { 1 } else { 0 }
}
```

## Memory Management

Other languages manage memory through manual allocation, garbage collection, or reference counting, whereas Rust uses ownership.

### Ownership

Rust frees memory when a variable _goes out of scope_.

```rs
fn main() {
	let s = String::from("hello"); // allocate s
} // free s
```

However, freeing memory twice will cause an error.

```rs
fn main() {
	let s = String::from("hello"); // allocate s
	let t = s;
} // free s, t (error)
```

To ensure memory safety, Rust will _invalidates_ the first variable. (known as a "move")

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

Function parameters and return values can also transfer ownership.

```rs
fn main() {
	let s = String::from("hello");
	let t = take_back(s); // s is moved to x
}

fn take_back(x: String) -> String {
	x // x is moved to t
}
```

### Reference

Moving ownership into and out of functions is cumbersome.

```rs
fn main() {
	let s = String::from("hello");
	let (n, t) = len(s); // move into
}

fn len(x: String) -> (usize, String) {
	(x.len(), x) // move out
}
```

Rust allows referencing a value _without taking ownership_ via the `&` symbol. (known as a "borrow")

```rs
fn main() {
	let s = String::from("hello");
	let n = len(&s); // no move
}

fn len(x: &String) -> usize {
	x.len()
}
```

![](basic-rust-reference)

Rust can also create mutable references using `&mut`.

```rs
fn main() {
	let mut s = String::from("hello");
	change(&mut s);
	println!("{}", s);
}

fn change(x: &mut String) {
	x.push_str(" world");
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
	let s = String::from("hello");
	let o = &s[4..5]; // "o"
}
```

![](basic-rust-slice)

Because you cannot have both a reference and a mutable reference at the same time, you don't have to worry about the data being modified before it is used.

```rs
fn main() {
	let mut s = String::from("hello");
	let o = &s[4..5];
	s.clear(); // error
	println!("{}", o);
}
```

By using `&str` as a parameter, you can pass either a `&str` or a `&String`, because Rust automatically [dereferences](#automatic-referencing-and-dereferencing) the `&String`.

```rs
fn main() {
	let s1 = String::from("hello");
	let s2 = "hi";
	let x = len(&s1); // &String
	let y = len(s2);  // &str
}

fn len(x: &str) -> usize {
	x.len()
}
```

### Lifetimes

A lifetime is a kind of generic starting with a `'`. Every reference in Rust has a lifetime, which is the scope for which that reference is valid. Lifetime annotations don't change how long any of the references live.

```rs
fn test<'a, 'b>() {
	let s1: &'a str;   // 'a annotates the lifetime of s1
	{
		let s2: &'b str; // 'b annotates the lifetime of s2
	}
}
```

The main aim of lifetimes is to prevent dangling references. At compile time, Rust detects that the scope of `r` exceeds the lifetime of `&n`, so it throws an error.

```rs
fn main() {
	let r;
	{
		let n = 0;
		r = &n;
	}
	println!("{}", r); // error, n has already been dropped
}
```

For functions with multiple parameters, Rust cannot determine the lifetime of the return value, so it cannot perform compile time checks.

```rs
fn main() {
	let result;
	let s1 = String::from("hello");
	{
		let s2 = String::from("hi");
		result = longest(&s1, &s2); // Rust cannot perform check
	}
	println!("{}", result);
}

fn longest(x: &str, y: &str) -> &str { // Rust cannot determine the lifetime
	if x.len() > y.len() { x } else { y }
}
```

We can constrain the lifetime of the return value using lifetime annotations. When the arguments are passed in, `'a` is replaced with the intersection of the lifetimes of `x` and `y`.

```rs
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str { // 'a = intersect('x, 'y)
	if x.len() > y.len() { x } else { y }
}
```

In the following two cases, Rust automatically infers lifetimes:

- Single-parameter function
- Instance methods

```rs
fn test(x: &str) -> &str {}
fn test<'a>(x: &'a str) -> &'a str {}

fn test(&self, x: &str) -> &str {}
fn test<'a>(&'a self, x: &str) -> &'a str {}
```

`'static` is a special lifetime that indicates a value can live for the entire duration of the program.

```rs
let s: &'static str = "hello";
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

## Smart Pointers

### Box

Boxes allow you to store data on the heap rather than the stack.

```rs
let num = Box::new(0); // store an i32 value on the heap
```
