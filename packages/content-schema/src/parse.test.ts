import { describe, expect, it } from "vitest";
import { parseEntry } from "./parse.js";

const recipe = `
title: Toast
summary: Bread, but better.
course: breakfast
servings: 1
time: { prep: 1, cook: 3 }
ingredients:
  - items:
      - { name: bread, quantity: 1, unit: slice }
steps:
  - Toast the bread.
`;

describe("parseEntry", () => {
  it("returns a typed entry with slug and collection", () => {
    const result = parseEntry("recipes", "toast", recipe);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.entry.slug).toBe("toast");
      expect(result.entry.collection).toBe("recipes");
      expect(result.entry.diet).toEqual([]);
    }
  });

  it("rejects file names that are not kebab-case", () => {
    const result = parseEntry("recipes", "My Toast", recipe);
    expect(result.ok).toBe(false);
  });

  it("reports field paths for schema violations", () => {
    const result = parseEntry("recipes", "toast", recipe.replace("servings: 1", "servings: -2"));
    expect(result).toEqual({ ok: false, errors: [expect.stringContaining("servings")] });
  });

  it("reports YAML syntax errors", () => {
    const result = parseEntry("recipes", "toast", "title: [unclosed");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors[0]).toMatch(/invalid YAML/);
  });
});
