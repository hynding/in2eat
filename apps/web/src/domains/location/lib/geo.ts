import type { CoverageArea, GeoPoint } from "@in2eat/content-schema";

const EARTH_RADIUS_KM = 6371;
const KM_PER_MILE = 1.609344;
const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

/** Great-circle distance between two points (haversine formula). */
export function distanceKm(a: GeoPoint, b: GeoPoint): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/** The coverage area that includes `point`, if any. */
export const findCoverage = (point: GeoPoint, areas: readonly CoverageArea[]): CoverageArea | undefined =>
  areas.find((area) => distanceKm(point, area.center) <= area.radiusKm);

export type Units = "metric" | "imperial";

export function formatDistance(km: number, units: Units): string {
  const value = units === "imperial" ? km / KM_PER_MILE : km;
  const unit = units === "imperial" ? "mi" : "km";
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${unit}`;
}

/** Sorts items by distance from `origin`, attaching the distance. */
export function sortByDistance<T>(items: readonly T[], origin: GeoPoint, pointOf: (item: T) => GeoPoint) {
  return items
    .map((item) => ({ item, km: distanceKm(origin, pointOf(item)) }))
    .sort((a, b) => a.km - b.km);
}
