import { describe, expect, it } from "vitest";
import { buildCss, toCustomProperties } from "./to-css.js";

describe("toCustomProperties", () => {
  it("flattens nested objects into kebab-case custom properties", () => {
    expect(toCustomProperties({ textMuted: "#000", size: { lg: "2rem" } }, "--x")).toEqual([
      "--x-text-muted: #000;",
      "--x-size-lg: 2rem;",
    ]);
  });
});

describe("buildCss", () => {
  const css = buildCss();

  it("defines every theme as a data-theme selector", () => {
    for (const theme of ["light", "dark", "garden"]) expect(css).toContain(`[data-theme="${theme}"]`);
  });

  it("respects the OS dark preference only when no theme is pinned", () => {
    expect(css).toContain(":root:not([data-theme])");
  });
});
