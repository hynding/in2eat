import { describe, expect, it } from "vitest";
import { withinEditDistance } from "./fuzzy.js";

describe("withinEditDistance", () => {
  it.each([
    ["noodel", "noodle", 1, true],
    ["tomat", "tomato", 1, true],
    ["ramne", "ramen", 1, true],
    ["pizza", "pasta", 1, false],
    ["kitten", "sitting", 2, false],
  ])("%s vs %s within %i → %s", (a, b, max, expected) => {
    expect(withinEditDistance(a, b, max)).toBe(expected);
  });
});
