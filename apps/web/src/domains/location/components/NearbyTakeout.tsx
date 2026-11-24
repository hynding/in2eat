"use client";

import { useMemo } from "react";
import type { Entry } from "@in2eat/content-schema";
import { TakeoutCard } from "@/domains/takeout/components/TakeoutCard";
import { CardGrid } from "@/shared/ui/Card";
import { formatDistance, sortByDistance } from "../lib/geo";
import { LocationPicker } from "./LocationPicker";
import { MapView } from "./MapView";
import { useLocation } from "./useLocation";

/** Takeout list with a map, sorted nearest first once the visitor sets a location. */
export function NearbyTakeout({ places }: { readonly places: readonly Entry<"takeout">[] }) {
  const { location, units } = useLocation();
  const markers = useMemo(
    () => places.map((p) => ({ point: p.location, label: p.title, href: `/takeout/${p.slug}/` })),
    [places],
  );

  const ordered = location
    ? sortByDistance(places, location.point, (p) => p.location)
    : places.map((item) => ({ item, km: undefined }));

  return (
    <>
      <LocationPicker />
      <MapView markers={markers} label="Map of takeout places" />
      <CardGrid>
        {ordered.map(({ item, km }) => (
          <TakeoutCard
            key={item.slug}
            place={item}
            detail={km === undefined ? undefined : `${formatDistance(km, units)} away · ${item.address.city}`}
          />
        ))}
      </CardGrid>
    </>
  );
}
