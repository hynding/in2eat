import type { Entry } from "@in2eat/content-schema";
import { humanize } from "@/shared/lib/format";
import { Card } from "@/shared/ui/Card";
import { Chip, ChipList } from "@/shared/ui/Chip";

interface DeliveryCardProps {
  readonly service: Entry<"delivery">;
  readonly detail?: React.ReactNode;
}

export function DeliveryCard({ service, detail }: DeliveryCardProps) {
  return (
    <Card
      href={`/delivery/${service.slug}/`}
      title={service.title}
      accent="delivery"
      eyebrow={service.coverage.map((c) => c.label).join(" · ")}
      footer={<ChipList>{service.kinds.map((k) => <Chip key={k} tone="delivery">{humanize(k)}</Chip>)}</ChipList>}
    >
      <p>{service.summary}</p>
      {detail && <p>{detail}</p>}
    </Card>
  );
}
