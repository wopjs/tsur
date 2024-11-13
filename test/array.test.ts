import "../src/patches";
import { expect, describe, it } from "vitest";

import { None, Some } from "../src";

describe("Array.$filterMap", () => {
  it("should return an array of mapped values for truthy predicates", () => {
    const array = [1, 2, 3, 4, 5];
    const result = array.$filterMap(value =>
      value % 2 === 0 ? Some(value * 2) : None
    );
    expect(result).toEqual([4, 8]);
  });

  it("should return an empty array for falsy predicates", () => {
    const array = [1, 2, 3, 4, 5];
    const result = array.$filterMap(value =>
      value > 5 ? Some(value * 2) : None
    );
    expect(result).toEqual([]);
  });
});

describe("Array.$mapWhile", () => {
  it("should return an array of mapped values until the predicate is falsy", () => {
    const array = [1, 2, 3, 4, 5];
    const result = array.$mapWhile(value =>
      value < 4 ? Some(value * 2) : None
    );
    expect(result).toEqual([2, 4, 6]);
  });

  it("should return an empty array if the first value is falsy", () => {
    const array = [1, 2, 3, 4, 5];
    const result = array.$mapWhile(value =>
      value > 5 ? Some(value * 2) : None
    );
    expect(result).toEqual([]);
  });
});

describe("Array.$reduceWhile", () => {
  it("should return the accumulated value until the predicate is falsy", () => {
    const array = [1, 2, 3, 4, 5];
    const result = array.$reduceWhile(
      (acc, value) => (value < 4 ? Some(acc + value) : None),
      0
    );
    expect(result).toEqual(6);
  });

  it("should return the initial value if the first value is falsy", () => {
    const array = [1, 2, 3, 4, 5];
    const result = array.$reduceWhile(
      (acc, value) => (value > 5 ? Some(acc + value) : None),
      0
    );
    expect(result).toEqual(0);
  });
});

describe("Array.$firstIndex", () => {
  it("should return the index of the first element that matches the predicate", () => {
    const array = [1, 2, 3, 4, 5];
    const result = array.$firstIndex(value => value > 2);
    expect(result).toEqual(Some(2));
  });

  it("should return None if no element matches the predicate", () => {
    const array = [1, 2, 3, 4, 5];
    const result = array.$firstIndex(value => value > 5);
    expect(result).toBe(None);
  });
});

describe("Array.$lastIndex", () => {
  it("should return the index of the last element that matches the predicate", () => {
    const array = [1, 2, 3, 4, 5];
    const result = array.$lastIndex(value => value > 2);
    expect(result).toEqual(Some(4));
  });

  it("should return None if no element matches the predicate", () => {
    const array = [1, 2, 3, 4, 5];
    const result = array.$lastIndex(value => value > 5);
    expect(result).toBe(None);
  });
});

describe("Array.$first", () => {
  it("should return the first element", () => {
    const array = [1, 2, 3, 4, 5];
    const result = array.$first();
    expect(result).toEqual(Some(1));
  });

  it("should return the first element that matches the predicate", () => {
    const array = [1, 2, 3, 4, 5];
    const result = array.$first(value => value > 2);
    expect(result).toEqual(Some(3));
  });

  it("should return None if no element matches the predicate", () => {
    const array = [1, 2, 3, 4, 5];
    const result = array.$first(value => value > 5);
    expect(result).toBe(None);
  });
});

describe("Array.$last", () => {
  it("should return the last element", () => {
    const array = [1, 2, 3, 4, 5];
    const result = array.$last();
    expect(result).toEqual(Some(5));
  });

  it("should return the last element that matches the predicate", () => {
    const array = [1, 2, 3, 4, 5];
    const result = array.$last(value => value > 2);
    expect(result).toEqual(Some(5));
  });

  it("should return None if no element matches the predicate", () => {
    const array = [1, 2, 3, 4, 5];
    const result = array.$last(value => value > 5);
    expect(result).toBe(None);
  });
});

describe("Array.$firstMap", () => {
  it("should return the first mapped value that is Some", () => {
    const array = [1, 2, 3, 4, 5];
    const result = array.$firstMap(value =>
      value > 2 ? Some(value * 2) : None
    );
    expect(result).toEqual(Some(6));
  });

  it("should return None if no mapped value is Some", () => {
    const array = [1, 2, 3, 4, 5];
    const result = array.$firstMap(value =>
      value > 5 ? Some(value * 2) : None
    );
    expect(result).toBe(None);
  });

  describe("Array.$lastMap", () => {
    it("should return the last mapped value that is Some", () => {
      const array = [1, 2, 3, 4, 5];
      const result = array.$lastMap(value =>
        value > 2 ? Some(value * 2) : None
      );
      expect(result).toEqual(Some(10));
    });

    it("should return None if no mapped value is Some", () => {
      const array = [1, 2, 3, 4, 5];
      const result = array.$lastMap(value =>
        value > 5 ? Some(value * 2) : None
      );
      expect(result).toEqual(None);
    });
  });
});
