import type { Entry } from "@in2eat/content-schema";
import { humanize } from "@/shared/lib/format";
import { ButtonLink } from "@/shared/ui/Button";
import { CardGrid } from "@/shared/ui/Card";
import { Chip, ChipList } from "@/shared/ui/Chip";
import { PageHeader } from "@/shared/ui/PageHeader";
import { Section } from "@/shared/ui/Section";
import { TakeoutCard } from "@/domains/takeout/components/TakeoutCard";
import styles from "./DeliveryDetail.module.css";

interface DeliveryDetailProps {
  readonly service: Entry<"delivery">;
  readonly places: readonly Entry<"takeout">[];
  readonly map?: React.ReactNode;
  readonly coverageCheck?: React.ReactNode;
}

export function DeliveryDetail({ service, places, map, coverageCheck }: DeliveryDetailProps) {
  return (
    <article>
      <PageHeader eyebrow="Delivery service" title={service.title} lead={service.summary}>
        <ChipList>{service.kinds.map((k) => <Chip key={k} tone="delivery">{humanize(k)}</Chip>)}</ChipList>
      </PageHeader>

      <div className={styles.actions}>
        <ButtonLink href={service.website} rel="noopener">Order on their site</ButtonLink>
        {service.apps.ios && <ButtonLink variant="secondary" href={service.apps.ios} rel="noopener">iOS app</ButtonLink>}
        {service.apps.android && <ButtonLink variant="secondary" href={service.apps.android} rel="noopener">Android app</ButtonLink>}
      </div>

      <div className={styles.layout}>
        <section className={styles.panel}>
          <h2>Coverage</h2>
          <ul>{service.coverage.map((c) => <li key={c.label}>{c.label} (within {c.radiusKm} km)</li>)}</ul>
          {coverageCheck}
        </section>
        {(service.fees.delivery || service.fees.minimumOrder) && (
          <section className={styles.panel}>
            <h2>Fees</h2>
            <dl>
              {service.fees.delivery && (<><dt>Delivery</dt><dd>{service.fees.delivery}</dd></>)}
              {service.fees.minimumOrder && (<><dt>Minimum order</dt><dd>{service.fees.minimumOrder}</dd></>)}
            </dl>
          </section>
        )}
      </div>

      {map}

      {places.length > 0 && (
        <Section title="Takeout they deliver">
          <CardGrid>{places.map((p) => <TakeoutCard key={p.slug} place={p} />)}</CardGrid>
        </Section>
      )}
    </article>
  );
}
