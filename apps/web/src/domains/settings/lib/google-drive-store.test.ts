import { afterEach, describe, expect, it, vi } from "vitest";
import { GoogleDriveSettingsStore } from "./google-drive-store";
import { defaultSettings } from "./settings";

const token = { value: "t0k", expiresAt: Date.now() + 60_000 };
const tokens = { current: async () => token, renew: vi.fn(async () => ({ value: "fresh", expiresAt: Date.now() + 60_000 })) };
const json = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });

afterEach(() => vi.unstubAllGlobals());

describe("GoogleDriveSettingsStore", () => {
  it("returns null when no settings file exists", async () => {
    const fetchMock = vi.fn().mockResolvedValue(json({ files: [] }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(new GoogleDriveSettingsStore(tokens).load()).resolves.toBeNull();
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toContain("spaces=appDataFolder");
    expect(init.headers.Authorization).toBe("Bearer t0k");
  });

  it("loads and repairs the stored file", async () => {
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce(json({ files: [{ id: "abc" }] }))
      .mockResolvedValueOnce(json({ theme: "dark", units: "nonsense" })));
    const settings = await new GoogleDriveSettingsStore(tokens).load();
    expect(settings).toMatchObject({ theme: "dark", units: "metric" });
  });

  it("creates the file in appDataFolder on first save, then updates it", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(json({ files: [] }))
      .mockResolvedValueOnce(json({ id: "new-id" }))
      .mockResolvedValueOnce(json({}));
    vi.stubGlobal("fetch", fetchMock);
    const store = new GoogleDriveSettingsStore(tokens);
    await store.save(defaultSettings);
    await store.save(defaultSettings);
    expect(fetchMock.mock.calls[1]![1].method).toBe("POST");
    expect(String(fetchMock.mock.calls[2]![0])).toContain("/files/new-id?uploadType=media");
    expect(fetchMock.mock.calls[2]![1].method).toBe("PATCH");
  });

  it("renews an expired token once and retries", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response("", { status: 401 }))
      .mockResolvedValueOnce(json({ files: [] }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(new GoogleDriveSettingsStore(tokens).load()).resolves.toBeNull();
    expect(fetchMock.mock.calls[1]![1].headers.Authorization).toBe("Bearer fresh");
  });

  it("raises on HTTP errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 401 })));
    await expect(new GoogleDriveSettingsStore(tokens).load()).rejects.toThrow("401");
  });
});
