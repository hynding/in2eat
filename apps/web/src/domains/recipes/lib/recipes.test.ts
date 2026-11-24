import { describe, expect, it } from "vitest";
import { formatQuantity, scaleQuantity } from "./quantity";
import { formatMinutes } from "./time";

describe("formatQuantity", () => {
  it.each([
    [0.5, "½"], [1.25, "1¼"], [1 / 3, "⅓"], [2, "2"], [2.98, "3"], [1.6, "1.6"], [412.7, "413"],
  ])("%d → %s", (value, expected) => expect(formatQuantity(value)).toBe(expected));
});

describe("scaleQuantity", () => {
  it("scales linearly with servings", () => expect(scaleQuantity(200, 4, 6)).toBe(300));
});

describe("formatMinutes", () => {
  it.each([[0, "0 min"], [45, "45 min"], [60, "1 h"], [95, "1 h 35 min"]])("%i → %s", (m, s) =>
    expect(formatMinutes(m)).toBe(s),
  );
});
