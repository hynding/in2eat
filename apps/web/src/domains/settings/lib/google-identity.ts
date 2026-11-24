/**
 * Minimal wrapper around Google Identity Services' token model. Runs entirely in
 * the browser with a public client ID; no client secret or backend is involved.
 */

interface TokenResponse {
  readonly access_token?: string;
  readonly expires_in?: number;
  readonly error?: string;
}

interface TokenClient {
  requestAccessToken(options?: { prompt?: "" | "consent" | "select_account" }): void;
}

interface GoogleAccounts {
  oauth2: {
    initTokenClient(config: {
      client_id: string;
      scope: string;
      callback: (response: TokenResponse) => void;
      error_callback?: (error: { type: string }) => void;
    }): TokenClient;
    revoke(token: string, done?: () => void): void;
  };
}

declare global {
  interface Window {
    google?: { accounts: GoogleAccounts };
  }
}

export const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
export const isGoogleConfigured = googleClientId.length > 0;

const SCRIPT_URL = "https://accounts.google.com/gsi/client";
const DRIVE_APPDATA_SCOPE = "https://www.googleapis.com/auth/drive.appdata";

let scriptLoading: Promise<GoogleAccounts> | undefined;

function loadScript(): Promise<GoogleAccounts> {
  scriptLoading ??= new Promise((resolve, reject) => {
    if (window.google?.accounts) return resolve(window.google.accounts);
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => (window.google?.accounts ? resolve(window.google.accounts) : reject(new Error("Google sign-in failed to load")));
    script.onerror = () => {
      scriptLoading = undefined;
      reject(new Error("Google sign-in failed to load"));
    };
    document.head.append(script);
  });
  return scriptLoading;
}

export interface AccessToken {
  readonly value: string;
  readonly expiresAt: number;
}

/**
 * Asks Google for a Drive appDataFolder token. `interactive: false` tries to
 * reuse an earlier grant without showing a consent screen.
 */
export async function requestDriveToken(interactive: boolean): Promise<AccessToken> {
  const accounts = await loadScript();
  return new Promise((resolve, reject) => {
    const client = accounts.oauth2.initTokenClient({
      client_id: googleClientId,
      scope: DRIVE_APPDATA_SCOPE,
      callback: (response) => {
        if (response.error || !response.access_token) return reject(new Error(response.error ?? "Sign-in was cancelled"));
        resolve({ value: response.access_token, expiresAt: Date.now() + (response.expires_in ?? 3600) * 1000 });
      },
      error_callback: (error) => reject(new Error(error.type === "popup_closed" ? "Sign-in was cancelled" : "Sign-in failed")),
    });
    client.requestAccessToken({ prompt: interactive ? "consent" : "" });
  });
}

export async function revokeToken(token: AccessToken): Promise<void> {
  const accounts = await loadScript();
  await new Promise<void>((resolve) => accounts.oauth2.revoke(token.value, resolve));
}
