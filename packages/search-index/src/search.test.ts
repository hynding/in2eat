import { describe, expect, it } from "vitest";
import { buildIndex } from "./build.js";
import { Searcher } from "./search.js";
import { stem, tokenize } from "./tokenize.js";
import type { IndexableDocument } from "./types.js";

const doc = (id: string, title: string, body: string, facets: Record<string, string[]> = {}): IndexableDocument => ({
  id, kind: "recipe", title, summary: "", url: `/${id}/`,
  text: { title, tags: "", summary: "", body }, facets,
});

const searcher = new Searcher(
  buildIndex([
    doc("shakshuka", "Weeknight Shakshuka", "eggs crushed tomatoes paprika", { diet: ["vegetarian"] }),
    doc("ramen", "Miso Ramen", "noodles miso eggs bok choy", { diet: [] }),
    doc("tacos", "Tacos al Pastor", "pork pineapple tortillas", { diet: [] }),
  ]),
);
const ids = (query: string, options = {}) => searcher.search(query, options).hits.map((h) => h.document.id);

describe("tokenize", () => {
  it("lowercases, strips accents and stop words, and folds plurals", () => {
    expect(tokenize("The Jalapeños and Tomatoes")).toEqual(["jalapeno", "tomato"]);
  });
  it("leaves short words and -ss words alone", () => {
    expect(stem("glass")).toBe("glass");
    expect(stem("bus")).toBe("bus");
  });
});

describe("Searcher", () => {
  it("ranks title matches above body matches", () => {
    expect(ids("miso")[0]).toBe("ramen");
  });
  it("prefix-matches the word being typed", () => {
    expect(ids("shak")).toEqual(["shakshuka"]);
  });
  it("tolerates typos", () => {
    expect(ids("noodels")).toEqual(["ramen"]);
  });
  it("requires every word when possible", () => {
    expect(ids("eggs miso")).toEqual(["ramen"]);
  });
  it("falls back to any word when nothing matches all of them", () => {
    const result = searcher.search("pineapple paprika");
    expect(result.relaxed).toBe(true);
    expect(result.total).toBe(2);
  });
  it("applies facet filters", () => {
    expect(ids("eggs", { filters: { diet: ["vegetarian"] } })).toEqual(["shakshuka"]);
  });
  it("lists everything for an empty query", () => {
    expect(searcher.search("").total).toBe(3);
  });
  it("suggests completions", () => {
    expect(searcher.suggest("pa")).toContain("paprika");
  });
});
