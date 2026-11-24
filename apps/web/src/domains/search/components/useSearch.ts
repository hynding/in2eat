"use client";

import { useEffect, useMemo, useState } from "react";
import type { SearchResult, Searcher } from "@in2eat/search-index";
import { loadSearcher } from "../lib/load-index";
import { parseQueryState, serializeQueryState, type QueryState } from "../lib/query-state";

type Status = "loading" | "ready" | "error";

/** Owns the search page state: loads the index, keeps the URL in sync, and runs queries. */
export function useSearch() {
  const [searcher, setSearcher] = useState<Searcher>();
  const [status, setStatus] = useState<Status>("loading");
  const [state, setState] = useState<QueryState>({ q: "", filters: {} });

  useEffect(() => {
    setState(parseQueryState(window.location.search));
    loadSearcher()
      .then((s) => {
        setSearcher(s);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    const url = `${window.location.pathname}${serializeQueryState(state)}`;
    window.history.replaceState(null, "", url);
  }, [state]);

  const result: SearchResult | undefined = useMemo(
    () => searcher?.search(state.q, { filters: state.filters, limit: 100 }),
    [searcher, state],
  );

  const suggestions = useMemo(() => {
    const lastWord = state.q.split(/\s+/).pop() ?? "";
    return searcher && lastWord.length >= 2 ? searcher.suggest(lastWord) : [];
  }, [searcher, state.q]);

  return { status, state, setState, result, suggestions };
}
