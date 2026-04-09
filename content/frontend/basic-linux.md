---
title: Linux
group: Basic
toc: true
---

## Links

![](basic-linux-link)

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
