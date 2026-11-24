"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { localSettingsStore } from "../lib/local-store";
import { defaultSettings, type Settings } from "../lib/settings";

interface SettingsContextValue {
  readonly settings: Settings;
  /** True once saved settings have been read, so UIs can avoid flashing defaults. */
  readonly loaded: boolean;
  update(change: Partial<Omit<Settings, "version" | "updatedAt">>): void;
  /** Replaces settings wholesale, e.g. with a newer copy from a sync provider. */
  replace(settings: Settings): void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function applyTheme(theme: Settings["theme"]) {
  if (theme === "system") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
}

export function SettingsProvider({ children }: { readonly children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    localSettingsStore.load().then((saved) => {
      if (saved) setSettings(saved);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    applyTheme(settings.theme);
    void localSettingsStore.save(settings);
  }, [settings, loaded]);

  const update = useCallback<SettingsContextValue["update"]>((change) => {
    setSettings((current) => ({ ...current, ...change, updatedAt: new Date().toISOString() }));
  }, []);

  const value = useMemo(() => ({ settings, loaded, update, replace: setSettings }), [settings, loaded, update]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used inside <SettingsProvider>");
  return context;
}
