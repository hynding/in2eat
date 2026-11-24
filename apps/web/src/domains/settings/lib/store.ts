import type { Settings } from "./settings";

/**
 * A place settings can be saved. Local storage is always available; account
 * providers (Google Drive today) implement the same contract.
 */
export interface SettingsStore {
  readonly id: string;
  load(): Promise<Settings | null>;
  save(settings: Settings): Promise<void>;
}
