import { describe, expect, it } from "vitest";
import { parseQueryState, serializeQueryState, toggleFilter } from "./query-state";

describe("query state", () => {
  it("round-trips through the URL", () => {
    const state = { q: "ramen", filters: { diet: ["vegan", "gluten-free"], kind: ["recipe"] } };
    expect(parseQueryState(serializeQueryState(state))).toEqual(state);
  });

  it("ignores unknown parameters", () => {
    expect(parseQueryState("?q=tacos&utm_source=x")).toEqual({ q: "tacos", filters: {} });
  });

  it("toggles filters on and off, removing empty facets", () => {
    const on = toggleFilter({ q: "", filters: {} }, "diet", "vegan");
    expect(on.filters).toEqual({ diet: ["vegan"] });
    expect(toggleFilter(on, "diet", "vegan").filters).toEqual({});
  });
});
