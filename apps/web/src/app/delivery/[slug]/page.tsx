import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/domains/settings/components/FavoriteButton";
import { SuggestEdit } from "@/domains/submissions/components/SuggestEdit";
import { findEntry, listEntries, slugParams } from "@/domains/content/repository";
import { CoverageCheck } from "@/domains/location/components/CoverageCheck";
import { MapView } from "@/domains/location/components/MapView";
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
  return (
    <>
      <DeliveryDetail
        actions={<FavoriteButton id={`delivery/${service.slug}`} title={service.title} />}
        service={service}
        places={places}
        coverageCheck={<CoverageCheck coverage={service.coverage} />}
        map={<MapView areas={service.coverage} label={`Coverage map for ${service.title}`} />}
      />
      <SuggestEdit path={`content/delivery/${service.slug}.yaml`} title={service.title} />
    </>
  );
}
