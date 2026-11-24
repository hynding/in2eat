"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/Button";
import { geocode, type Place } from "../lib/geocode";
import { useLocation } from "./useLocation";
import styles from "./Location.module.css";

/** Lets the visitor share their device location or look up an address. */
export function LocationPicker() {
  const { location, status, error, locateDevice, setLocation } = useLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [lookupError, setLookupError] = useState<string>();

  async function lookUp(event: React.FormEvent) {
    event.preventDefault();
    if (!query.trim() || searching) return;
    setSearching(true);
    setLookupError(undefined);
    try {
      const places = await geocode(query.trim());
      setResults(places);
      if (places.length === 0) setLookupError("No matching places found.");
    } catch (e) {
      setLookupError((e as Error).message);
    } finally {
      setSearching(false);
    }
  }

  function choose(place: Place) {
    setLocation({ label: place.label, point: place.point, source: "address" });
    setResults([]);
    setQuery("");
  }

  return (
    <section className={styles.picker} aria-label="Your location">
      <div className={styles.current}>
        {location ? (
          <>
            <span>Near <strong>{location.label}</strong></span>
            <button type="button" className={styles.linkButton} onClick={() => setLocation(null)}>Clear</button>
          </>
        ) : (
          <span>Set your location to sort by distance and see who delivers to you.</span>
        )}
      </div>

      <div className={styles.controls}>
        <Button onClick={locateDevice} disabled={status === "locating"}>
          {status === "locating" ? "Locating…" : "Use my location"}
        </Button>
        <form onSubmit={lookUp} className={styles.addressForm}>
          <label htmlFor="address-lookup" className="visually-hidden">Address or neighbourhood</label>
          <input
            id="address-lookup"
            className={styles.input}
            placeholder="or enter an address"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" variant="secondary" disabled={searching}>{searching ? "Finding…" : "Find"}</Button>
        </form>
      </div>

      {(error || lookupError) && <p role="alert" className={styles.error}>{error ?? lookupError}</p>}

      {results.length > 0 && (
        <ul className={styles.results}>
          {results.map((place) => (
            <li key={`${place.point.lat},${place.point.lng}`}>
              <button type="button" className={styles.linkButton} onClick={() => choose(place)}>{place.label}</button>
            </li>
          ))}
        </ul>
      )}
      <p className={styles.credit}>Address search by OpenStreetMap Nominatim.</p>
    </section>
  );
}
