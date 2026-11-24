"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { GoogleDriveSettingsStore } from "../lib/google-drive-store";
import { isGoogleConfigured, requestDriveToken, revokeToken, type AccessToken } from "../lib/google-identity";
import { newest } from "../lib/settings";
import { useSettings } from "./SettingsProvider";

type SyncStatus = "unavailable" | "signed-out" | "connecting" | "synced" | "saving" | "error";

interface AccountSyncValue {
  readonly status: SyncStatus;
  readonly error?: string;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

const CONNECTED_FLAG = "in2eat:google-connected";
const SAVE_DELAY_MS = 1500;
const AccountSyncContext = createContext<AccountSyncValue | null>(null);

/**
 * Keeps settings in step with Google Drive while signed in: on connect, the
 * newer of local and remote wins; afterwards local changes are saved after a short pause.
 */
export function AccountSyncProvider({ children }: { readonly children: React.ReactNode }) {
  const { settings, loaded, replace } = useSettings();
  const [status, setStatus] = useState<SyncStatus>(isGoogleConfigured ? "signed-out" : "unavailable");
  const [error, setError] = useState<string>();
  const store = useRef<GoogleDriveSettingsStore | null>(null);
  const token = useRef<AccessToken | null>(null);
  const lastSynced = useRef<string | null>(null);

  const start = useCallback(
    async (interactive: boolean) => {
      setStatus("connecting");
      setError(undefined);
      try {
        token.current = await requestDriveToken(interactive);
        store.current = new GoogleDriveSettingsStore(token.current);
        const remote = await store.current.load();
        const winner = remote ? newest(settings, remote) : settings;
        if (winner !== settings) replace(winner);
        if (winner !== remote) await store.current.save(winner);
        lastSynced.current = winner.updatedAt;
        localStorage.setItem(CONNECTED_FLAG, "1");
        setStatus("synced");
      } catch (e) {
        store.current = null;
        setError((e as Error).message);
        setStatus(interactive ? "error" : "signed-out");
      }
    },
    [settings, replace],
  );

  // Reconnect quietly on later visits if the visitor connected before.
  useEffect(() => {
    if (loaded && isGoogleConfigured && localStorage.getItem(CONNECTED_FLAG)) void start(false);
  }, [loaded]); // once, after local settings load

  useEffect(() => {
    if (!store.current || settings.updatedAt === lastSynced.current) return;
    const timer = setTimeout(async () => {
      if (!store.current) return;
      setStatus("saving");
      try {
        await store.current.save(settings);
        lastSynced.current = settings.updatedAt;
        setStatus("synced");
      } catch (e) {
        setError((e as Error).message);
        setStatus("error");
      }
    }, SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [settings]);

  const disconnect = useCallback(async () => {
    if (token.current) await revokeToken(token.current).catch(() => undefined);
    token.current = null;
    store.current = null;
    localStorage.removeItem(CONNECTED_FLAG);
    setStatus("signed-out");
  }, []);

  const value = useMemo(
    () => ({ status, error, connect: () => start(true), disconnect }),
    [status, error, start, disconnect],
  );
  return <AccountSyncContext.Provider value={value}>{children}</AccountSyncContext.Provider>;
}

export function useAccountSync(): AccountSyncValue {
  const context = useContext(AccountSyncContext);
  if (!context) throw new Error("useAccountSync must be used inside <AccountSyncProvider>");
  return context;
}
