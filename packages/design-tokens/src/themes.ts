import { palette as p } from "./primitives.js";

/** Semantic color roles every theme must provide. */
export interface ColorTheme {
  readonly bg: string;
  readonly surface: string;
  readonly surfaceRaised: string;
  readonly text: string;
  readonly textMuted: string;
  readonly border: string;
  readonly accent: string;
  readonly accentHover: string;
  readonly accentContrast: string;
  readonly focus: string;
  readonly recipe: string;
  readonly takeout: string;
  readonly delivery: string;
  readonly success: string;
  readonly danger: string;
  readonly shadow: string;
}

export const themes = {
  light: {
    bg: p.neutral[50],
    surface: p.neutral[0],
    surfaceRaised: p.neutral[0],
    text: p.neutral[900],
    textMuted: p.neutral[600],
    border: p.neutral[200],
    accent: p.tomato[600],
    accentHover: p.tomato[700],
    accentContrast: p.neutral[0],
    focus: p.saffron[500],
    recipe: p.basil[600],
    takeout: p.tomato[600],
    delivery: p.plum[500],
    success: p.basil[600],
    danger: p.tomato[700],
    shadow: "0 1px 2px rgb(27 25 22 / 0.06), 0 4px 16px rgb(27 25 22 / 0.06)",
  },
  dark: {
    bg: p.neutral[950],
    surface: p.neutral[900],
    surfaceRaised: p.neutral[800],
    text: p.neutral[50],
    textMuted: p.neutral[300],
    border: p.neutral[700],
    accent: p.tomato[300],
    accentHover: p.tomato[100],
    accentContrast: p.neutral[950],
    focus: p.saffron[300],
    recipe: p.basil[300],
    takeout: p.tomato[300],
    delivery: p.plum[300],
    success: p.basil[300],
    danger: p.tomato[300],
    shadow: "0 1px 2px rgb(0 0 0 / 0.4), 0 4px 16px rgb(0 0 0 / 0.3)",
  },
  garden: {
    bg: p.basil[50],
    surface: p.neutral[0],
    surfaceRaised: p.neutral[0],
    text: p.neutral[900],
    textMuted: p.neutral[600],
    border: p.basil[100],
    accent: p.basil[600],
    accentHover: p.basil[700],
    accentContrast: p.neutral[0],
    focus: p.saffron[500],
    recipe: p.basil[700],
    takeout: p.tomato[600],
    delivery: p.plum[700],
    success: p.basil[600],
    danger: p.tomato[700],
    shadow: "0 1px 2px rgb(34 86 42 / 0.08), 0 4px 16px rgb(34 86 42 / 0.08)",
  },
} as const satisfies Record<string, ColorTheme>;

export type ThemeName = keyof typeof themes;
export const themeNames = Object.keys(themes) as ThemeName[];
