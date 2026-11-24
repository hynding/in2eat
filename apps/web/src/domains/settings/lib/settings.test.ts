import { describe, expect, it } from "vitest";
import { defaultSettings, newest, parseSettings } from "./settings";

describe("parseSettings", () => {
  it("fills defaults for empty or junk input", () => {
    expect(parseSettings(null)).toEqual(defaultSettings);
    expect(parseSettings("nope")).toEqual(defaultSettings);
  });

  it("keeps valid fields and repairs invalid ones", () => {
    const settings = parseSettings({ theme: "dark", units: "furlongs", favorites: ["recipes/toast"] });
    expect(settings.theme).toBe("dark");
    expect(settings.units).toBe("metric");
    expect(settings.favorites).toEqual(["recipes/toast"]);
  });
});

describe("newest", () => {
  it("prefers the most recently updated settings", () => {
    const older = { ...defaultSettings, updatedAt: "2026-01-01T00:00:00.000Z" };
    const newer = { ...defaultSettings, theme: "dark" as const, updatedAt: "2026-02-01T00:00:00.000Z" };
    expect(newest(older, newer)).toBe(newer);
    expect(newest(newer, older)).toBe(newer);
  });
});
