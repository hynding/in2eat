import type { MenuSection } from "@in2eat/content-schema";
import { humanize } from "@/shared/lib/format";
import { Chip, ChipList } from "@/shared/ui/Chip";
import { formatPrice } from "../lib/price";
import styles from "./TakeoutDetail.module.css";

interface MenuProps {
  readonly sections: readonly MenuSection[];
  readonly currency: string;
}

export function Menu({ sections, currency }: MenuProps) {
  return (
    <section aria-labelledby="menu-heading" className={styles.menu}>
      <h2 id="menu-heading">Menu</h2>
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className={styles.menuSection}>
          <h3>{section.section}</h3>
          <ul>
            {section.items.map((item, index) => (
              <li key={index} className={styles.menuItem}>
                <div>
                  <p className={styles.itemName}>{item.name}</p>
                  {item.description && <p className={styles.itemDescription}>{item.description}</p>}
                  {item.tags.length > 0 && (
                    <ChipList>{item.tags.map((t) => <Chip key={t}>{humanize(t)}</Chip>)}</ChipList>
                  )}
                </div>
                {item.price !== undefined && <span className={styles.price}>{formatPrice(item.price, currency)}</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
