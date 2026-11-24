"use client";

import type { CoverageArea } from "@in2eat/content-schema";
import { findCoverage } from "../lib/geo";
import { useLocation } from "./useLocation";
import styles from "./Location.module.css";

/** A one-line answer to "does this service reach me?" */
export function CoverageCheck({ coverage }: { readonly coverage: readonly CoverageArea[] }) {
  const { location, loaded } = useLocation();
  if (!loaded) return null;
  if (!location) return <span className={styles.status}>Set your location on the Delivery page to check coverage.</span>;

  const area = findCoverage(location.point, coverage);
  return (
    <span className={styles.status} data-state={area ? "yes" : "no"} role="status">
      {area ? `Delivers to you (${area.label})` : `Doesn't reach ${location.label} yet`}
    </span>
  );
}
