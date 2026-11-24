import type { AccessToken } from "./google-identity";

/** Supplies access tokens. Google tokens last about an hour, so the store asks again when one is rejected. */
export interface TokenSource {
  current(): Promise<AccessToken>;
  renew(): Promise<AccessToken>;
}
import { parseSettings, type Settings } from "./settings";
import type { SettingsStore } from "./store";

const FILE_NAME = "in2eat-settings.json";
const API = "https://www.googleapis.com/drive/v3/files";
const UPLOAD = "https://www.googleapis.com/upload/drive/v3/files";

export class DriveRequestError extends Error {
  constructor(readonly status: number) {
    super(`Google Drive request failed (${status})`);
  }
}

/**
 * Saves settings as one JSON file in the user's hidden Drive appDataFolder.
 * Only this app can see the file, and it needs only the drive.appdata scope.
 */
export class GoogleDriveSettingsStore implements SettingsStore {
  readonly id = "google-drive";
  private fileId: string | undefined;

  constructor(private readonly tokens: TokenSource) {}

  async load(): Promise<Settings | null> {
    const id = await this.findFile();
    if (!id) return null;
    const response = await this.request(`${API}/${id}?alt=media`);
    return parseSettings(await response.json());
  }

  async save(settings: Settings): Promise<void> {
    const id = await this.findFile();
    const body = JSON.stringify(settings);
    if (id) {
      await this.request(`${UPLOAD}/${id}?uploadType=media`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body });
      return;
    }
    const form = new FormData();
    form.append("metadata", new Blob([JSON.stringify({ name: FILE_NAME, parents: ["appDataFolder"] })], { type: "application/json" }));
    form.append("file", new Blob([body], { type: "application/json" }));
    const response = await this.request(`${UPLOAD}?uploadType=multipart&fields=id`, { method: "POST", body: form });
    this.fileId = ((await response.json()) as { id: string }).id;
  }

  private async findFile(): Promise<string | undefined> {
    if (this.fileId) return this.fileId;
    const params = new URLSearchParams({ spaces: "appDataFolder", q: `name='${FILE_NAME}' and trashed=false`, fields: "files(id)", pageSize: "1" });
    const response = await this.request(`${API}?${params}`);
    const { files } = (await response.json()) as { files: { id: string }[] };
    this.fileId = files[0]?.id;
    return this.fileId;
  }

  private async request(url: string, init: RequestInit = {}): Promise<Response> {
    const send = (token: AccessToken) =>
      fetch(url, { ...init, headers: { ...init.headers, Authorization: `Bearer ${token.value}` } });

    let response = await send(await this.tokens.current());
    if (response.status === 401) response = await send(await this.tokens.renew());
    if (!response.ok) throw new DriveRequestError(response.status);
    return response;
  }
}
