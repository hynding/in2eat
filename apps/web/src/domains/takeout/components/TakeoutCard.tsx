import type { Entry } from "@in2eat/content-schema";
import { humanize } from "@/shared/lib/format";
import { Card } from "@/shared/ui/Card";
import { Chip, ChipList } from "@/shared/ui/Chip";

interface TakeoutCardProps {
  readonly place: Entry<"takeout">;
  /** Extra line such as distance, supplied by location-aware lists. */
  readonly detail?: React.ReactNode;
}

export function TakeoutCard({ place, detail }: TakeoutCardProps) {
  return (
    <Card
      href={`/takeout/${place.slug}/`}
      title={place.title}
      accent="takeout"
      eyebrow={place.cuisine.map(humanize).join(" · ")}
      footer={<ChipList>{place.services.map((s) => <Chip key={s} tone="takeout">{humanize(s)}</Chip>)}</ChipList>}
    >
      <p>{place.summary}</p>
      <p>{detail ?? place.address.city}</p>
    </Card>
  );
}
