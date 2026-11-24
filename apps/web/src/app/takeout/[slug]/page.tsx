import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findEntry, listEntries, slugParams } from "@/domains/content/repository";
import { MapView } from "@/domains/location/components/MapView";
import { DistanceFrom } from "@/domains/location/components/DistanceFrom";
import { TakeoutDetail } from "@/domains/takeout/components/TakeoutDetail";

type Props = { readonly params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = slugParams("takeout");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const place = findEntry("takeout", (await params).slug);
  return place ? { title: place.title, description: place.summary } : {};
}

export default async function TakeoutPlacePage({ params }: Props) {
  const place = findEntry("takeout", (await params).slug);
  if (!place) notFound();
  const deliveredBy = listEntries("delivery").filter((d) => place.deliveredBy.includes(d.slug));
  const marker = { point: place.location, label: place.title };
  return (
    <TakeoutDetail
      place={place}
      deliveredBy={deliveredBy}
      map={<MapView markers={[marker]} label={`Map showing ${place.title}`} />}
      distance={<DistanceFrom point={place.location} />}
    />
  );
}
