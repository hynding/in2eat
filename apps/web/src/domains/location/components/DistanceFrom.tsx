"use client";

import type { GeoPoint } from "@in2eat/content-schema";
import { distanceKm, formatDistance } from "../lib/geo";
import { useLocation } from "./useLocation";
import styles from "./Location.module.css";

export function DistanceFrom({ point }: { readonly point: GeoPoint }) {
  const { location, units } = useLocation();
  if (!location) return null;
  return <span className={styles.status}>{formatDistance(distanceKm(location.point, point), units)} from you</span>;
}
