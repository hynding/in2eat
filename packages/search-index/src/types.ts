/** Searchable text fields, in descending order of importance. */
export const fieldWeights = { title: 6, tags: 3, summary: 2, body: 1 } as const;
export type FieldName = keyof typeof fieldWeights;

/** What the indexer is given for each piece of content. */
export interface IndexableDocument {
  readonly id: string;
  readonly kind: string;
  readonly title: string;
  readonly summary: string;
  readonly url: string;
  readonly text: Readonly<Record<FieldName, string>>;
  readonly facets: Readonly<Record<string, readonly string[]>>;
  readonly geo?: { readonly lat: number; readonly lng: number };
}

/** What the browser receives for each document: display data only, no raw text. */
export type StoredDocument = Omit<IndexableDocument, "text">;

/** Postings are [documentIndex, weightedFrequency] pairs. */
export type Posting = readonly [number, number];

export interface SerializedIndex {
  readonly version: 1;
  readonly builtAt: string;
  readonly documents: readonly StoredDocument[];
  /** Sorted alphabetically so the client can binary-search prefixes. */
  readonly terms: readonly string[];
  /** postings[i] belongs to terms[i]. */
  readonly postings: readonly (readonly Posting[])[];
}
