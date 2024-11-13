import { Option } from "./option";
import { positiveNumber, truePredicate } from "./utils";

/**
 * `filterMap` filers and maps an iterable at the same time.
 *
 * It makes chains of `filter` and `map` more concise, as it shortens `map().filter().map()` to a single call.
 *
 * @param arr - An array
 * @param fn - A function that produces an `Option`.
 * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
 * @returns An array of filtered and mapped values.
 */
export const filterMap = <T, U>(
  arr: T[],
  fn: (value: T, index: number, array: T[]) => Option<U>,
  thisArg?: any
): U[] => {
  const results: U[] = [];
  for (let i = 0; i < arr.length; i++) {
    const result = fn.call(thisArg, arr[i], i, arr);
    if (result.isSome()) {
      results.push(result.unwrap());
    }
  }
  return results;
};

/**
 * `mapWhile` maps an iterable until the first `None` is encountered.
 *
 * @param arr - An array
 * @param fn - A function that produces an `Option`.
 * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
 * @returns An array of mapped values.
 */
export const mapWhile = <T, U>(
  arr: T[],
  fn: (value: T, index: number, array: T[]) => Option<U>,
  thisArg?: any
): U[] => {
  const results: U[] = [];
  for (let i = 0; i < arr.length; i++) {
    const result = fn.call(thisArg, arr[i], i, arr);
    if (result.isNone()) {
      break;
    }
    results.push(result.unwrap());
  }
  return results;
};

/**
 * `reduceWhile` reduces an iterable until the first `None` is encountered.
 *
 * @param arr - An array
 * @param fn - A function that produces an `Option`.
 * @param initialValue - The initial value.
 * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
 * @returns The reduced value.
 */
export const reduceWhile = <T, U = T>(
  arr: T[],
  fn: (
    previousValue: U,
    currentValue: T,
    currentIndex: number,
    array: T[]
  ) => Option<U>,
  initialValue: U,
  thisArg?: any
): U => {
  let acc = initialValue;
  for (let i = 0; i < arr.length; i++) {
    const result = fn.call(thisArg, acc, arr[i], i, arr);
    if (result.isNone()) {
      break;
    }
    acc = result.unwrap();
  }
  return acc;
};

/**
 * Returns the index of the first element in the array that satisfies the provided testing function. Otherwise `None` is returned.
 *
 * @param arr - An array
 * @param predicate - A predicate function.
 * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
 * @returns The index of the first item that matches the predicate, or `None` if no item matches.
 */
export const firstIndex = <T>(
  arr: T[],
  predicate: (value: T, index: number, array: T[]) => boolean,
  thisArg?: any
): Option<number> =>
  Option.from(arr.findIndex(predicate, thisArg), positiveNumber);

/**
 * Returns the index of the last element in the array where predicate is true, and `None` otherwise.
 *
 * @param arr - An array
 * @param predicate - lastIndex calls predicate once for each element of the array, in backward order, until it finds one where predicate returns true.
 * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
 * @returns The index of the last item that matches the predicate, or `None` if no item matches.
 */
export const lastIndex = <T>(
  arr: T[],
  predicate: (value: T, index: number, array: T[]) => boolean,
  thisArg?: any
): Option<number> =>
  Option.from(arr.findLastIndex(predicate, thisArg), positiveNumber);

/**
 * `first` finds the first item that matches a predicate. Returns the first item of array if no predicate is provided.
 *
 * @param arr - An array
 * @param predicate - A predicate function.
 * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, the first element is returned.
 * @returns The first item that matches the predicate, or `None` if no item matches.
 */
export const first = <T>(
  arr: T[],
  predicate: (value: T, index: number, array: T[]) => boolean = truePredicate,
  thisArg?: any
): Option<T> => firstIndex(arr, predicate, thisArg).map(valueAtIndex, arr);

/**
 * `last` finds the last item that matches a predicate. Returns the last item of array if no predicate is provided.
 *
 * @param arr - An array
 * @param predicate - A predicate function.
 * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, the last element is returned.
 * @returns The last item that matches the predicate, or `None` if no item matches.
 */
export const last = <T>(
  arr: T[],
  predicate: (value: T, index: number, array: T[]) => boolean = truePredicate,
  thisArg?: any
): Option<T> => lastIndex(arr, predicate, thisArg).map(valueAtIndex, arr);

/**
 * Applies function to the elements of iterator and returns the first non-none result.
 *
 * `firstMap(fn)` is the lighter version of `filterMap(fn).first()`.
 *
 * @param arr - An array
 * @param fn - A function that produces an `Option`.
 * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
 * @returns The first non-none result.
 */
export const firstMap = <T, U>(
  arr: T[],
  fn: (value: T, index: number, array: T[]) => Option<U>,
  thisArg?: any
): Option<U> => {
  for (let i = 0; i < arr.length; i++) {
    const result = fn.call(thisArg, arr[i], i, arr);
    if (result.isSome()) {
      return result;
    }
  }
  return Option.None;
};

/**
 * `lastMap(fn)` is the lighter version of `filterMap(fn).last()`.
 *
 * @param arr - An array
 * @param fn - A function that produces an `Option`.
 * @param thisArg - If provided, it will be used as the this value for each invocation of predicate. If it is not provided, `undefined` is used instead.
 * @returns The last non-none result.
 */
export const lastMap = <T, U>(
  arr: T[],
  fn: (value: T, index: number, array: T[]) => Option<U>,
  thisArg?: any
): Option<U> => {
  for (let i = arr.length - 1; i >= 0; i--) {
    const result = fn.call(thisArg, arr[i], i, arr);
    if (result.isSome()) {
      return result;
    }
  }
  return Option.None;
};

function valueAtIndex<T = any>(this: T[], index: number): T {
  return this[index];
}
