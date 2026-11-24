import { describe, expect, it } from "vitest";
import { distanceKm, findCoverage, formatDistance, sortByDistance } from "./geo";

const portland = { lat: 45.5152, lng: -122.6784 };
const seattle = { lat: 47.6062, lng: -122.3321 };

describe("distanceKm", () => {
  it("measures Portland to Seattle at about 234 km", () => {
    expect(distanceKm(portland, seattle)).toBeCloseTo(234, -1);
  });
  it("is zero for the same point", () => expect(distanceKm(portland, portland)).toBe(0));
});

describe("findCoverage", () => {
  const areas = [{ label: "Portland", center: portland, radiusKm: 20 }];
  it("finds the area containing a point", () => expect(findCoverage(portland, areas)?.label).toBe("Portland"));
  it("returns undefined outside every area", () => expect(findCoverage(seattle, areas)).toBeUndefined());
});

describe("formatDistance", () => {
  it.each([
    [1.234, "metric", "1.2 km"],
    [16.09344, "imperial", "10 mi"],
    [3.2, "imperial", "2.0 mi"],
  ] as const)("%d km in %s → %s", (km, units, expected) => expect(formatDistance(km, units)).toBe(expected));
});

describe("sortByDistance", () => {
  it("orders nearest first", () => {
    const sorted = sortByDistance([seattle, portland], portland, (p) => p);
    expect(sorted.map((s) => s.item)).toEqual([portland, seattle]);
  });
});
