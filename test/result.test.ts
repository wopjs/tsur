import { describe, it, expect } from "vitest";

import { None, Result, Some, Ok, Err } from "../src";

describe("Result", () => {
  describe("Ok", () => {
    it("should return a Result object with the given value", () => {
      const value = 42;
      const result = Ok(value);
      expect(result).toBeInstanceOf(Result);
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
      expect(result.unwrap()).toBe(value);
    });
  });

  describe("Err", () => {
    it("should return a Result object with the given error", () => {
      const error = new Error("Something went wrong");
      const result = Err(error);
      expect(result).toBeInstanceOf(Result);
      expect(result.isOk()).toBe(false);
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBe(error);
    });
  });

  describe("from", () => {
    it("should return an Ok result if the value is not an Error", () => {
      const value = 42;
      const result = Result.from(value);
      expect(result).toBeInstanceOf(Result);
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
      expect(result.unwrap()).toBe(value);
    });

    it("should return an Err result if the value is an Error", () => {
      const error = new Error("Something went wrong");
      const result = Result.from(error);
      expect(result).toBeInstanceOf(Result);
      expect(result.isOk()).toBe(false);
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBe(error);
    });

    it("should return a Result base on predicate", () => {
      const value = 42;
      const result = Result.from(value, x => x > 10);
      expect(result).toBeInstanceOf(Result);
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
      expect(result.unwrap()).toBe(value);
    });
  });

  describe("try", () => {
    it("should return an Ok result if the function does not throw an error", () => {
      const fn = () => 42;
      const result = Result.try(fn);
      expect(result).toBeInstanceOf(Result);
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
      expect(result.unwrap()).toBe(42);
    });

    it("should return an Err result if the function throws an error", () => {
      const fn = () => {
        throw new Error("Something went wrong");
      };
      const result = Result.try(fn);
      expect(result).toBeInstanceOf(Result);
      expect(result.isOk()).toBe(false);
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBeInstanceOf(Error);
    });
  });

  describe("tryAsync", () => {
    it("should return an Ok result if the function does not throw an error", async () => {
      const fn = async () => 42;
      const result = await Result.tryAsync(fn);
      expect(result).toBeInstanceOf(Result);
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
      expect(result.unwrap()).toBe(42);
    });

    it("should return an Err result if the function throws an error", async () => {
      const fn = async () => {
        throw new Error("Something went wrong");
      };
      const result = await Result.tryAsync(fn);
      expect(result).toBeInstanceOf(Result);
      expect(result.isOk()).toBe(false);
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBeInstanceOf(Error);
    });
  });

  describe("[Symbol.iterator]", () => {
    it("should return an iterator that yields the value of an Ok result", () => {
      const result = Ok(42);
      const iterator = result[Symbol.iterator]();
      expect(iterator.next().value).toBe(42);
      expect(iterator.next().done).toBe(true);
    });

    it("should return an iterator that does not yield any values for an Err result", () => {
      const result = Err(new Error("Something went wrong"));
      const iterator = result[Symbol.iterator]();
      expect(iterator.next().done).toBe(true);
    });
  });

  describe("isResult", () => {
    it("should return true for a Result object", () => {
      const result = Ok(42);
      expect(Result.isResult(result)).toBe(true);
    });

    it("should return false for a non-Result object", () => {
      const obj = { foo: "bar" };
      expect(Result.isResult(obj)).toBe(false);
    });
  });

  describe("isOk", () => {
    it("should return true for an Ok result", () => {
      const value = 42;
      const result = Ok(value);
      expect(result.isOk()).toBe(true);
    });

    it("should return false for an Err result", () => {
      const error = new Error("Something went wrong");
      const result = Err(error);
      expect(result.isOk()).toBe(false);
    });
  });

  describe("isErr", () => {
    it("should return true for an Err result", () => {
      const error = new Error("Something went wrong");
      const result = Err(error);
      expect(result.isErr()).toBe(true);
    });

    it("should return false for an Ok result", () => {
      const value = 42;
      const result = Ok(value);
      expect(result.isErr()).toBe(false);
    });
  });

  describe("unwrap", () => {
    it("should return the value for an Ok result", () => {
      const value = 42;
      const result = Ok(value);
      expect(result.unwrap()).toBe(value);
    });

    it("should throw an error for an Err result", () => {
      const error = new Error("Something went wrong");
      const result = Err(error);
      expect(() => result.unwrap()).toThrow();
    });
  });

  describe("unwrapErr", () => {
    it("should return the error for an Err result", () => {
      const error = new Error("Something went wrong");
      const result = Err(error);
      expect(result.unwrapErr()).toBe(error);
    });

    it("should throw an error for an Ok result", () => {
      const value = 42;
      const result = Ok(value);
      expect(() => result.unwrapErr()).toThrow();
    });
  });

  describe("unwrapOr", () => {
    it("should return the value for an Ok result", () => {
      const value = 42;
      const result = Ok(value);
      expect(result.unwrapOr(0)).toBe(value);
    });

    it("should return the default value for an Err result", () => {
      const error = new Error("Something went wrong");
      const result = Err(error);
      expect(result.unwrapOr(0)).toBe(0);
    });
  });

  describe("unwrapOrElse", () => {
    it("should return the value for an Ok result", () => {
      const value = 42;
      const result = Ok(value);
      expect(result.unwrapOrElse(() => 0)).toBe(value);
    });

    it("should return the result of the callback for an Err result", () => {
      const error = new Error("Something went wrong");
      const result = Err(error);
      expect(result.unwrapOrElse(() => 0)).toBe(0);
    });
  });

  describe("map", () => {
    it("should apply the callback to the value of an Ok result", () => {
      const value = 42;
      const result = Ok(value);
      const mappedResult = result.map(x => x * 2);
      expect(mappedResult.isOk()).toBe(true);
      expect(mappedResult.unwrap()).toBe(value * 2);
    });

    it("should not apply the callback to an Err result", () => {
      const error = new Error("Something went wrong");
      const result = Err(error);
      const mappedResult = result.map(x => x * 2);
      expect(mappedResult.isErr()).toBe(true);
      expect(mappedResult.unwrapErr()).toBe(error);
    });
  });

  describe("mapErr", () => {
    it("should apply the callback to the error of an Err result", () => {
      const error = new Error("Something went wrong");
      const result = Err(error);
      const mappedResult = result.mapErr(
        e => new Error(e.message.toUpperCase())
      );
      expect(mappedResult.isErr()).toBe(true);
      expect(mappedResult.unwrapErr().message).toBe("SOMETHING WENT WRONG");
    });

    it("should not apply the callback to an Ok result", () => {
      const value = 42;
      const result = Ok(value);
      const mappedResult = result.mapErr(
        e => new Error(e.message.toUpperCase())
      );
      expect(mappedResult.isOk()).toBe(true);
      expect(mappedResult.unwrap()).toBe(value);
    });
  });

  describe("and", () => {
    it("should return the other result for an Ok result", () => {
      const value1 = 42;
      const value2 = "hello";
      const result1 = Ok(value1);
      const result2 = Ok(value2);
      const andResult = result1.and(result2);
      expect(andResult.isOk()).toBe(true);
      expect(andResult.unwrap()).toBe(value2);
    });

    it("should return the Err result for an Err result", () => {
      const error1 = new Error("Something went wrong");
      const error2 = new Error("Another thing went wrong");
      const result1 = Err(error1);
      const result2 = Err(error2);
      const andResult = result1.and(result2);
      expect(andResult.isErr()).toBe(true);
      expect(andResult.unwrapErr()).toBe(error1);
    });
  });

  describe("andThen", () => {
    it("should apply the callback to the value of an Ok result", () => {
      const value1 = 42;
      const value2 = "hello";
      const result1 = Ok(value1);
      const result2 = Ok(value2);
      const andThenResult = result1.andThen(() => result2);
      expect(andThenResult.isOk()).toBe(true);
      expect(andThenResult.unwrap()).toBe(value2);
    });

    it("should not apply the callback to an Err result", () => {
      const error = new Error("Something went wrong");
      const result = Err(error);
      const andThenResult = result.andThen(() => Ok("hello"));
      expect(andThenResult.isErr()).toBe(true);
      expect(andThenResult.unwrapErr()).toBe(error);
    });
  });

  describe("or", () => {
    it("should return the first result for an Ok result", () => {
      const value1 = 42;
      const value2 = "hello";
      const result1 = Ok(value1);
      const result2 = Ok(value2);
      const orResult = result1.or(result2);
      expect(orResult.isOk()).toBe(true);
      expect(orResult.unwrap()).toBe(value1);
    });

    it("should return the second result for an Err result", () => {
      const error1 = new Error("Something went wrong");
      const error2 = new Error("Another thing went wrong");
      const result1 = Err(error1);
      const result2 = Err(error2);
      const orResult = result1.or(result2);
      expect(orResult.isErr()).toBe(true);
      expect(orResult.unwrapErr()).toBe(error2);
    });
  });

  describe("orElse", () => {
    it("should not apply the callback to an Ok result", () => {
      const value = 42;
      const result = Ok(value);
      const orElseResult = result.orElse(() => Ok("hello"));
      expect(orElseResult.isOk()).toBe(true);
      expect(orElseResult.unwrap()).toBe(value);
    });

    it("should apply the callback to the error of an Err result", () => {
      const error1 = new Error("Something went wrong");
      const error2 = new Error("Another thing went wrong");
      const result1 = Err(error1);
      const result2 = Err(error2);
      const orElseResult = result1.orElse(() => result2);
      expect(orElseResult.isErr()).toBe(true);
      expect(orElseResult.unwrapErr()).toBe(error2);
    });
  });

  describe("match", () => {
    it("should apply the callback to the value of an Ok result", () => {
      const value = 42;
      const result = Ok(value);
      const matchResult = result.match(
        x => x * 2,
        () => 0
      );
      expect(matchResult).toBe(value * 2);
    });

    it("should apply the callback to the error of an Err result", () => {
      const error = new Error("Something went wrong");
      const result = Err(error);
      const matchResult = result.match<0 | string>(
        () => 0,
        e => e.message.toUpperCase()
      );
      expect(matchResult).toBe("SOMETHING WENT WRONG");
    });

    it("should map to another result", () => {
      const value = 42;
      const result = Ok(value);
      const matchResult = result.match(
        x => Ok(x * 2),
        () => Err(new Error("Something went wrong"))
      );
      expect(matchResult.isOk()).toBe(true);
      expect(matchResult.unwrap()).toBe(value * 2);
    });

    it("should map to an option", () => {
      const value = 42;
      const result = Ok(value);
      const matchResult = result.match(
        x => Some(x * 2),
        () => None
      );
      expect(matchResult).toEqual(Some(value * 2));
    });
  });

  describe("isOkAnd", () => {
    it("should return true if the Result is an Ok variant and the predicate returns true", () => {
      const result = Ok(42);
      const predicate = (value: number) => value === 42;
      expect(result.isOkAnd(predicate)).toBe(true);
    });

    it("should return false if the Result is an Ok variant and the predicate returns false", () => {
      const result = Ok(42);
      const predicate = (value: number) => value === 0;
      expect(result.isOkAnd(predicate)).toBe(false);
    });

    it("should return false if the Result is an Err variant", () => {
      const result = Err(new Error("Something went wrong"));
      const predicate = (value: number) => value === 42;
      expect(result.isOkAnd(predicate)).toBe(false);
    });
  });

  describe("isErrAnd", () => {
    it("should return true if the Result is an Err variant and the predicate returns true", () => {
      const result = Err(new Error("Something went wrong"));
      const predicate = (error: Error) =>
        error.message === "Something went wrong";
      expect(result.isErrAnd(predicate)).toBe(true);
    });

    it("should return false if the Result is an Err variant and the predicate returns false", () => {
      const result = Err(new Error("Something went wrong"));
      const predicate = (error: Error) =>
        error.message === "Something else went wrong";
      expect(result.isErrAnd(predicate)).toBe(false);
    });

    it("should return false if the Result is an Ok variant", () => {
      const result = Ok(42);
      const predicate = (error: Error) =>
        error.message === "Something went wrong";
      expect(result.isErrAnd(predicate)).toBe(false);
    });
  });

  describe("isSame", () => {
    it("should return true if the Result is an Ok variant and the value is equal to the given value", () => {
      const result = Ok(42);
      expect(result.isSame(Ok(42))).toBe(true);
    });

    it("should return false if the Result is an Ok variant and the value is not equal to the given value", () => {
      const result = Ok(42);
      expect(result.isSame(Ok(0))).toBe(false);
    });

    it("should return false if the Result is an Err variant", () => {
      const error = new Error("Something went wrong");
      const result = Err(error);
      expect(result.isSame(Err(error))).toBe(true);
      expect(result.isSame(Some(error))).toBe(false);
    });
  });

  describe("isSameErr", () => {
    it("should return true if the Result is an Err variant and the error message is equal to the given message", () => {
      const error = new Error("Something went wrong");
      const result = Err(error);
      expect(result.isSameErr(Err(error))).toBe(true);
    });

    it("should return false if the Result is an Err variant and the error message is not equal to the given message", () => {
      const result = Err(new Error("Something went wrong"));
      expect(result.isSameErr("Something else went wrong")).toBe(false);
    });

    it("should return false if the Result is an Ok variant", () => {
      const result = Ok(42);
      expect(result.isSameErr("Something went wrong")).toBe(false);
    });
  });

  describe("flatten", () => {
    it("should return an Ok result if the inner Result is an Ok variant", () => {
      const innerResult = Ok(42);
      const result = Ok(innerResult);
      const flattenedResult = result.flatten();
      expect(flattenedResult).toBeInstanceOf(Result);
      expect(flattenedResult.isOk()).toBe(true);
      expect(flattenedResult.unwrap()).toBe(42);
    });

    it("should return an Err result if the outer Result is an Err variant", () => {
      const error = new Error("Something went wrong");
      const result = Err(error);
      const flattenedResult = result.flatten();
      expect(flattenedResult).toBeInstanceOf(Result);
      expect(flattenedResult.isErr()).toBe(true);
      expect(flattenedResult.unwrapErr()).toBe(error);
    });

    it("should return an Err result if the inner Result is an Err variant", () => {
      const error = new Error("Something went wrong");
      const innerResult = Err(error);
      const result = Ok(innerResult);
      const flattenedResult = result.flatten();
      expect(flattenedResult).toBeInstanceOf(Result);
      expect(flattenedResult.isErr()).toBe(true);
      expect(flattenedResult.unwrapErr()).toBe(error);
    });
  });

  describe("transpose", () => {
    it("should return Some(Ok(value)) if the Result is Ok(Some(value))", () => {
      const result = Ok(Some(42));
      const transposedResult = result.transpose();
      expect(transposedResult.isSome()).toBe(true);
      expect(transposedResult.unwrap()).toBeInstanceOf(Result);
      expect(transposedResult.unwrap().isOk()).toBe(true);
      expect(transposedResult.unwrap().unwrap()).toBe(42);
    });

    it("should return None if the Result is Err(error)", () => {
      const error = new Error("Something went wrong");
      const result = Err(error);
      const transposedResult = result.transpose();
      expect(transposedResult.isNone()).toBe(true);
    });

    it("should return None if the Result is Ok(None)", () => {
      const result = Ok(None);
      const transposedResult = result.transpose();
      expect(transposedResult.isNone()).toBe(true);
    });

    it("should return None if the Result is Err(None)", () => {
      const result = Err(None);
      const transposedResult = result.transpose();
      expect(transposedResult.isNone()).toBe(true);
    });

    it("should return Some(Ok(value) if the Result is Ok(value)", () => {
      const result = Ok(42);
      const transposedResult = result.transpose();
      expect(transposedResult.isSome()).toBe(true);
      expect(transposedResult.unwrap()).toBeInstanceOf(Result);
      expect(transposedResult.unwrap().isOk()).toBe(true);
      expect(transposedResult.unwrap().unwrap()).toBe(42);
    });
  });

  describe("ok", () => {
    it("should return Some(value) if the Result is Ok(value)", () => {
      const value = 42;
      const result = Ok(value);
      const okResult = result.ok();
      expect(okResult.isSome()).toBe(true);
      expect(okResult.unwrap()).toBe(value);
    });

    it("should return None if the Result is Err(error)", () => {
      const error = new Error("Something went wrong");
      const result = Err(error);
      const okResult = result.ok();
      expect(okResult.isNone()).toBe(true);
    });
  });

  describe("err", () => {
    it("should return Some(error) if the Result is Err(error)", () => {
      const error = new Error("Something went wrong");
      const result = Err(error);
      const errResult = result.err();
      expect(errResult.isSome()).toBe(true);
      expect(errResult.unwrap()).toBe(error);
    });

    it("should return None if the Result is Ok(value)", () => {
      const value = 42;
      const result = Ok(value);
      const errResult = result.err();
      expect(errResult.isNone()).toBe(true);
    });
  });

  describe("unwrapErrOr", () => {
    it("should return the error if the Result is an Err variant", () => {
      const error = new Error("Something went wrong");
      const result = Err(error);
      const defaultError = new Error("Default error");
      const unwrappedError = result.unwrapErrOr(defaultError);
      expect(unwrappedError).toBe(error);
    });

    it("should return the default error if the Result is an Ok variant", () => {
      const value = 42;
      const result = Ok(value);
      const defaultError = new Error("Default error");
      const unwrappedError = result.unwrapErrOr(defaultError);
      expect(unwrappedError).toBe(defaultError);
    });
  });

  describe("unwrapErrOrElse", () => {
    it("should return the error if the Result is an Err variant", () => {
      const error = new Error("Something went wrong");
      const result = Err(error);
      const defaultError = new Error("Default error");
      const unwrappedError = result.unwrapErrOrElse(() => defaultError);
      expect(unwrappedError).toBe(error);
    });

    it("should return the result of the callback if the Result is an Ok variant", () => {
      const value = 42;
      const result = Ok(value);
      const defaultError = new Error("Default error");
      const unwrappedError = result.unwrapErrOrElse(() => defaultError);
      expect(unwrappedError).toBe(defaultError);
    });
  });

  describe("toString", () => {
    it("should return a string representation of an Ok result", () => {
      const value = 42;
      const result = Ok(value);
      const resultString = result.toString();
      expect(resultString).toBe(`Ok(${value})`);
    });

    it("should return a string representation of an Err result", () => {
      const error = new Error("Something went wrong");
      const result = Err(error);
      const resultString = result.toString();
      expect(resultString).toBe(`Err(${error})`);
    });
  });
});
