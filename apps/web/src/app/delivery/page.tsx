import type { Metadata } from "next";
import { listEntries } from "@/domains/content/repository";
import { DeliveryNearYou } from "@/domains/location/components/DeliveryNearYou";
import { PageHeader } from "@/shared/ui/PageHeader";

export const metadata: Metadata = { title: "Delivery" };

export default function DeliveryPage() {
  const services = listEntries("delivery");
  return (
    <>
      <PageHeader eyebrow="Get it delivered" title="Delivery services" lead="Food, drink and grocery delivery, and where each one reaches." />
      <DeliveryNearYou services={services} />
    </>
  );
}
