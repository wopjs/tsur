# [tsur](https://github.com/wopjs/tsur)

<p align="center">
  <img width="200" src="https://raw.githubusercontent.com/wopjs/tsur/main/assets/tsur.svg">
</p>

[![Docs](https://img.shields.io/badge/Docs-read-%23fdf9f5)](https://wopjs.github.io/tsur)
[![Build Status](https://img.shields.io/github/actions/workflow/status/wopjs/tsur/build.yml)](https://github.com/wopjs/tsur/actions/workflows/build.yml)
[![npm-version](https://img.shields.io/npm/v/@wopjs/tsur.svg)](https://www.npmjs.com/package/@wopjs/tsur)
[![Coverage Status](https://img.shields.io/coveralls/github/wopjs/tsur/main)](https://coveralls.io/github/wopjs/tsur?branch=main)

TypeScript goodies inspired by Rust.

This project draws inspiration from Rust, but is designed to be more ergonomic and tailored to TypeScript's features and syntax.

## Install

```
npm add @wopjs/tsur
```

## Usage

### Option

```ts
import { Option, Some, None } from "@wopjs/tsur";

const maybeNumber = Some(42);

if (maybeNumber.isSome()) {
  console.log(maybeNumber.unwrap()); // 42
} else {
  console.log("There is no number");
}

const maybeString = None;

if (maybeString.isSome()) {
  console.log(maybeString.unwrap());
} else {
  console.log("There is no string"); // "There is no string"
}
```

### Result

```ts
import { Result, Ok, Err } from "@wopjs/tsur";

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return Err("Cannot divide by zero");
  }
  return Ok(a / b);
}

const result = divide(10, 2);

if (result.isOk()) {
  console.log(result.unwrap()); // 5
} else {
  console.log(result.unwrapErr()); // "Cannot divide by zero"
}
```

### Array

Many useful array methods are added:

```ts
import { filterMap, Some, None } from "@wopjs/tsur";

const arr = [1, 2, 3, 4, 5];

const result = filterMap(arr, x => (x % 2 === 0 ? Some(x * 2) : None));

console.log(result); // [4, 8]
```

Or you can patch them to the native array:

```ts
import "@wopjs/tsur/patches/array";

const arr = [1, 2, 3, 4, 5];

const result = arr.filterMap(x => (x % 2 === 0 ? Some(x * 2) : None));

console.log(result); // [4, 8]
```

See [docs](https://crimx.github.io/tsur) for more details.

## License

MIT @ [CRIMX](https://github.com/crimx)
