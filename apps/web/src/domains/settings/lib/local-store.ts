import { SETTINGS_STORAGE_KEY } from "@/shared/pwa/theme-script";
import { parseSettings, type Settings } from "./settings";
import type { SettingsStore } from "./store";

export const localSettingsStore: SettingsStore = {
  id: "local",
  async load() {
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return raw ? parseSettings(JSON.parse(raw)) : null;
    } catch {
      return null;
    }
  },
  async save(settings: Settings) {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Storage can be full or blocked (private mode). Settings still work for this visit.
    }
  },
};
