/**
 * Primitive tokens: raw values with no meaning attached.
 * Components never use these directly; they consume semantic tokens.
 */
export const palette = {
  tomato: { 50: "#fff4f1", 100: "#ffe1d9", 300: "#ff9a80", 500: "#e8492a", 600: "#c93a1f", 700: "#a12e18" },
  basil: { 50: "#f1f8f1", 100: "#d9eed9", 300: "#8ccb8c", 500: "#3f8f4a", 600: "#2f7239", 700: "#22562a" },
  saffron: { 100: "#fff3cc", 300: "#ffd666", 500: "#f2b400", 700: "#9c7400" },
  plum: { 300: "#c9a3d9", 500: "#8a4fa6", 700: "#5c2f73" },
  neutral: {
    0: "#ffffff", 50: "#faf8f5", 100: "#f2efea", 200: "#e4dfd7", 300: "#cdc6bb", 400: "#a39b8f",
    500: "#7a7368", 600: "#5a544b", 700: "#3e3a34", 800: "#2a2723", 900: "#1b1916", 950: "#11100e",
  },
} as const;

export const space = {
  "3xs": "0.125rem", "2xs": "0.25rem", xs: "0.5rem", sm: "0.75rem", md: "1rem",
  lg: "1.5rem", xl: "2rem", "2xl": "3rem", "3xl": "4rem",
} as const;

export const radius = { sm: "0.25rem", md: "0.5rem", lg: "1rem", pill: "999px" } as const;

export const font = {
  family: {
    body: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    display: "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif",
    mono: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
  },
  /** Fluid type scale: clamp(min, preferred, max). */
  size: {
    xs: "clamp(0.75rem, 0.72rem + 0.1vw, 0.8rem)",
    sm: "clamp(0.875rem, 0.84rem + 0.15vw, 0.95rem)",
    md: "clamp(1rem, 0.96rem + 0.2vw, 1.1rem)",
    lg: "clamp(1.2rem, 1.1rem + 0.45vw, 1.45rem)",
    xl: "clamp(1.5rem, 1.3rem + 0.9vw, 2rem)",
    "2xl": "clamp(1.9rem, 1.5rem + 1.8vw, 3rem)",
  },
  weight: { regular: "400", medium: "500", bold: "700" },
  lineHeight: { tight: "1.2", normal: "1.55" },
} as const;

export const motion = {
  duration: { fast: "120ms", normal: "220ms" },
  easing: { standard: "cubic-bezier(0.2, 0, 0, 1)" },
} as const;

export const layout = {
  contentMax: "72rem",
  readingMax: "42rem",
  cardMin: "16rem",
  breakpointMd: "48rem",
} as const;
