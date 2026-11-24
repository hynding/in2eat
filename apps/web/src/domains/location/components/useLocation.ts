"use client";

import { useCallback, useState } from "react";
import { useSettings } from "@/domains/settings/components/SettingsProvider";
import type { SavedLocation } from "@/domains/settings/lib/settings";
import { currentPosition } from "../lib/geocode";

type Status = "idle" | "locating" | "error";

/** The visitor's chosen location, kept in settings so it persists and syncs. */
export function useLocation() {
  const { settings, update, loaded } = useSettings();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>();

  const setLocation = useCallback((location: SavedLocation | null) => update({ location }), [update]);

  const locateDevice = useCallback(async () => {
    setStatus("locating");
    setError(undefined);
    try {
      const point = await currentPosition();
      setLocation({ label: "Your current location", point, source: "device" });
      setStatus("idle");
    } catch (e) {
      setError((e as Error).message);
      setStatus("error");
    }
  }, [setLocation]);

  return { location: settings.location, units: settings.units, loaded, status, error, locateDevice, setLocation };
}
