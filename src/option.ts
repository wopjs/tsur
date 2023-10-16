import type { UnwrapErr, UnwrapOk } from "./result";

import { Result } from "./result";
import { ANY, OPTION } from "./utils";

type Falsy = false | 0 | 0n | "" | null | undefined;
type Truthy<T> = Exclude<T, Falsy>;

export type UnwrapOption<T, Default = T> = T extends Option<infer U>
  ? U
  : Default;

/**
 * The `Option` type is an immutable representation of an optional value:
 * every `Option` is either `Some` and contains a value, or `None` and does not.
 */
export class Option<T = any> {
  /**
   * @param value - A value of type `T`
   * @returns Wrap a value into an `Option`.
   */
  public static Some = <T>(value: T): Some<T> =>
    Object.freeze(new Option(value)) as Some<T>;

  /**
   * The `None` value.
   */
  public static None: None = Option.Some(ANY as never);

  /**
   * Wrap a value in an `Option` if the value is truthy.
   *
   * @param value - A value of type `T`
   */
  public static from<T>(value: T): Option<Truthy<T>>;
  /**
   * Wrap a value in an `Option` if the value satisfies the predicate.
   *
   * @param source - Source value
   * @param predicate - A function that returns `true` if the value satisfies the predicate, otherwise `false`
   * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
   */
  public static from<TSource, T extends TSource = TSource>(
    source: TSource,
    predicate: (source: TSource) => source is T,
    thisArg?: any
  ): Option<T>;
  /**
   * Wrap a value in an `Option` if the value satisfies the predicate.
   *
   * @param source - Source value
   * @param predicate - A function that returns `true` if the value satisfies the predicate, otherwise `false`
   */
  public static from<TSource, T extends TSource = TSource>(
    source: TSource,
    predicate: (source: TSource) => boolean,
    thisArg?: any
  ): Option<T>;
  public static from<TSource, T extends TSource = TSource>(
    source: TSource,
    predicate?: (source: TSource) => boolean,
    thisArg?: any
  ): Option<T> {
    return (predicate ? predicate.call(thisArg, source) : source)
      ? Option.Some(source as T)
      : Option.None;
  }

  /**
   * @returns `true` if the given value is an `Option`.
   *
   * @param maybeOption - A value that might be an `Option`
   */
  public static isOption<T>(maybeOption: unknown): maybeOption is Option<T> {
    return !!maybeOption && (maybeOption as Option<T>)[OPTION] === 1;
  }
  private readonly [OPTION] = 1;

  private readonly _value_: T;

  private constructor(value: T) {
    this._value_ = value;
  }

  /**
   * Returns an iterator over the possibly contained value.
   *
   * The iterator yields one value if the result is `Some`, otherwise none.
   */
  *[Symbol.iterator]() {
    if (this.isSome()) {
      yield this._value_;
    }
  }

  /**
   * @returns `true` if the `Option` is a `Some`.
   */
  public isSome(): this is Some<T> {
    return this._value_ !== ANY;
  }

  /**
   * @returns `true` if the `Option` is a `None`.
   */
  public isNone(): this is None {
    return this._value_ === ANY;
  }

  /**
   * @returns `true` if the `Option` is a `Some` and and the value inside of it matches a predicate.
   *
   * @param predicate - A function that returns `true` if the value satisfies the predicate, otherwise `false`
   * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
   */
  public isSomeAnd(
    predicate: (value: T) => boolean,
    thisArg?: any
  ): this is Some<T> {
    return this.isSome() && predicate.call(thisArg, this._value_);
  }

  /**
   * Whether `this` value is the same as the other `Option`.
   *
   * @param other - Another `Option` or any value
   * @returns `true` if the other is an `Option` and the value are the same as `this` value via `Object.is`.
   */
  public isSame(other: unknown): boolean {
    return Option.isOption(other)
      ? Object.is(this._value_, other._value_)
      : false;
  }

  /**
   * @returns `None` if the `Option` is `None`, otherwise returns `optionB`.
   *
   * Arguments passed to `and` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `andThen`, which is lazily evaluated.
   *
   * @param optionB - An `Option`
   */
  public and<B>(optionB: Option<B>): Option<B> {
    return this.isSome() ? optionB : Option.None;
  }

  /**
   * @returns `None` if the `Option` is `None`, otherwise calls `getOptionB` with the wrapped value and returns the result.
   *
   * @param getOptionB - A function that returns an `Option`
   * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
   */
  public andThen<B>(
    getOptionB: (value: T) => Option<B>,
    thisArg?: any
  ): Option<B> {
    return this.isSome() ? getOptionB.call(thisArg, this._value_) : Option.None;
  }

  /**
   * @returns the `Option` if it contains a value, otherwise returns `optionB`.
   *
   * Arguments passed to or are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `orElse`, which is lazily evaluated.
   *
   * @param optionB - An `Option`
   */
  public or<B>(optionB: Option<B>): Option<T | B> {
    return this.isSome() ? this : optionB;
  }

  /**
   * @returns the `Option` if it contains a value, otherwise calls `getOptionB` and returns the result.
   *
   * @param getOptionB - A function that returns an `Option`
   * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
   */
  public orElse<B>(getOptionB: () => Option<B>, thisArg?: any): Option<T | B> {
    return this.isSome() ? this : getOptionB.call(thisArg);
  }

  /**
   * @returns `Some` if exactly one of `this` and `optionB` is `Some`, otherwise returns `None`.
   *
   * @param optionB - An `Option`
   */
  public xor<B>(optionB: Option<B>): Option<T | B> {
    return this.isSome() ? (optionB.isSome() ? Option.None : this) : optionB;
  }

  /**
   * Zips `this` with another `Option`.
   *
   * @returns `Some([a, b])` if `this` is `Some(a)` and other is `Some(b)`, otherwise `None`.
   *
   * @param optionB
   */
  public zip<B>(optionB: Option<B>): Option<[T, B]> {
    return this.isSome() && optionB.isSome()
      ? Option.Some([this._value_, optionB._value_])
      : Option.None;
  }

  /**
   * Zips `this` and another `Option` with function `fn`.
   *
   * @returns `Some(fn(a, b))` if `this` is `Some(a)` and other is `Some(b)`, otherwise `None`.
   *
   * @param optionB
   * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
   */
  public zipWith<B, U>(
    optionB: Option<B>,
    fn: (valueA: T, valueB: B) => U,
    thisArg?: any
  ): Option<U> {
    return this.isSome() && optionB.isSome()
      ? Option.Some(fn.call(thisArg, this._value_, optionB._value_))
      : Option.None;
  }

  /**
   * Unzips an `Option` containing a tuple of two `Option`s.
   *
   * @returns `[Some(a), Some(b)]` if `this` is `Some([a, b])`, otherwise `[None, None]`.
   */
  public unzip(): [
    Option<T extends any[] ? T[0] : unknown>,
    Option<T extends any[] ? T[1] : unknown>
  ] {
    return this.isSome() && Array.isArray(this._value_)
      ? [this._value_[0], this._value_[1]]
      : [Option.None, Option.None];
  }

  /**
   * Converts from `Option<Option<T>>` to `Option<T>`
   */
  public flatten(): Option<UnwrapOption<T>> {
    return this.isSome() && Option.isOption<UnwrapOption<T>>(this._value_)
      ? this._value_
      : (this as Option<UnwrapOption<T>>);
  }

  /**
   * Returns `None` if the `Option` is `None`, otherwise calls predicate with the wrapped value and returns:
   * - `Some(t)` if predicate returns `true` (where `t` is the wrapped value), and
   * - `None` if predicate returns `false`.
   *
   * @param predicate - A function that returns `true` or `false`
   * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
   */
  public filter(predicate: (value: T) => boolean, thisArg?: any): Option<T> {
    return this.isSome() && predicate.call(thisArg, this._value_)
      ? this
      : Option.None;
  }

  /**
   * Maps an `Option<T>` to `Option<U>` by applying a function to a contained value (if `Some`) or returns `None` (if `None`).
   *
   * @param fn - A function that maps a value to another value
   * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
   * @returns `None` if the `Option` is `None`, otherwise returns `Some(fn(value))`.
   */
  public map<U>(fn: (value: T) => U, thisArg?: any): Option<U> {
    return this.isSome()
      ? Option.Some(fn.call(thisArg, this._value_))
      : Option.None;
  }

  /**
   * Transposes an `Option` of a `Result` into a `Result` of an `Option`.
   *
   * None will be mapped to `Ok(None)`. `Some(Ok(_))` and `Some(Err(_))` will be mapped to `Ok(Some(_))` and `Err(_)`.
   */
  public transpose(): Result<Option<UnwrapOk<T>>, UnwrapErr<T, any>> {
    return this.isSome()
      ? Result.isResult<UnwrapOk<T>, UnwrapErr<T, any>>(this._value_)
        ? this._value_.map(Option.Some)
        : Result.Ok(this._value_ as Option<UnwrapOk<T>>)
      : Result.Ok(Option.None);
  }

  /**
   * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to `Ok(v)` and None to `Err(err)`.
   *
   * Arguments passed to `okOr` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `okOrElse`, which is lazily evaluated.
   *
   * @param error - The error value for `Err` if the `Option` is `None`.
   */
  public okOr<E>(error: E): Result<T, E> {
    return this.isSome() ? Result.Ok(this._value_) : Result.Err(error);
  }

  /**
   * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to `Ok(v)` and `None` to `Err(err())`.
   *
   * @param error - A function that returns the error value for `Err` if the `Option` is `None`.
   * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
   */
  public okOrElse<E>(error: () => E, thisArg?: any): Result<T, E> {
    return this.isSome()
      ? Result.Ok(this._value_)
      : Result.Err(error.call(thisArg));
  }

  /**
   * @returns the contained `Some` value.
   *
   * @throws if the value is a None.
   *
   * @param message - Optional Error message
   */
  public unwrap(message = "called `Option.unwrap()` on a `None` value"): T {
    if (this.isSome()) {
      return this._value_;
    }
    throw new Error(message);
  }

  /**
   * @returns the contained `Some` value or `undefined` otherwise.
   */
  public unwrapOr(): T | undefined;
  /**
   * @returns the contained `Some` value or a provided default.
   *
   * Arguments passed to `unwrapOr` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `unwrapOrElse`, which is lazily evaluated.
   *
   * @param defaultValue - default value
   */
  public unwrapOr<U>(defaultValue: U): T | U;
  public unwrapOr(defaultValue?: T): T | undefined {
    return this.isSome() ? this._value_ : defaultValue;
  }

  /**
   * @returns the contained `Some` value or computes it from a closure.
   *
   * @param fn - A function that computes a default value.
   * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
   */
  public unwrapOrElse<U>(fn: () => U, thisArg?: any): T | U {
    return this.isSome() ? this._value_ : fn.call(thisArg);
  }
}

/**
 * @param value - A value of type `T`
 * @returns Wrap a value into an `Option`.
 */
export const Some = Option.Some;
export type Some<T> = Option<T>;

/**
 * The `None` value.
 */
export const None = Option.None;
export type None = Option<never>;
