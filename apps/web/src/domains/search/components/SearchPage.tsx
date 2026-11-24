"use client";

import { humanize } from "@/shared/lib/format";
import { facetLabels, facetOrder, toggleFilter } from "../lib/query-state";
import { SearchResults } from "./SearchResults";
import { useSearch } from "./useSearch";
import styles from "./Search.module.css";

export function SearchPage() {
  const { status, state, setState, result, suggestions } = useSearch();
  const replaceLastWord = (word: string) =>
    setState({ ...state, q: `${state.q.replace(/\S*$/, word)} ` });

  return (
    <div className={styles.layout}>
      <div className={styles.searchBar}>
        <label htmlFor="search-input" className="visually-hidden">Search recipes, takeout and delivery</label>
        <input
          id="search-input"
          type="search"
          className={styles.input}
          placeholder="Try “noodles”, “vegan dessert” or “late night”"
          value={state.q}
          onChange={(e) => setState({ ...state, q: e.target.value })}
          autoFocus
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <div className={styles.suggestions} aria-label="Suggestions">
            {suggestions.map((word) => (
              <button key={word} type="button" onClick={() => replaceLastWord(word)}>{word}</button>
            ))}
          </div>
        )}
      </div>

      <aside className={styles.filters} aria-label="Filters">
        {result &&
          facetOrder
            .filter((facet) => Object.keys(result.facetCounts[facet] ?? {}).length > 0 || state.filters[facet])
            .map((facet) => (
              <fieldset key={facet} className={styles.facet}>
                <legend>{facetLabels[facet]}</legend>
                {Object.entries(result.facetCounts[facet] ?? {})
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([value, count]) => (
                    <label key={value} className={styles.facetOption}>
                      <input
                        type="checkbox"
                        checked={state.filters[facet]?.includes(value) ?? false}
                        onChange={() => setState(toggleFilter(state, facet, value))}
                      />
                      <span>{humanize(value)}</span>
                      <span className={styles.count}>{count}</span>
                    </label>
                  ))}
              </fieldset>
            ))}
      </aside>

      <section className={styles.results} aria-live="polite">
        {status === "loading" && <p>Loading search…</p>}
        {status === "error" && <p>Search isn't available right now. Check your connection and try again.</p>}
        {result && <SearchResults result={result} query={state.q} />}
      </section>
    </div>
  );
}
