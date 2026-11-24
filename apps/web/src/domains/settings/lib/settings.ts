import { GeoPoint } from "@in2eat/content-schema";
import { themeNames } from "@in2eat/design-tokens";
import { z } from "zod";

export const SavedLocation = z.object({
  label: z.string(),
  point: GeoPoint,
  source: z.enum(["device", "address"]),
});
export type SavedLocation = z.infer<typeof SavedLocation>;

export const ThemePreference = z.enum(["system", ...themeNames]);
export type ThemePreference = z.infer<typeof ThemePreference>;

/**
 * Everything a visitor can personalise. Stored locally, and synced to a
 * provider (Google Drive) when signed in. Each field falls back to its default,
 * so older or partial documents still load.
 */
export const Settings = z.object({
  version: z.literal(1).catch(1),
  theme: ThemePreference.catch("system"),
  units: z.enum(["metric", "imperial"]).catch("metric"),
  location: SavedLocation.nullable().catch(null),
  favorites: z.array(z.string()).catch([]),
  updatedAt: z.iso.datetime().catch(new Date(0).toISOString()),
});
export type Settings = z.infer<typeof Settings>;

export const defaultSettings: Settings = Settings.parse({});

/** Parses unknown input (storage, network) into valid settings, never throwing. */
export const parseSettings = (raw: unknown): Settings => Settings.parse(typeof raw === "object" && raw !== null ? raw : {});

/** Last write wins, compared by updatedAt. */
export const newest = (a: Settings, b: Settings): Settings => (Date.parse(b.updatedAt) > Date.parse(a.updatedAt) ? b : a);
