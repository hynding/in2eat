import type { Metadata } from "next";
import { listEntries } from "@/domains/content/repository";
import { TakeoutCard } from "@/domains/takeout/components/TakeoutCard";
import { CardGrid } from "@/shared/ui/Card";
import { PageHeader } from "@/shared/ui/PageHeader";

export const metadata: Metadata = { title: "Takeout" };

export default function TakeoutPage() {
  const places = listEntries("takeout");
  return (
    <>
      <PageHeader eyebrow="Collect" title="Takeout" lead="Menus from places that cook for you to pick up." />
      <CardGrid>{places.map((p) => <TakeoutCard key={p.slug} place={p} />)}</CardGrid>
    </>
  );
}
