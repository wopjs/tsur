import type { UnwrapOption } from "./option";

import { Option } from "./option";
import { ANY, RESULT } from "./utils";

export type UnwrapOk<T, Default = T> = T extends Result<infer U> ? U : Default;
export type UnwrapErr<E, Default = E> = E extends Result<infer _S, infer U>
  ? U
  : Default;

/**
 * The `Result` type is an immutable representation of either success (`Ok`) or failure (`Err`).
 */
export class Result<T = any, E = any> {
  /**
   * @param value - A value of type `T`
   * @returns Wrap a value into an `Result`.
   */
  public static Ok = <T, E = never>(value: T): Result<T, E> =>
    Object.freeze(new Result(value, ANY)) as Result<T, E>;

  /**
   * @param error - An error of type `E`
   * @returns Wrap an error into an `Result`.
   */
  public static Err = <E, T = never>(error: E): Result<T, E> =>
    Object.freeze(new Result(ANY, error)) as Result<T, E>;

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
    return !!maybeResult && (maybeResult as Result<T>)[RESULT] === 1;
  }
  private [RESULT] = 1;

  private _value_: T;
  private _error_: E;

  private constructor(value: T, error: E) {
    this._value_ = value;
    this._error_ = error;
  }

  /**
   * Returns an iterator over the possibly contained value.
   *
   * The iterator yields one value if the result is `Ok`, otherwise none.
   */
  *[Symbol.iterator]() {
    if (this.isOk()) {
      yield this._value_;
    }
  }

  /**
   * @returns `true` if the `Result` is an `Ok`.
   */
  public isOk(): this is Ok<T> {
    return this._value_ !== ANY;
  }

  /**
   * @returns `true` if the `Result` is an `Err`.
   */
  public isErr(): this is Err<E> {
    return this._error_ !== ANY;
  }

  /**
   * @returns `true` if the `Result` is an `Ok` and and the value inside of it matches a predicate.
   * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
   */
  public isOkAnd(
    predicate: (value: T) => boolean,
    thisArg?: any
  ): this is Ok<T> {
    return this.isOk() && predicate.call(thisArg, this._value_);
  }

  /**
   * @returns `true` if the `Result` is an `Err` and and the error inside of it matches a predicate.
   * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
   */
  public isErrAnd(
    predicate: (value: T) => boolean,
    thisArg?: any
  ): this is Err<E> {
    return this.isErr() && predicate.call(thisArg, this._value_);
  }

  /**
   * Whether `this` value is the same as the other `Result`.
   *
   * @param other - Another `Result` or any value
   * @returns `true` if the other is an `Result` and the value is the same as `this` value via `Object.is`.
   */
  public isSame(other: unknown): boolean {
    return Result.isResult(other)
      ? Object.is(this._value_, other._value_)
      : false;
  }

  /**
   * Whether `this` error is the same as the other `Result`.
   *
   * @param other - Another `Result` or any value
   * @returns `true` if the other is an `Option` and the error is the same as `this` error via `Object.is`.
   */
  public isSameErr(other: unknown): boolean {
    return Result.isResult(other)
      ? Object.is(this._error_, other._error_)
      : false;
  }

  public and<BT, BE = any>(resultB: Result<BT, BE>): Result<BT, E | BE> {
    return this.isOk() ? resultB : this;
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
    return this.isOk() ? getResultB.call(thisArg, this._value_) : this;
  }

  /**
   * @returns the `Result` if it is `Ok`, otherwise returns `resultB`.
   *
   * Arguments passed to `or` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `orElse`, which is lazily evaluated.
   *
   * @param resultB - A `Result`
   */
  public or<BT, BE = any>(resultB: Result<BT, BE>): Result<T | BT, E | BE> {
    return this.isOk() ? this : resultB;
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
    return this.isOk() ? this : getResultB.call(thisArg);
  }

  /**
   * Converts from `Option<Option<T>>` to `Option<T>`
   */
  public flatten(): Result<UnwrapOk<T>, E | UnwrapErr<E>> {
    return this.isOk() &&
      Result.isResult<UnwrapOk<T>, UnwrapErr<E>>(this._value_)
      ? this._value_
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
    return this.isOk() ? Result.Ok(fn.call(thisArg, this._value_)) : this;
  }

  /**
   * Transposes a `Result` of an `Option` into an `Option` of a `Result`.
   * `Ok(Some(_))` and `Err(_)` will be mapped to `Some(Ok(_))` and `Some(Err(_))`.
   */
  public transpose(): Option<Result<UnwrapOption<T>, E>> {
    return this.isOk()
      ? Option.isOption<UnwrapOption<T>>(this._value_)
        ? this._value_.map(Result.Ok)
        : Option.Some(this as Result<UnwrapOption<T>, E>)
      : Option.None;
  }

  /**
   * Converts from `Result<T, E>` to `Option<T>` and discarding the error, if any.
   */
  public ok(): Option<T> {
    return this.isOk() ? Option.Some(this._value_) : Option.None;
  }

  /**
   * Converts from `Result<T, E>` to `Option<E>` and discarding the value, if any.
   */
  public err(): Option<E> {
    return this.isErr() ? Option.Some(this._error_) : Option.None;
  }

  /**
   * @returns the contained `Ok` value.
   *
   * @throws if the value is an `Err`.
   *
   * @param message - Optional Error message
   */
  public unwrap(
    message = "called `Result.unwrap()` on an `Err` error: " + this._error_
  ): T {
    if (this.isOk()) {
      return this._value_;
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
    return this.isOk() ? this._value_ : defaultValue;
  }

  /**
   * @returns the contained `Ok` value or computes it from a closure.
   * @param fn - A function that computes a default value.
   * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
   */
  public unwrapOrElse<U>(fn: () => U, thisArg?: any): T | U {
    return this.isOk() ? this._value_ : fn.call(thisArg);
  }

  /**
   * @returns the contained `Err` error.
   *
   * @throws if the error is an `Ok`.
   *
   * @param message - Optional Error message
   */
  public unwrapErr(
    message = "called `Result.unwrapErr()` on an `Ok` value: " + this._value_
  ): T {
    if (this.isErr()) {
      return this._value_;
    }
    throw new Error(message);
  }

  /**
   * @returns the contained `Err` error or `undefined` otherwise.
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
    return this.isErr() ? this._error_ : defaultError;
  }

  /**
   * @returns the contained `Err` error or computes it from a closure.
   * @param fn - A function that computes a default value.
   * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
   */
  public unwrapErrOrElse<U>(fn: () => U, thisArg?: any): E | U {
    return this.isErr() ? this._error_ : fn.call(thisArg);
  }
}

/**
 * @param value - A value of type `T`
 * @returns Wrap a value into an `Result`.
 */
export const Ok = Result.Ok;
export type Ok<T> = Result<T, any>;

/**
 * @param error - An error of type `E`
 * @returns Wrap an error into an `Result`.
 */
export const Err = Result.Err;
export type Err<E> = Result<any, E>;
