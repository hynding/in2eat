import Link from "next/link";
import styles from "./Card.module.css";

interface CardProps {
  readonly href: string;
  readonly title: string;
  readonly eyebrow?: React.ReactNode;
  readonly children?: React.ReactNode;
  readonly footer?: React.ReactNode;
  readonly accent?: "recipe" | "takeout" | "delivery";
}

/** A whole-card link: the title carries the link, a pseudo-element stretches it over the card. */
export function Card({ href, title, eyebrow, children, footer, accent }: CardProps) {
  return (
    <article className={styles.card} data-accent={accent}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h3 className={styles.title}>
        <Link href={href} className={styles.link}>{title}</Link>
      </h3>
      {children && <div className={styles.body}>{children}</div>}
      {footer && <div className={styles.footer}>{footer}</div>}
    </article>
  );
}

export function CardGrid({ children }: { readonly children: React.ReactNode }) {
  return <div className={styles.grid}>{children}</div>;
}
