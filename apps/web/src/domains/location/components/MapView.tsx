"use client";

import { useEffect, useRef, useState } from "react";
import type { GeoPoint } from "@in2eat/content-schema";
import type { CircleMarker, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { withBasePath } from "@/shared/lib/base-path";
import { useLocation } from "./useLocation";
import styles from "./Location.module.css";

export interface MapMarker {
  readonly point: GeoPoint;
  readonly label: string;
  readonly href?: string;
}

export interface MapArea {
  readonly center: GeoPoint;
  readonly radiusKm: number;
  readonly label: string;
}

interface MapViewProps {
  readonly markers?: readonly MapMarker[];
  readonly areas?: readonly MapArea[];
  readonly label: string;
}

// Stable defaults: fresh [] literals would re-run the map effect on every render.
const NO_MARKERS: readonly MapMarker[] = [];
const NO_AREAS: readonly MapArea[] = [];

const cssColor = (name: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#c93a1f";

const escapeHtml = (text: string): string =>
  text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * OpenStreetMap via Leaflet. Leaflet touches `window`, so it is imported
 * inside the effect and never runs during the static build.
 */
export function MapView({ markers = NO_MARKERS, areas = NO_AREAS, label }: MapViewProps) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const userMarker = useRef<CircleMarker | null>(null);
  const [ready, setReady] = useState(false);
  const { location } = useLocation();

  useEffect(() => {
    let cancelled = false;
    void import("leaflet").then((L) => {
      if (cancelled || !container.current || map.current) return;
      const instance = L.map(container.current, { scrollWheelZoom: false });
      map.current = instance;

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(instance);

      const bounds = L.latLngBounds([]);
      const accent = cssColor("--color-takeout");
      for (const marker of markers) {
        const popup = marker.href
          ? `<a href="${withBasePath(marker.href)}">${escapeHtml(marker.label)}</a>`
          : escapeHtml(marker.label);
        L.circleMarker(marker.point, { radius: 9, color: accent, fillColor: accent, fillOpacity: 0.85, weight: 2 })
          .bindPopup(popup)
          .addTo(instance);
        bounds.extend(marker.point);
      }

      const areaColor = cssColor("--color-delivery");
      for (const area of areas) {
        const radius = area.radiusKm * 1000;
        L.circle(area.center, { radius, color: areaColor, fillOpacity: 0.12, weight: 2 })
          .bindTooltip(escapeHtml(area.label))
          .addTo(instance);
        // Circle#getBounds needs a projected map; LatLng#toBounds does not.
        bounds.extend(L.latLng(area.center).toBounds(radius * 2));
      }

      if (bounds.isValid()) instance.fitBounds(bounds, { padding: [24, 24], maxZoom: 15 });
      else instance.setView([20, 0], 2);
      setReady(true);
    });

    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      userMarker.current = null;
      setReady(false);
    };
  }, [markers, areas]);

  useEffect(() => {
    const instance = map.current;
    if (!ready || !instance) return;
    userMarker.current?.remove();
    userMarker.current = null;
    if (!location) return;
    void import("leaflet").then((L) => {
      const color = cssColor("--color-focus");
      userMarker.current = L.circleMarker(location.point, { radius: 7, color, fillColor: color, fillOpacity: 1 })
        .bindTooltip("You")
        .addTo(instance);
    });
  }, [location, ready]);

  return <div ref={container} className={styles.map} role="region" aria-label={label} />;
}
