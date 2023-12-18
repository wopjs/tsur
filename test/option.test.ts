import { describe, it, expect, vi } from "vitest";

import { Option, Some, None, Err, Ok } from "../src";

describe("Option", () => {
  describe("Some", () => {
    it("creates a Some with a value", () => {
      const some = Some("hello");
      expect(some.isSome()).toBe(true);
      expect(some.unwrap()).toBe("hello");
    });
  });

  describe("None", () => {
    it("creates a None", () => {
      expect(None.isNone()).toBe(true);
      expect(() => None.unwrap()).toThrow();
    });
  });

  describe("from", () => {
    it("creates a Some for a truthy value", () => {
      const some = Option.from("hello");
      expect(some.isSome()).toBe(true);
      expect(some.unwrap()).toBe("hello");
    });

    it("creates a None for a falsy value", () => {
      const none = Option.from("");
      expect(none.isNone()).toBe(true);
      expect(() => none.unwrap()).toThrow();
    });

    it("creates an Option with custom predicate", () => {
      const some = Option.from("hello", x => x.length > 3);
      expect(some.isSome()).toBe(true);
      expect(some.unwrap()).toBe("hello");

      const none = Option.from("hello", x => x.length > 10);
      expect(none.isNone()).toBe(true);
      expect(() => none.unwrap()).toThrow();
    });
  });

  describe("isSame", () => {
    it("returns true if both are the same Some value", () => {
      const result = Option.isSame(Some("a"), Some("a"));
      expect(result).toBe(true);
    });

    it("returns true if both are the same None", () => {
      const result = Option.isSame(None, None);
      expect(result).toBe(true);
    });

    it("returns false when the input is a different Some value", () => {
      const result = Option.isSame(Some("a"), Some("b"));
      expect(result).toBe(false);
    });

    it("returns false when the input is None", () => {
      const some = Some("hello");
      const none = None;
      const result = Option.isSame(some, none);
      expect(result).toBe(false);
    });

    it("returns false when the input is a different type", () => {
      const some = Some("hello");
      const obj = { value: "hello" };
      const result = Option.isSame(some, obj);
      expect(result).toBe(false);
    });
  });

  describe("isSome", () => {
    it("returns true for a Some", () => {
      const some = Some("hello");
      expect(some.isSome()).toBe(true);
    });

    it("returns false for a None", () => {
      expect(None.isSome()).toBe(false);
      const option = Some(11);
      if (option.isSome()) {
        expect(option.isNone()).toBe(false);
      }
    });
  });

  describe("isNone", () => {
    it("returns true for a None", () => {
      expect(None.isNone()).toBe(true);
    });

    it("returns false for a Some", () => {
      const some = Some("hello");
      expect(some.isNone()).toBe(false);
    });
  });

  describe("unwrap", () => {
    it("returns the value for a Some", () => {
      const some = Some("hello");
      expect(some.unwrap()).toBe("hello");
    });

    it("throws an error for a None", () => {
      expect(() => None.unwrap()).toThrow();
    });
  });

  describe("unwrapOr", () => {
    it("returns the value for a Some", () => {
      const some = Some("hello");
      expect(some.unwrapOr("world")).toBe("hello");
    });

    it("returns the default value for a None", () => {
      expect(None.unwrapOr("world")).toBe("world");
    });
  });

  describe("unwrapOrElse", () => {
    it("returns the value for a Some", () => {
      const some = Some("hello");
      expect(some.unwrapOrElse(() => "world")).toBe("hello");
    });

    it("returns the default value for a None", () => {
      expect(None.unwrapOrElse(() => "world")).toBe("world");
    });
  });

  describe("map", () => {
    it("applies a function to a Some", () => {
      const some = Some("hello");
      const mapped = some.map(x => x.toUpperCase());
      expect(mapped.isSome()).toBe(true);
      expect(mapped.unwrap()).toBe("HELLO");
    });

    it("returns None for a None", () => {
      const mapped = None.map((x: string) => x.toUpperCase());
      expect(mapped.isNone()).toBe(true);
      expect(() => mapped.unwrap()).toThrow();
    });
  });

  describe("filter", () => {
    it("returns the Some if it satisfies the predicate", () => {
      const some = Some(1);
      const filtered = some.filter(x => x > 0);
      expect(filtered.isSome()).toBe(true);
      expect(filtered.unwrap()).toBe(1);
    });

    it("returns None if it does not satisfy the predicate", () => {
      const some = Some(-1);
      const filtered = some.filter(x => x > 0);
      expect(filtered.isNone()).toBe(true);
      expect(() => filtered.unwrap()).toThrow();
    });

    it("returns None for a None", () => {
      const filtered = None.filter(x => x > 0);
      expect(filtered.isNone()).toBe(true);
      expect(() => filtered.unwrap()).toThrow();
    });
  });

  describe("or", () => {
    it("returns optionB if optionA is None", () => {
      const optionA = None;
      const optionB = Some("hello");
      const or = optionA.or(optionB);
      expect(or.isSome()).toBe(true);
      expect(or.isSame(optionB)).toBe(true);
    });

    it("returns optionA if optionA is Some", () => {
      const optionA = Some("world");
      const optionB = Some("hello");
      const or = optionA.or(optionB);
      expect(or.isSome()).toBe(true);
      expect(or.isSame(optionA)).toBe(true);
    });
  });

  describe("orElse", () => {
    it("returns the first Option if it is Some", () => {
      const some = Some("hello");
      const orElse = some.orElse(() => Some("world"));
      expect(orElse.isSome()).toBe(true);
      expect(orElse.unwrap()).toBe("hello");
    });

    it("returns the second Option if the first is None", () => {
      const orElse = None.orElse(() => Some("world"));
      expect(orElse.isSome()).toBe(true);
      expect(orElse.unwrap()).toBe("world");
    });
  });

  describe("isSomeAnd", () => {
    it("returns true when the input is Some and the predicate is true", () => {
      const input = Some("hello");
      const predicate = (value: string) => value.length === 5;
      const result = input.isSomeAnd(predicate);
      expect(result).toBe(true);
    });

    it("returns false when the input is Some and the predicate is false", () => {
      const input = Some("hello");
      const predicate = (value: string) => value.length === 4;
      const result = input.isSomeAnd(predicate);
      expect(result).toBe(false);
    });

    it("returns false when the input is None", () => {
      const input = None;
      const predicate = (value: string) => value.length === 5;
      const result = input.isSomeAnd(predicate);
      expect(result).toBe(false);
    });

    it("calls the predicate with the provided thisArg", () => {
      const input = Some("hello");
      const predicate = function (this: any, value: string) {
        return value === this.message;
      };
      const thisArg = { message: "hello" };
      const result = input.isSomeAnd(predicate, thisArg);
      expect(result).toBe(true);
    });
  });

  describe("isSame", () => {
    it("returns true when the input is the same Some value", () => {
      const some1 = Some("hello");
      const some2 = Some("hello");
      const result = some1.isSame(some2);
      expect(result).toBe(true);
    });

    it("returns true when the input is the same None", () => {
      const none1 = None;
      const none2 = None;
      const result = none1.isSame(none2);
      expect(result).toBe(true);
    });

    it("returns false when the input is a different Some value", () => {
      const some1 = Some("hello");
      const some2 = Some("world");
      const result = some1.isSame(some2);
      expect(result).toBe(false);
    });

    it("returns false when the input is None", () => {
      const some = Some("hello");
      const none = None;
      const result = some.isSame(none);
      expect(result).toBe(false);
    });

    it("returns false when the input is a different type", () => {
      const some = Some("hello");
      const obj = { value: "hello" };
      const result = some.isSame(obj);
      expect(result).toBe(false);
    });
  });

  describe("and", () => {
    it("returns the second Option if both are Some", () => {
      const some1 = Some("hello");
      const some2 = Some("world");
      const and = some1.and(some2);
      expect(and.isSome()).toBe(true);
      expect(and.unwrap()).toBe("world");
    });

    it("returns None if the first is None", () => {
      const some = Some("world");
      const and = None.and(some);
      expect(and.isNone()).toBe(true);
      expect(() => and.unwrap()).toThrow();
    });

    it("returns None if the second is None", () => {
      const some = Some("hello");
      const and = some.and(None);
      expect(and.isNone()).toBe(true);
      expect(() => and.unwrap()).toThrow();
    });

    it("returns None if both are None", () => {
      const and = None.and(None);
      expect(and.isNone()).toBe(true);
      expect(() => and.unwrap()).toThrow();
    });
  });

  describe("andThen", () => {
    it("applies a function to a Some and returns the result", () => {
      const some = Some("hello");
      const andThen = some.andThen(x => Some(x.toUpperCase()));
      expect(andThen.isSome()).toBe(true);
      expect(andThen.unwrap()).toBe("HELLO");
    });

    it("returns None for a None", () => {
      const andThen = None.andThen(x => Some(x.toUpperCase()));
      expect(andThen.isNone()).toBe(true);
      expect(() => andThen.unwrap()).toThrow();
    });
  });

  describe("xor", () => {
    it("returns None if both are None", () => {
      const xor = None.xor(None);
      expect(xor.isNone()).toBe(true);
      expect(() => xor.unwrap()).toThrow();
    });

    it("returns the first Option if it is Some and the second is None", () => {
      const some = Some("hello");
      const xor = some.xor(None);
      expect(xor.isSome()).toBe(true);
      expect(xor.unwrap()).toBe("hello");
    });

    it("returns the second Option if it is Some and the first is None", () => {
      const some = Some("world");
      const xor = None.xor(some);
      expect(xor.isSome()).toBe(true);
      expect(xor.unwrap()).toBe("world");
    });

    it("returns None if both are Some", () => {
      const some1 = Some("hello");
      const some2 = Some("world");
      const xor = some1.xor(some2);
      expect(xor.isNone()).toBe(true);
      expect(() => xor.unwrap()).toThrow();
    });
  });

  describe("zip", () => {
    it("returns a Some of a tuple if both are Some", () => {
      const some1 = Some("hello");
      const some2 = Some("world");
      const zip = some1.zip(some2);
      expect(zip.isSome()).toBe(true);
      expect(zip.unwrap()).toEqual(["hello", "world"]);
    });

    it("returns None if the first is None", () => {
      const some = Some("world");
      const zip = None.zip(some);
      expect(zip.isNone()).toBe(true);
      expect(() => zip.unwrap()).toThrow();
    });

    it("returns None if the second is None", () => {
      const some = Some("hello");
      const zip = some.zip(None);
      expect(zip.isNone()).toBe(true);
      expect(() => zip.unwrap()).toThrow();
    });

    it("returns None if both are None", () => {
      const zip = None.zip(None);
      expect(zip.isNone()).toBe(true);
      expect(() => zip.unwrap()).toThrow();
    });
  });

  describe("zipWith", () => {
    it("returns a Some with the result of the function when both options are Some", () => {
      const some1 = Option.Some(2);
      const some2 = Option.Some(3);
      const result = some1.zipWith(some2, (a, b) => a + b);
      expect(result).toEqual(Option.Some(5));
    });

    it("returns a None when the first option is None", () => {
      const some2 = Option.Some(3);
      const result = None.zipWith(some2, (a, b) => a + b);
      expect(result).toEqual(None);
    });

    it("returns a None when the second option is None", () => {
      const some1 = Option.Some(2);
      const result = some1.zipWith(None, (a, b) => a + b);
      expect(result).toEqual(None);
    });

    it("returns a None when both options are None", () => {
      const result = None.zipWith(None, (a, b) => a + b);
      expect(result).toEqual(None);
    });
  });

  describe("unzip", () => {
    it("returns a tuple of Some values when the input is Some([a,b])", () => {
      const [a, b] = Some(["hello", "world"]).unzip();
      expect(a).toEqual(Some("hello"));
      expect(b).toEqual(Some("world"));
    });

    it("returns a tuple of Some values when the input is Some([a,b])", () => {
      const [a, b] = None.unzip();
      expect(a).toBe(None);
      expect(b).toBe(None);
    });

    it("returns a tuple of Some values when the input is Some([a,b])", () => {
      const [a, b] = Some("").unzip();
      expect(a).toBe(None);
      expect(b).toBe(None);
    });
  });

  describe("flatten", () => {
    it("returns the inner Some when the input is Some(Some)", () => {
      const someSome = Some(Some("hello"));
      const flattened = someSome.flatten();
      expect(flattened).toEqual(Some("hello"));
    });

    it("returns None when the input is Some(None)", () => {
      const someNone = Some(None);
      const flattened = someNone.flatten();
      expect(flattened).toEqual(None);
    });

    it("returns None when the input is None", () => {
      const none = None;
      const flattened = none.flatten();
      expect(flattened).toEqual(None);
    });
  });

  describe("transpose", () => {
    it("returns Ok(value) when the input is Some", () => {
      const input = Some("hello");
      const transposed = input.transpose();
      expect(transposed).toEqual(Ok(Some("hello")));
    });

    it("returns Ok(None) when the input is None", () => {
      const input = None;
      const transposed = input.transpose();
      expect(transposed).toEqual(Ok(None));
    });

    it("returns Ok(Some(value)) when the input is Some(Ok(value))", () => {
      const input = Some(Ok("hello"));
      const transposed = input.transpose();
      expect(transposed).toEqual(Ok(Some("hello")));
    });

    it("returns Err(error) when the input is Some(Err(error))", () => {
      const input = Some(Err(42));
      const transposed = input.transpose();
      expect(transposed).toEqual(Err(42));
    });
  });

  describe("okOr", () => {
    it("returns Ok(value) when the input is Some", () => {
      const input = Some("hello");
      const result = input.okOr("error");
      expect(result).toEqual(Ok("hello"));
    });

    it("returns Err(error) when the input is None", () => {
      const input = None;
      const result = input.okOr("error");
      expect(result).toEqual(Err("error"));
    });
  });

  describe("okOrElse", () => {
    it("returns Ok(value) when the input is Some", () => {
      const input = Some("hello");
      const result = input.okOrElse(() => "error");
      expect(result).toEqual(Ok("hello"));
    });

    it("returns Err(error()) when the input is None", () => {
      const input = None;
      const result = input.okOrElse(() => "error");
      expect(result).toEqual(Err("error"));
    });

    it("calls the error function with the provided thisArg", () => {
      const input = None;
      const thisArg = { message: "error" };
      const errorFn = function () {
        return this.message;
      };
      const result = input.okOrElse(errorFn, thisArg);
      expect(result).toEqual(Err("error"));
    });
  });

  describe("Option.match", () => {
    it("should call the Some function if the Option is a Some", () => {
      const value = 42;
      const option = Option.Some(value);
      const someFn = vi.fn().mockReturnValue("Some value");
      const noneFn = vi.fn().mockReturnValue("None value");
      const result = option.match(someFn, noneFn);
      expect(someFn).toHaveBeenCalledWith(value);
      expect(noneFn).not.toHaveBeenCalled();
      expect(result).toBe("Some value");
    });

    it("should call the None function if the Option is a None", () => {
      const option = Option.None;
      const someFn = vi.fn().mockReturnValue("Some value");
      const noneFn = vi.fn().mockReturnValue("None value");
      const result = option.match(someFn, noneFn);
      expect(someFn).not.toHaveBeenCalled();
      expect(noneFn).toHaveBeenCalled();
      expect(result).toBe("None value");
    });
  });

  describe("toString", () => {
    it('returns "Some(value)" for a Some', () => {
      const some = Some("hello");
      expect(some.toString()).toBe("Some(hello)");
    });

    it('returns "None" for a None', () => {
      const none = None;
      expect(none.toString()).toBe("None");
    });
  });
});
