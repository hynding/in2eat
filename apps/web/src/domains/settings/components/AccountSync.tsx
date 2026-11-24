"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { GoogleDriveSettingsStore, type TokenSource } from "../lib/google-drive-store";
import { isGoogleConfigured, requestDriveToken, revokeToken, type AccessToken } from "../lib/google-identity";
import { newest, type Settings } from "../lib/settings";
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
/** Renew a little before Google's expiry so a save never races it. */
const EXPIRY_MARGIN_MS = 60_000;
const AccountSyncContext = createContext<AccountSyncValue | null>(null);

const storage = {
  get: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string | null) => {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch {
      // Blocked storage only means we can't reconnect automatically next visit.
    }
  },
};

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
  const latest = useRef<Settings>(settings);
  latest.current = settings;

  const tokens = useMemo<TokenSource>(
    () => ({
      async current() {
        if (token.current && token.current.expiresAt - EXPIRY_MARGIN_MS > Date.now()) return token.current;
        return this.renew();
      },
      async renew() {
        token.current = await requestDriveToken(false);
        return token.current;
      },
    }),
    [],
  );

  const start = useCallback(
    async (interactive: boolean) => {
      setStatus("connecting");
      setError(undefined);
      try {
        token.current = await requestDriveToken(interactive);
        const drive = new GoogleDriveSettingsStore(tokens);
        const local = latest.current;
        const remote = await drive.load();
        const winner = remote ? newest(local, remote) : local;
        if (winner !== remote) await drive.save(winner);
        // Mark as synced before applying, so the change doesn't trigger a redundant save.
        lastSynced.current = winner.updatedAt;
        if (winner !== local) replace(winner);
        store.current = drive;
        storage.set(CONNECTED_FLAG, "1");
        setStatus("synced");
      } catch (e) {
        store.current = null;
        setError((e as Error).message);
        setStatus(interactive ? "error" : "signed-out");
      }
    },
    [replace, tokens],
  );

  // Reconnect quietly on later visits if the visitor connected before.
  useEffect(() => {
    if (loaded && isGoogleConfigured && storage.get(CONNECTED_FLAG)) void start(false);
  }, [loaded, start]);

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
    storage.set(CONNECTED_FLAG, null);
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
