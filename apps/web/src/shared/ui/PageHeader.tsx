import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  readonly title: string;
  readonly lead?: React.ReactNode;
  readonly eyebrow?: string;
  readonly children?: React.ReactNode;
}

export function PageHeader({ title, lead, eyebrow, children }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h1 className={styles.title}>{title}</h1>
      {lead && <p className={styles.lead}>{lead}</p>}
      {children}
    </header>
  );
}
