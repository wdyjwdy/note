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
