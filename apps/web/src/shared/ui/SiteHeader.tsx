import Link from "next/link";
import styles from "./SiteHeader.module.css";

const navigation = [
  { href: "/recipes/", label: "Recipes" },
  { href: "/takeout/", label: "Takeout" },
  { href: "/delivery/", label: "Delivery" },
  { href: "/search/", label: "Search" },
  { href: "/submit/", label: "Contribute" },
  { href: "/settings/", label: "Settings" },
] as const;

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          In2Eat
        </Link>
        <nav aria-label="Main">
          <ul className={styles.nav}>
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.link}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
