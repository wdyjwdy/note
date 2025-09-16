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

```sh
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

### 查看最新提交

1. 分支指针指向最新提交。

```sh
$ cat .git/refs/heads/main # value
846aac5
```

## Branch

### 新建分支

1. 假设有以下提交历史，并执行 `git branch feat`。

```sh
846aac5 (HEAD -> main) commit 3
d58f2f5 commit 2
43bed3d commit 1
```

2. Git 会在 refs/heads 目录下创建一个名为 feat 的文件，内容为当前 commit。

```diff
+ .git/refs/heads/feat
```

```sh
$ cat refs/heads/feat # value
846aac5
```

3. 操作完成后，历史记录如下。

```sh
846aac5 (HEAD -> main, feat) commit 3
d58f2f5 commit 2
43bed3d commit 1
```

### 删除分支

1. 假设有以下提交历史，并执行 `git branch -d feat`。

```
846aac5 (HEAD -> main, feat) commit 3
d58f2f5 commit 2
43bed3d commit 1
```

2. Git 会删除 refs/heads 目录下的 feat 文件

```diff
- .git/refs/heads/feat
```

3. 操作完成后，历史记录如下。

```
846aac5 (HEAD -> main) commit 3
d58f2f5 commit 2
43bed3d commit 1
```

> 删除分支后，分支上的 commit 对象并不会被删除，这些对象会变成垃圾对象。

### 查看当前分支

1. HEAD 文件指向当前分支。

```sh
$ cat .git/HEAD # value
ref: refs/heads/main
```

## Switch

1. `git switch feat`: 切换到 feat 分支
2. `git switch -c feat`: 创建并切换到 feat 分支
3. `git switch --detach 6cc8ff6`: 切换到 6cc8ff6 提交

### 切换到分支

![switch](/imgs/tools-git-switch.svg)

1. 假设有以下提交历史，并执行 `git switch feat`。

```sh
846aac5 (HEAD -> main, feat) commit 3
d58f2f5 commit 2
43bed3d commit 1
```

2. Git 会更新 HEAD 文件，将其指向 feat 分支。

```diff
- .git/HEAD
+ .git/HEAD
```

```sh
$ cat .git/HEAD # value
ref: refs/heads/feat
```

3. 更新 Index，内容为 feat 的文件列表（把 tree 展平得到的列表）。

```diff
- .git/index
+ .git/index
```

4. 更新 Working Tree，和 Index 保持一致。
5. 操作完成后，历史记录如下。

```sh
846aac5 (HEAD -> feat, main) commit 3
d58f2f5 commit 2
43bed3d commit 1
```

### 切换到提交

![switch-detach](/imgs/tools-git-switch-detach.svg)

1. 假设有以下提交历史，并执行 `git switch --detach d58f2f5`。

```sh
846aac5 (HEAD -> main) commit 3
d58f2f5 commit 2
43bed3d commit 1
```

2. Git 会更新 HEAD 文件，将其指向 d58f2f5。

```diff
- .git/HEAD
+ .git/HEAD
```

```sh
$ cat .git/HEAD # value
d58f2f5
```

3. 更新 Index，内容为 d58f2f5 的文件列表（把 tree 展平得到的列表）。

```diff
- .git/index
+ .git/index
```

4. 更新 Working Tree，和 Index 保持一致。
5. 操作完成后，历史记录如下。

```sh
846aac5 (main) commit 3
d58f2f5 (HEAD) commit 2
43bed3d commit 1
```

> - 如果想基于该提交工作，可以执行 `git switch -c <name>` 创建一个新分支。
> - 如果想返回之前的分支，可以执行 `git switch -`。
