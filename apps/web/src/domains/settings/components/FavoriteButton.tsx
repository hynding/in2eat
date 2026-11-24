"use client";

import { useSettings } from "./SettingsProvider";
import styles from "./Settings.module.css";

/** Toggles an entry id such as "recipes/miso-ramen" in the visitor's favourites. */
export function FavoriteButton({ id, title }: { readonly id: string; readonly title: string }) {
  const { settings, update, loaded } = useSettings();
  if (!loaded) return null;
  const saved = settings.favorites.includes(id);
  const toggle = () =>
    update({ favorites: saved ? settings.favorites.filter((f) => f !== id) : [...settings.favorites, id] });

  return (
    <button type="button" className={styles.favorite} aria-pressed={saved} onClick={toggle} aria-label={`${saved ? "Remove" : "Save"} ${title}`}>
      <span aria-hidden="true">{saved ? "★" : "☆"}</span> {saved ? "Saved" : "Save"}
    </button>
  );
}
