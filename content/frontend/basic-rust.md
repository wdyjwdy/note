---
title: Rust
group: Basic
toc: true
---

## Ownership

Some languages manage memory manually, some use reference counting, while Rust manages memory through ownership.

Rust frees memory when a variable _goes out of scope_.

```rs
fn main() {
	// allocate s
	let s = String::from("hello");
	// free s
}
```

When a variable is assigned, Rust does not copy the heap data, making memory usage efficient. However, this means two variables could point to the same heap memory, and freeing the memory twice would cause an error.

```rs
fn main() {
	// allocate s
	let s = String::from("hello");
	let t = s;
	// free s, t (error)
}
```

Rust solves this by _invalidating the first_ variable’s reference to the data after assignment.

```rs
fn main() {
	// allocate s
	let s = String::from("hello");
	let t = s; // invalidates s
	// free t
}
```

Rust allows us to explicitly perform a deep copy of data on the heap.

```rs
fn main() {
	// allocate s
	let s = String::from("hello");
	// allocate t
	let t = s.clone();
	// free s, t
}
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

Moving ownership into functions can be cumbersome.

```rs
fn main() {
	let s = String::from("hello");
	let l = get_len(s); // move
}

fn get_len(s: String) -> usize {
	s.len()
}
```

Rust uses the `&` syntax to create references. References allow you to refer to a value without taking ownership of it.

```rs
fn main() {
	let s = String::from("hello");
	let l = get_len(&s); // no move
}

fn get_len(s: &String) -> usize {
	s.len()
}
```

References have the following characteristics:

1. At the same time, there can be multiple references to the same data.
2. At the same time, there can be only one mutable reference to the same data. (prevent data races at compile time.)
3. Dangling References can be avoided at compile time.

### Slice

Slices let you reference a contiguous sequence of elements in a collection.

```rs
fn main() {
	let s = String::from("hello world");
	let hello = &s[0..5];
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
