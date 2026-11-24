import Link from "next/link";
import styles from "./Section.module.css";

interface SectionProps {
  readonly title: string;
  readonly moreHref?: string;
  readonly moreLabel?: string;
  readonly children: React.ReactNode;
}

export function Section({ title, moreHref, moreLabel = "See all", children }: SectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h2 className={styles.title}>{title}</h2>
        {moreHref && <Link href={moreHref} className={styles.more}>{moreLabel}</Link>}
      </div>
      {children}
    </section>
  );
}
