import { withBasePath } from "@/shared/lib/base-path";
import styles from "./HeaderSearch.module.css";

/** A plain GET form, so it works before JavaScript loads and on every page. */
export function HeaderSearch() {
  return (
    <form action={withBasePath("/search/")} method="get" role="search" className={styles.form}>
      <label htmlFor="header-search" className="visually-hidden">Search</label>
      <input id="header-search" name="q" type="search" placeholder="Search…" className={styles.input} />
    </form>
  );
}
