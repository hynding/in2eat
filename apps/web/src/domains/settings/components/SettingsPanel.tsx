"use client";

import Link from "next/link";
import { themeNames } from "@in2eat/design-tokens";
import { LocationPicker } from "@/domains/location/components/LocationPicker";
import { humanize } from "@/shared/lib/format";
import { Button } from "@/shared/ui/Button";
import { useAccountSync } from "./AccountSync";
import { useSettings } from "./SettingsProvider";
import styles from "./Settings.module.css";

const syncMessages = {
  unavailable: "Account sync isn't set up on this site yet. Your settings are saved on this device.",
  "signed-out": "Settings are saved on this device. Connect Google Drive to keep them in step across devices.",
  connecting: "Connecting to Google Drive…",
  synced: "Synced with your Google Drive.",
  saving: "Saving to Google Drive…",
  error: "Couldn't sync with Google Drive.",
} as const;

export function SettingsPanel() {
  const { settings, update } = useSettings();
  const sync = useAccountSync();

  return (
    <div className={styles.panels}>
      <section className={styles.panel} aria-labelledby="appearance-heading">
        <h2 id="appearance-heading">Appearance</h2>
        <fieldset className={styles.options}>
          <legend>Theme</legend>
          {(["system", ...themeNames] as const).map((theme) => (
            <label key={theme}>
              <input type="radio" name="theme" checked={settings.theme === theme} onChange={() => update({ theme })} />
              <span>{theme === "system" ? "Match my device" : humanize(theme)}</span>
            </label>
          ))}
        </fieldset>
        <fieldset className={styles.options}>
          <legend>Distances</legend>
          {(["metric", "imperial"] as const).map((units) => (
            <label key={units}>
              <input type="radio" name="units" checked={settings.units === units} onChange={() => update({ units })} />
              <span>{units === "metric" ? "Kilometres" : "Miles"}</span>
            </label>
          ))}
        </fieldset>
      </section>

      <section className={styles.panel} aria-labelledby="sync-heading">
        <h2 id="sync-heading">Sync</h2>
        <p role="status">{syncMessages[sync.status]}</p>
        {sync.error && <p className={styles.error}>{sync.error}</p>}
        {(sync.status === "signed-out" || sync.status === "error") && (
          <Button onClick={() => void sync.connect()}>Connect Google Drive</Button>
        )}
        {(sync.status === "synced" || sync.status === "saving") && (
          <Button variant="secondary" onClick={() => void sync.disconnect()}>Disconnect</Button>
        )}
        <p className={styles.hint}>
          In2Eat stores one small file in a private app folder in your Drive. It can't see your other files.
        </p>
      </section>

      <section className={styles.panel} aria-labelledby="location-heading">
        <h2 id="location-heading">Location</h2>
        <LocationPicker embedded />
      </section>

      <section className={styles.panel} aria-labelledby="favorites-heading">
        <h2 id="favorites-heading">Saved</h2>
        {settings.favorites.length === 0 ? (
          <p>Nothing saved yet. Use the ☆ Save button on any recipe, place or service.</p>
        ) : (
          <ul>
            {settings.favorites.map((id) => (
              <li key={id}><Link href={`/${id}/`}>{humanize(id.split("/")[1] ?? id)}</Link></li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
