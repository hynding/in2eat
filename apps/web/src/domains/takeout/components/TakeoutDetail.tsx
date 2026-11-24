import Link from "next/link";
import type { Entry } from "@in2eat/content-schema";
import { humanize } from "@/shared/lib/format";
import { Chip, ChipList } from "@/shared/ui/Chip";
import { PageHeader } from "@/shared/ui/PageHeader";
import { hoursByDay } from "../lib/hours";
import { Menu } from "./Menu";
import { OpenNow } from "./OpenNow";
import styles from "./TakeoutDetail.module.css";

interface TakeoutDetailProps {
  readonly place: Entry<"takeout">;
  readonly deliveredBy: readonly Entry<"delivery">[];
  /** Slot for the map, which the location domain provides. */
  readonly map?: React.ReactNode;
  /** Slot for "x km from you", which the location domain provides. */
  readonly distance?: React.ReactNode;
  readonly actions?: React.ReactNode;
}

export function TakeoutDetail({ place, deliveredBy, map, distance, actions }: TakeoutDetailProps) {
  const { address } = place;
  const addressLine = [address.street, address.city, address.region, address.postalCode].filter(Boolean).join(", ");

  return (
    <article>
      <PageHeader eyebrow={place.cuisine.map(humanize).join(" · ")} title={place.title} lead={place.summary}>
        {actions}
        <ChipList>
          <OpenNow hours={place.hours} />
          {place.services.map((s) => <Chip key={s} tone="takeout">{humanize(s)}</Chip>)}
        </ChipList>
      </PageHeader>

      <div className={styles.layout}>
        <Menu sections={place.menu} currency={place.currency} />

        <aside className={styles.aside}>
          {map}
          <section>
            <h2>Find us</h2>
            <address>{addressLine}</address>
            {distance}
            {place.phone && <p><a href={`tel:${place.phone.replace(/\s/g, "")}`}>{place.phone}</a></p>}
            {place.website && <p><a href={place.website}>Website</a></p>}
          </section>

          {place.hours.length > 0 && (
            <section>
              <h2>Hours</h2>
              <table className={styles.hours}>
                <tbody>
                  {hoursByDay(place.hours).map(([day, periods]) => (
                    <tr key={day}>
                      <th scope="row">{humanize(day)}</th>
                      <td>{periods.length > 0 ? periods.join(", ") : "Closed"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {deliveredBy.length > 0 && (
            <section>
              <h2>Delivered by</h2>
              <ul>
                {deliveredBy.map((service) => (
                  <li key={service.slug}><Link href={`/delivery/${service.slug}/`}>{service.title}</Link></li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </article>
  );
}
