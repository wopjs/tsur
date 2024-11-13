import type { UnwrapOption } from "./option";

import { Option } from "./option";
import { SPECIES, SPECIES_RESULT } from "./utils";

export type UnwrapOk<T, Default = T> = T extends Result<infer U> ? U : Default;
export type UnwrapErr<E, Default = E> =
  E extends Result<infer _S, infer U> ? U : Default;

export interface ResultMatcher<T = any, E = any, U = any> {
  Ok: (value: T) => U;
  Err: (error: E) => U;
}

/**
 * The `Result` type is an immutable representation of either success (`Ok`) or failure (`Err`).
 */
export class Result<T = any, E = any> {
  /**
   * @param value - A value of type `T`
   * @returns Wrap a value into an `Result`.
   */
  public static readonly Ok = <T, E = any>(value: T): Result<T, E> =>
    Object.freeze(new Result<T, E>(value, true)) as Result<T, E>;

  /**
   * @param error - An error of type `E`
   * @returns Wrap an error into an `Result`.
   */
  public static readonly Err = <E, T = any>(error: E): Result<T, E> =>
    Object.freeze(new Result<T, E>(error, false)) as Result<T, E>;

  /**
   * `Err` if the value is an `Error`.
   *
   * @param value - A value of type `T`
   */
  public static from<T = any, E extends Error = Error>(
    source: T | E
  ): Result<T, E>;
  /**
   * `OK` if the value satisfies the predicate, otherwise `Err`
   *
   * @param source - Source value
   * @param predicate - A function that returns `true` if the value satisfies the predicate, otherwise `false`
   * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
   */
  public static from<T = any, E = any>(
    source: T | E,
    predicate: (source: T | E) => source is T,
    thisArg?: any
  ): Result<T, E>;
  /**
   * `OK` if the value satisfies the predicate, otherwise `Err`
   *
   * @param source - Source value
   * @param predicate - A function that returns `true` if the value satisfies the predicate, otherwise `false`
   * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
   */
  public static from<T = any, E = any>(
    source: T | E,
    predicate: (source: T | E) => boolean,
    thisArg?: any
  ): Result<T, E>;
  public static from<T = any, E = any>(
    source: T | E,
    predicate?: (source: T | E) => boolean,
    thisArg?: any
  ): Result<T> {
    return (
      predicate ? predicate.call(thisArg, source) : !(source instanceof Error)
    )
      ? Result.Ok(source as T)
      : Result.Err(source as E);
  }

  /**
   * `Ok` if the `fn` returns a value, `Err` if the `fn` throws.
   * @param fn
   * @returns `Ok` with the returned value or `Err` with the exception error.
   */
  public static try<T = any, E = any, TArgs extends any[] = []>(
    fn: (...args: TArgs) => T,
    ...args: TArgs
  ): Result<T, E> {
    try {
      return Result.Ok(fn(...args));
    } catch (error: any) {
      return Result.Err(error);
    }
  }

  /**
   * `Ok` if the `fn` returned Promise resolves a value, `Err` if the `fn` throws or the Promise rejected.
   * @param fn
   * @returns `Ok` with the resolved value or `Err` with the exception error or the rejected value.
   */
  public static async tryAsync<T = any, E = any, TArgs extends any[] = []>(
    fn: (...args: TArgs) => T,
    ...args: TArgs
  ): Promise<Result<T, E>> {
    try {
      return Result.Ok(await fn(...args));
    } catch (error: any) {
      return Result.Err(error);
    }
  }

  /**
   * @returns `true` if the given value is an `Result`.
   *
   * @param maybeResult - A value that might be an `Result`
   */
  public static isResult<T, E>(
    maybeResult: unknown
  ): maybeResult is Result<T, E> {
    return (
      !!maybeResult && (maybeResult as Result<T>)[SPECIES] === SPECIES_RESULT
    );
  }

  /**
   * @returns `true` if the both are `Result` and the `Ok` value or `Err` error are the same via `Object.is`.
   *
   * @param a - An `Result` or any value
   * @param b - An `Result` or any value
   */
  public static isSame(a: unknown, b: unknown): boolean {
    return Result.isResult(a) && Result.isResult(b)
      ? Object.is(a._value, b._value)
      : false;
  }

  private readonly [SPECIES] = SPECIES_RESULT;

  private readonly _value: T | E;
  private readonly _ok: boolean;

  private constructor(value: T | E, ok: boolean) {
    this._value = value;
    this._ok = ok;
  }

  /**
   * Returns an iterator over the possibly contained value.
   *
   * The iterator yields one value if the result is `Ok`, otherwise none.
   */
  *[Symbol.iterator]() {
    if (this._ok) {
      yield this._value as T;
    }
  }

  /**
   * @returns `true` if the `Result` is an `Ok`.
   */
  public isOk(): boolean {
    return this._ok;
  }

  /**
   * @returns `true` if the `Result` is an `Err`.
   */
  public isErr(): boolean {
    return !this._ok;
  }

  /**
   * @returns `true` if the `Result` is an `Ok` and and the value inside of it matches a predicate.
   * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
   */
  public isOkAnd(predicate: (value: T) => boolean, thisArg?: any): boolean {
    return this._ok && predicate.call(thisArg, this._value as T);
  }

  /**
   * @returns `true` if the `Result` is an `Err` and and the error inside of it matches a predicate.
   * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
   */
  public isErrAnd(predicate: (error: E) => boolean, thisArg?: any): boolean {
    return !this._ok && predicate.call(thisArg, this._value as E);
  }

  /**
   * Whether `this` `Ok` value or `Err` error is the same as the other `Result`.
   *
   * @param other - Another `Result` or any value
   * @returns `true` if the other is an `Result` and the `Ok` value or `Err` error is the same as `this` via `Object.is`.
   */
  public isSame(other: unknown): boolean {
    return Result.isResult(other)
      ? Object.is(this._value, other._value)
      : false;
  }

  public and<BT, BE = any>(resultB: Result<BT, BE>): Result<BT, E | BE> {
    return this._ok ? resultB : (this as Err<E | BE>);
  }

  /**
   * @returns `Err` if the `Result` is `Err`, otherwise calls `getOptionB` with the wrapped value and returns the result.
   *
   * @param getResultB - A function that returns a `Result`
   * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
   */
  public andThen<BT, BE = any>(
    getResultB: (value: T) => Result<BT, BE>,
    thisArg?: any
  ): Result<BT, BE | E> {
    return this._ok
      ? getResultB.call(thisArg, this._value as T)
      : (this as Err<BE | E>);
  }

  /**
   * @returns the `Result` if it is `Ok`, otherwise returns `resultB`.
   *
   * Arguments passed to `or` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `orElse`, which is lazily evaluated.
   *
   * @param resultB - A `Result`
   */
  public or<BT, BE = any>(resultB: Result<BT, BE>): Result<T | BT, E | BE> {
    return this._ok ? this : resultB;
  }

  /**
   * @returns the `Result` if it contains a value, otherwise calls `getResultB` and returns the result.
   *
   * @param getResultB - A function that returns an `Result`
   * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
   */
  public orElse<BT, BE = any>(
    getResultB: () => Result<BT, BE>,
    thisArg?: any
  ): Result<T | BT, E | BE> {
    return this._ok ? this : getResultB.call(thisArg);
  }

  /**
   * Converts from `Option<Option<T>>` to `Option<T>`
   */
  public flatten(): Result<UnwrapOk<T>, E | UnwrapErr<E>> {
    return this._ok && Result.isResult<UnwrapOk<T>, UnwrapErr<E>>(this._value)
      ? this._value
      : (this as Result<UnwrapOk<T>, E | UnwrapErr<E>>);
  }

  /**
   * Maps an `Result<T, E>` to `Result<U, E>` by applying a function to a contained `Ok` value, leaving an `Err` value untouched.
   *
   * @param fn - A function that maps a value to another value
   * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
   * @returns `Err` if the `Result` is `Err`, otherwise returns `Ok(fn(value))`.
   */
  public map<U>(fn: (value: T) => U, thisArg?: any): Result<U, E> {
    return this._ok
      ? Result.Ok(fn.call(thisArg, this._value as T))
      : (this as Err<E>);
  }

  /**
   * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained `Err` value, leaving an `Ok` value untouched.
   *
   * This function can be used to pass through a successful result while handling an error.
   *
   * @param fn - A function that maps a error to another error
   * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
   * @returns `Ok` if the `Result` is `Ok`, otherwise returns `Err(fn(error))`.
   */
  public mapErr<U>(fn: (error: E) => U, thisArg?: any): Result<T, U> {
    return this._ok
      ? (this as Ok<T>)
      : Result.Err(fn.call(thisArg, this._value as E));
  }

  /**
   * Transposes a `Result(Option)` into `Option(Result)`.
   *
   * - `Ok(Some(_))` will be mapped to `Some(Ok(_))
   * - `Err(_)` will be mapped to `Some(Err(_))`.
   * - `Ok(_)` will be mapped to `Some(Ok(_))`.
   */
  public transpose(): Option<Result<UnwrapOption<T>, E>> {
    return this._ok
      ? Option.isOption<UnwrapOption<T>>(this._value)
        ? this._value.map(Result.Ok)
        : Option.Some(this)
      : Option.None;
  }

  /**
   * Converts from `Result<T, E>` to `Option<T>` and discarding the error, if any.
   */
  public ok(): Option<T> {
    return this._ok ? Option.Some(this._value) : Option.None;
  }

  /**
   * Converts from `Result<T, E>` to `Option<E>` and discarding the value, if any.
   */
  public err(): Option<E> {
    return this._ok ? Option.None : Option.Some(this._value);
  }

  /**
   * @returns the contained `Ok` value.
   *
   * @throws if the value is an `Err`.
   *
   * @param message - Optional Error message
   */
  public unwrap(message = "called `Result.unwrap()` on an `Err`"): T {
    if (this._ok) {
      return this._value as T;
    }
    throw new Error(message);
  }

  /**
   * @returns the contained `Ok` value or `undefined` otherwise.
   */
  public unwrapOr(): T | undefined;
  /**
   * @returns the contained `Ok` value or a provided default.
   *
   * Arguments passed to `unwrapOr` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `unwrapOrElse`, which is lazily evaluated.
   *
   * @param defaultValue - default value
   */
  public unwrapOr<U>(defaultValue: U): T | U;
  public unwrapOr(defaultValue?: T): T | undefined {
    return this._ok ? (this._value as T) : defaultValue;
  }

  /**
   * @returns the contained `Ok` value or computes it from a closure.
   * @param fn - A function that computes a default value.
   * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
   */
  public unwrapOrElse<U>(fn: () => U, thisArg?: any): T | U {
    return this._ok ? (this._value as T) : fn.call(thisArg);
  }

  /**
   * @returns the contained `Err` error.
   *
   * @throws if the error is an `Ok`.
   *
   * @param message - Optional Error message
   */
  public unwrapErr(
    message = "called `Result.unwrapErr()` on an `Ok` value"
  ): E {
    if (this._ok) {
      throw new Error(message);
    }
    return this._value as E;
  }

  /**
   * @returns the contained `Err` error or `undefined` otherwise.
   *
   * Arguments passed to `unwrapErrOr` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `unwrapErrOrElse`, which is lazily evaluated.
   */
  public unwrapErrOr(): E | undefined;
  /**
   * @returns the contained `Err` error or a provided default.
   *
   * Arguments passed to `unwrapErrOr` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `unwrapErrOrElse`, which is lazily evaluated.
   *
   * @param defaultError - default error
   */
  public unwrapErrOr<U>(defaultError: U): E | U;
  public unwrapErrOr(defaultError?: E): E | undefined {
    return this._ok ? defaultError : (this._value as E);
  }

  /**
   * @returns the contained `Err` error or computes it from a closure.
   * @param fn - A function that computes a default value.
   * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
   */
  public unwrapErrOrElse<U>(fn: () => U, thisArg?: any): E | U {
    return this._ok ? fn.call(thisArg) : (this._value as E);
  }

  /**
   * Extract the value from an `Result` in a way that handles both the `Ok` and `Err` cases.
   *
   * @param Ok - A function that returns a value if the `Result` is a `Ok`.
   * @param Err - A function that returns a value if the `Result` is a `Err`.
   * @returns The value returned by the provided function.
   */
  public match<U>(Ok: (value: T) => U, Err: (error: E) => U): U {
    return this._ok ? Ok(this._value as T) : Err(this._value as E);
  }

  public toString(): string {
    return `${this._ok ? "Ok" : "Err"}(${this._value})`;
  }
}

/**
 * @param value - A value of type `T`
 * @returns Wrap a value into an `Result`.
 */
export const Ok = /* @__PURE__ */ (() => Result.Ok)();
export type Ok<T> = Result<T, any>;

/**
 * @param error - An error of type `E`
 * @returns Wrap an error into an `Result`.
 */
export const Err = /* @__PURE__ */ (() => Result.Err)();
export type Err<E> = Result<any, E>;
