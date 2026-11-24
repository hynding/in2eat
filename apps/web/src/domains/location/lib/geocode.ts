import type { GeoPoint } from "@in2eat/content-schema";

export interface Place {
  readonly label: string;
  readonly point: GeoPoint;
}

interface NominatimResult {
  readonly display_name: string;
  readonly lat: string;
  readonly lon: string;
}

const ENDPOINT = "https://nominatim.openstreetmap.org/search";

/**
 * Looks up a typed address with OpenStreetMap Nominatim. Only call this on an
 * explicit user action (never per keystroke), per the Nominatim usage policy.
 */
export async function geocode(query: string, signal?: AbortSignal): Promise<Place[]> {
  const params = new URLSearchParams({ q: query, format: "jsonv2", limit: "5", addressdetails: "0" });
  const response = await fetch(`${ENDPOINT}?${params}`, { signal, headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Address lookup failed (${response.status})`);
  const results = (await response.json()) as NominatimResult[];
  return results.map((r) => ({ label: r.display_name, point: { lat: Number(r.lat), lng: Number(r.lon) } }));
}

/** Wraps the browser Geolocation API in a promise. */
export function currentPosition(): Promise<GeoPoint> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) return reject(new Error("This browser can't share its location."));
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
      (error) => reject(new Error(error.code === error.PERMISSION_DENIED ? "Location permission was denied." : "Couldn't get your location.")),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60_000 },
    );
  });
}
