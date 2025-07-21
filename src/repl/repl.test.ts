import { listInputCommands } from "./repl.helpers.js";
import { describe, expect, test } from "vitest";

describe.each([
  {
    input: "  hello  world  ",
    expected: ["hello", "world"],
  },
  {
    input: "  Here we go  ",
    expected: ["here", "we", "go"],
  },
  {
    input: `
      Here we go  `,
    expected: ["here", "we", "go"],
  },
])("listInputCommands($input)", ({ input, expected }) => {
  test(`Expected: ${expected}`, () => {
    const actual = listInputCommands(input)

    // The `expect` and `toHaveLength` functions are from vitest
    // they will fail the test if the condition is not met
    expect(actual).toHaveLength(expected.length);

    for (const i in expected) {
      // likewise, the `toBe` function will fail the test if the values are not equal
      expect(actual[i]).toBe(expected[i]);
    }
  });
});