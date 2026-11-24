"use client";

import type { Entry } from "@in2eat/content-schema";
import { DeliveryCard } from "@/domains/delivery/components/DeliveryCard";
import { CardGrid } from "@/shared/ui/Card";
import { Section } from "@/shared/ui/Section";
import { findCoverage } from "../lib/geo";
import { LocationPicker } from "./LocationPicker";
import { useLocation } from "./useLocation";

/** Splits delivery services into those that reach the visitor and those that don't. */
export function DeliveryNearYou({ services }: { readonly services: readonly Entry<"delivery">[] }) {
  const { location } = useLocation();

  if (!location) {
    return (
      <>
        <LocationPicker />
        <CardGrid>{services.map((s) => <DeliveryCard key={s.slug} service={s} />)}</CardGrid>
      </>
    );
  }

  const reaching = services.flatMap((s) => {
    const area = findCoverage(location.point, s.coverage);
    return area ? [{ service: s, area }] : [];
  });
  const others = services.filter((s) => !reaching.some((r) => r.service === s));

  return (
    <>
      <LocationPicker />
      <Section title={reaching.length > 0 ? "Delivers to you" : "Nobody listed delivers to you yet"}>
        <CardGrid>
          {reaching.map(({ service, area }) => (
            <DeliveryCard key={service.slug} service={service} detail={`Covers you via ${area.label}`} />
          ))}
        </CardGrid>
      </Section>
      {others.length > 0 && (
        <Section title="Elsewhere">
          <CardGrid>{others.map((s) => <DeliveryCard key={s.slug} service={s} />)}</CardGrid>
        </Section>
      )}
    </>
  );
}
