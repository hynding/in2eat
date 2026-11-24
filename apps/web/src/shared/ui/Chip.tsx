import styles from "./Chip.module.css";

type Tone = "neutral" | "recipe" | "takeout" | "delivery";

interface ChipProps {
  readonly children: React.ReactNode;
  readonly tone?: Tone;
}

export function Chip({ children, tone = "neutral" }: ChipProps) {
  return <span className={styles.chip} data-tone={tone}>{children}</span>;
}

export function ChipList({ children }: { readonly children: React.ReactNode }) {
  return <div className={styles.list}>{children}</div>;
}
