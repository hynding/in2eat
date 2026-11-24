import type { Metadata } from "next";
import { listEntries } from "@/domains/content/repository";
import { DeliveryCard } from "@/domains/delivery/components/DeliveryCard";
import { CardGrid } from "@/shared/ui/Card";
import { PageHeader } from "@/shared/ui/PageHeader";

export const metadata: Metadata = { title: "Delivery" };

export default function DeliveryPage() {
  const services = listEntries("delivery");
  return (
    <>
      <PageHeader eyebrow="Get it delivered" title="Delivery services" lead="Food, drink and grocery delivery, and where each one reaches." />
      <CardGrid>{services.map((s) => <DeliveryCard key={s.slug} service={s} />)}</CardGrid>
    </>
  );
}
