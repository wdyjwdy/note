---
title: Package Manager
group: Tools
toc: true
---

## Version

Semantic Versioning:

- `Major`: breaking change
- `Minor`: new feature
- `Patch`: bug fix

Version Range:

- `x`: any version
- `~`: accept any `Patch` (no new features)
- `^`: accept any `Minor` and `Patch` (no breaking changes)
- `latest`: latest version

```color
{
  "dependencies": {
    "react": "1.x",    # 1.0.0 <= version < 2.0.0
    "react": "1.2.x",  # 1.2.0 <= version < 1.3.0
    "react": "latest",
    "react": "^1.2.3"  # 1.2.3 <= version < 2.0.0
    "react": "~1.2.3", # 1.2.3 <= version < 1.3.0
  }
}
```

## Dependencies

- **Dependencies** are the packages that your project needs to run in _production_.
- **DevDependencies** are the packages that are only needed during _development_.

## Install

### Npm 2

Npm 2 used a _nested installation structure_, resulting in a clear directory layout. However, identical dependencies were not deduplicated, and the nesting depth could become very deep.

```color
# install A{C}, B{C}

node_modules
├── A
│   └── node_modules
│       └── C
└── B
    └── node_modules
        └── C
```

### Npm 3

Npm 3 uses a _flat installation structure_. Dependencies are hoisted to the top-level directory, and npm resolves them by searching upward through the directory tree. However, npm 3 can introduce **phantom dependencies**: package `C` can be required even if it is not listed in `package.json`.

```color
# install A{C}, B{C}

node_modules
├── A
├── B
└── C
```

When multiple versions of the same package appear, _only one version will be hoisted_.

```color
# install A{C@1} B{C@2}

node_modules
├── A
├── B
│   └── node_modules
│       └── C@2
└── C@1
```

### Pnpm

Pnpm installs all dependencies into the `~/.pnpm-store/` directory and then organizes the project’s directory structure using _symbolic links_ and _hard links_.

```color
# install A{C}, B{C}

node_modules
├── A # to .pnpm/A
├── B # to .pnpm/B
└── .pnpm
    ├── A # hard link
    │   └── node_modules
    │       └── C # to ../../C
    ├── B
    │   └── node_modules
    │       └── C # to ../../C
    └── C
```

### Bun

Same as [pnpm](#pnpm).

## Lock File

Running the `install` command will install the latest version `1.2.7` within the specified range, which can cause _inconsistent dependency versions_.

```json
{
  "dependencies": {
    "react": "^1.2.3"
  }
}
```

The solution is to use a `package-lock.json` file to record the dependency versions of packages.

## Monorepo

@TODO
