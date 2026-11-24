/** The search page's state, mirrored in the URL so results can be shared and bookmarked. */
export interface QueryState {
  readonly q: string;
  readonly filters: Readonly<Record<string, readonly string[]>>;
}

export const facetLabels: Readonly<Record<string, string>> = {
  kind: "Type",
  course: "Course",
  diet: "Diet",
  cuisine: "Cuisine",
  service: "Service",
  offers: "Delivers",
};

export const facetOrder = Object.keys(facetLabels);

export function parseQueryState(search: string): QueryState {
  const params = new URLSearchParams(search);
  const filters: Record<string, string[]> = {};
  for (const facet of facetOrder) {
    const values = params.getAll(facet).filter(Boolean);
    if (values.length > 0) filters[facet] = values;
  }
  return { q: params.get("q") ?? "", filters };
}

export function serializeQueryState({ q, filters }: QueryState): string {
  const params = new URLSearchParams();
  if (q.trim()) params.set("q", q.trim());
  for (const [facet, values] of Object.entries(filters)) for (const value of values) params.append(facet, value);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function toggleFilter(state: QueryState, facet: string, value: string): QueryState {
  const current = state.filters[facet] ?? [];
  const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  const { [facet]: _removed, ...rest } = state.filters;
  return { ...state, filters: next.length > 0 ? { ...rest, [facet]: next } : rest };
}
