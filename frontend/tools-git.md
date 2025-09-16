---
title: Git
category: Tools
---

## Init

- `git init`: 在当前目录下初始化一个代码仓库

### 新建本地仓库

1. 新建文件夹，并执行 `git init`。

```
fruits
├── apple.txt
└── banana.txt
```

2. Git 会创建一个 .git 文件夹。

```diff
fruits
  ├── apple.txt
  ├── banana.txt
+ └── .git
```

### 关联远程仓库

```sh
git remote add origin <repo-addr>
git push -u origin main
```

## Add

Git Add 会将 Working Tree 的文件添加到 Index，例如：

- `git add hello.txt`: 添加 hello.txt
- `git add fruits`: 添加 fruits 目录下所有文件
- `git add .`: 添加所有文件
- `git add *.js`: 添加所有 js 文件

### 添加文件

![add](/imgs/tools-git-add.svg)

1. 新建文件，并执行 `git add hello.txt`。

```
hello // hello.txt
```

2. Git 会在 objects 目录下生成一个 blob 对象，其内容为 hello，文件名为 Hash(hello)。

```diff
+ .git/objects/ce01362
```

```sh
$ git cat-file -t ce01362 # type
blob

$ git cat-file -p ce01362 # value
hello
```

3. 在 Index 中添加一条记录，记录文件名和文件路径。

```diff
- .git/index
+ .git/index
```

```sh
$ git ls-files -s # index
ce01362 hello.txt
```

> - 当两个文件的内容相同时，它们的哈希值也相同，因此只会生成一个 blob 对象。
> - 空文件夹不会被 Git 管理。
> - Index 以列表的形式储存文件名，也包括嵌套文件
>
>   ```sh
>   $ git ls-files -s # index
>   ce01362 hello.txt
>   4c479de fruits/apple.txt
>   ```

## Commit

- `git commit`: 提交 Index 中的内容到 Repository，并使用 Vim 输入 Commit Message。
- `git commit -m 'update'`: 提交 Index 中的内容到 Repository，并使用 update 作为 Commit Message。
- `git commit --amend`: 等价于 `git reset --soft HEAD~1` 加 `git commit`。

### 提交文件

![commit](/imgs/tools-git-commit.svg)

1. 假设 Index 内容如下，并执行 `git commit -m 'update'`。

```
4c479de fruits/apple.txt
637a09b fruits/banana.txt
ce01362 hello.txt
```

2. Git 会在 objects 目录下生成若干 tree 对象，以树的形式记录 Index 中的文件列表

```diff
.git/objects
+ ├── 3ea2839
+ └── b0665b8
```

```sh
# tree 3ea2839
tree b0665b8 fruits
blob ce01362 hello.txt

# tree b0665b8
blob 4c479de apple.txt
blob 637a09b banana.txt
```

3. 在 objects 目录下生成一个 commit 对象，记录了 tree 的根节点，和一些提交信息

```diff
+ .git/objects/705d22a
```

```sh
# commit 705d22a
tree 3ea2839
author wdyjwdy <email.com>
committer wdyjwdy <email.com>

update
```

4. 更新当前分支指针，指向生成的 commit 对象

```diff
- .git/refs/heads/main
+ .git/refs/heads/main
```

```sh
$ cat .git/refs/heads/main # value
705d22a
```

> 1. `HEAD^`: HEAD 的父节点
> 2. `HEAD^2`: HEAD 的第二个父节点
> 3. `HEAD~`: HEAD 的父节点
> 4. `HEAD~2`: HEAD 父节点的父节点
