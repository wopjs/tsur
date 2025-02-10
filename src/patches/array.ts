import {
  mapWhile,
  reduceWhile,
  firstIndex,
  lastIndex,
  first,
  last,
  firstMap,
  lastMap,
  filterMap,
} from "../array";
import { type Option } from "../option";

declare global {
  interface Array<T> {
    /**
     * From tsur.
     *
     * `filterMap` filers and maps an iterable at the same time.
     *
     * It makes chains of `filter` and `map` more concise, as it shortens `map().filter().map()` to a single call.
     *
     * @param fn - A function that produces an `Option`.
     * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
     * @returns An array of filtered and mapped values.
     */
    $filterMap<U>(
      fn: (value: T, index: number, array: T[]) => Option<U>,
      thisArg?: any
    ): U[];

    /**
     * From tsur.
     *
     * `mapWhile` maps an iterable until the first `None` is encountered.
     *
     * @param fn - A function that produces an `Option`.
     * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
     * @returns An array of mapped values.
     */
    $mapWhile<U>(
      fn: (value: T, index: number, array: T[]) => Option<U>,
      thisArg?: any
    ): U[];

    /**
     * From tsur.
     *
     * `reduceWhile` reduces an iterable until the first `None` is encountered.
     *
     * @param fn - A function that produces an `Option`.
     * @param initialValue - The initial value.
     * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
     * @returns The reduced value.
     */
    $reduceWhile<U = T>(
      fn: (
        previousValue: U,
        currentValue: T,
        currentIndex: number,
        array: T[]
      ) => Option<U>,
      initialValue: U,
      thisArg?: any
    ): U;

    /**
     * From tsur.
     *
     * Returns the index of the first element in the array that satisfies the provided testing function. Otherwise `None` is returned.
     *
     * @param predicate - A predicate function.
     * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
     * @returns The index of the first item that matches the predicate, or `None` if no item matches.
     */
    $firstIndex(
      predicate: (value: T, index: number, array: T[]) => boolean,
      thisArg?: any
    ): Option<number>;

    /**
     * From tsur.
     *
     * Returns the index of the last element in the array where predicate is true, and `None` otherwise.
     *
     * @param predicate - lastIndex calls predicate once for each element of the array, in backward order, until it finds one where predicate returns true.
     * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
     * @returns The index of the last item that matches the predicate, or `None` if no item matches.
     */
    $lastIndex(
      predicate: (value: T, index: number, array: T[]) => boolean,
      thisArg?: any
    ): Option<number>;

    /**
     * From tsur.
     *
     * `first` finds the first item that matches a predicate. Returns the first item of array if no predicate is provided.
     *
     * @param predicate - A predicate function.
     * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
     * @returns The first item that matches the predicate, or `None` if no item matches.
     */
    $first(
      predicate?: (value: T, index: number, array: T[]) => boolean,
      thisArg?: any
    ): Option<T>;

    /**
     * From tsur.
     *
     * `last` finds the last item that matches a predicate. Returns the last item of array if no predicate is provided.
     *
     * @param predicate - A predicate function.
     * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
     * @returns The last item that matches the predicate, or `None` if no item matches.
     */
    $last(
      predicate?: (value: T, index: number, array: T[]) => boolean,
      thisArg?: any
    ): Option<T>;

    /**
     * From tsur.
     *
     * Applies function to the elements of iterator and returns the first non-none result.
     *
     * `firstMap(fn)` is the lighter version of `filterMap(fn).first()`.
     *
     * @param fn - A function that produces an `Option`.
     * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
     * @returns The first non-none result.
     */
    $firstMap<U>(
      fn: (value: T, index: number, array: T[]) => Option<U>,
      thisArg?: any
    ): Option<U>;

    /**
     * From tsur.
     *
     * `lastMap(fn)` is the lighter version of `filterMap(fn).last()`.
     *
     * @param fn - A function that produces an `Option`.
     * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
     * @returns The last non-none result.
     */
    $lastMap<U>(
      fn: (value: T, index: number, array: T[]) => Option<U>,
      thisArg?: any
    ): Option<U>;
  }
}

Array.prototype.$filterMap = function (this, fn, thisArg) {
  return filterMap(this, fn, thisArg);
};

Array.prototype.$mapWhile = function (this, fn, thisArg) {
  return mapWhile(this, fn, thisArg);
};

Array.prototype.$reduceWhile = function (this, fn, initialValue, thisArg) {
  return reduceWhile(this, fn, initialValue, thisArg);
};

Array.prototype.$firstIndex = function (this, predicate, thisArg) {
  return firstIndex(this, predicate, thisArg);
};

Array.prototype.$lastIndex = function (this, predicate, thisArg) {
  return lastIndex(this, predicate, thisArg);
};

Array.prototype.$first = function (this, predicate, thisArg) {
  return first(this, predicate, thisArg);
};

Array.prototype.$last = function (this, predicate, thisArg) {
  return last(this, predicate, thisArg);
};

Array.prototype.$firstMap = function (this, fn, thisArg) {
  return firstMap(this, fn, thisArg);
};

Array.prototype.$lastMap = function (this, fn, thisArg) {
  return lastMap(this, fn, thisArg);
};
