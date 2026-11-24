import { editFileUrl, issueFormUrl } from "../lib/github";
import styles from "./Submit.module.css";

interface SuggestEditProps {
  readonly path: string;
  readonly title: string;
}

/** Footer links on every entry page: fix it yourself (PR) or report it (issue). */
export function SuggestEdit({ path, title }: SuggestEditProps) {
  const report = issueFormUrl("request.yml", { kind: "Fix or update an existing entry", subject: title }, `[Fix] ${title}`);
  return (
    <p className={styles.hint}>
      Something wrong? <a href={editFileUrl(path)} rel="noopener">Edit this entry</a> or{" "}
      <a href={report} rel="noopener">report it</a>.
    </p>
  );
}
