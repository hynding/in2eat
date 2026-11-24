import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findEntry, listEntries, slugParams } from "@/domains/content/repository";
import { DeliveryDetail } from "@/domains/delivery/components/DeliveryDetail";

type Props = { readonly params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = slugParams("delivery");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = findEntry("delivery", (await params).slug);
  return service ? { title: service.title, description: service.summary } : {};
}

export default async function DeliveryServicePage({ params }: Props) {
  const service = findEntry("delivery", (await params).slug);
  if (!service) notFound();
  const places = listEntries("takeout").filter((p) => p.deliveredBy.includes(service.slug));
  return <DeliveryDetail service={service} places={places} />;
}
