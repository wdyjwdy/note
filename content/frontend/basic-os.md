---
title: Operating System
group: Basic
toc: true
---

## Virtualization

The OS takes a **physical** resource (CPU, memory, disk) and transforms it into a **virtual** form of itself (more general, powerful, easy-to-use).

### Process

A process is a running program, it consists of the following parts:

- **Memory**: Both instructions and data are stored in memory.
- **Registers**: Many instructions explicitly read or update registers.
- **Storage**: Programs often access persistent storage devices too.

![](basic-os-process)

How to create a process?

1. Load code and data into memory.
2. Allocate memory for the process (including code, data, stack, and heap segments).
3. Initialize system resources, such as opening the standard file descriptors (stdin, stdout, and stderr).
4. Execute the program starting from its entry point (the `main` function).

## Concurrency

The OS handles many things at the **same time**.

## Persistence

Data in memory is **easily lost**. Therefore, data persistence is required.

## Memory

![](basic-os-memory)

### Stack

The allocation and deallocation of stack memory is _automatically_ managed by the compiler.

```c
void fn() {
  int a = 0; // auto malloc
} // auto free
```

### Heap

The allocation and deallocation of heap memory must be managed _manually_.

```c
void fn() {
  int *a = malloc(4); // manual malloc
  *a = 0;
  free(a); // manual free
}
```

## Link

![](basic-os-link)

### Hard Link

A hard link is a direct reference to the inode information about a file. Hard links can only be created for files on the same file system (avoid cyclic references). Deleting a hard link only removes one reference to the inode, the file will still exist as long as there is at least one hard link. It is commonly used to create file backups.

```sh
$ ln hi hi-hard-link # create a hard link
$ ls -li             # same inode
#> 83169028 ... hi
#> 83169028 ... hi-hard-link
```

### Symbolic Link

A symbolic link is a special type of file that contains a pointer to another file or directory. It acts as an alias or shortcut to the target file or directory. Symbolic links can point to files or directories on the same or different file systems. Deleting a symbolic link does not affect the target file.

```sh
$ ln -s hi hi-symbolic-link # create a symbolic link
$ ls -li                    # diffrent inode
#> 83169028 ... hi
#> 83169392 ... hi-symbolic-link -> hi
```
