import { withinEditDistance } from "./fuzzy.js";
import { tokenize } from "./tokenize.js";
import type { SerializedIndex, StoredDocument } from "./types.js";

export interface SearchOptions {
  /** Only documents whose facet contains every listed value match. */
  readonly filters?: Readonly<Record<string, readonly string[]>>;
  readonly limit?: number;
}

export interface SearchHit {
  readonly document: StoredDocument;
  readonly score: number;
}

export interface SearchResult {
  readonly hits: SearchHit[];
  readonly total: number;
  /** Counts per facet value across all matches, for filter chips. */
  readonly facetCounts: Record<string, Record<string, number>>;
  /** True when no document matched every word, so we fell back to any word. */
  readonly relaxed: boolean;
}

/** How much a match counts, by how the query word reached the indexed term. */
const matchQuality = { exact: 1, prefix: 0.7, fuzzy: 0.45 } as const;

const fuzzBudget = (word: string): number => (word.length >= 8 ? 2 : word.length >= 4 ? 1 : 0);

export class Searcher {
  constructor(private readonly index: SerializedIndex) {}

  search(query: string, options: SearchOptions = {}): SearchResult {
    const words = tokenize(query);
    const candidates = this.applyFilters(options.filters ?? {});

    if (words.length === 0) {
      const hits = candidates.map((i) => ({ document: this.index.documents[i]!, score: 0 }));
      return this.result(hits, options.limit, false);
    }

    const perWord = words.map((word, i) => this.scoreWord(word, i === words.length - 1));
    const strict = this.combine(perWord, candidates, true);
    const relaxed = strict.length === 0 && words.length > 1;
    const hits = relaxed ? this.combine(perWord, candidates, false) : strict;
    return this.result(hits, options.limit, relaxed);
  }

  /** Terms starting with `prefix`, most widely used first. For autocomplete. */
  suggest(prefix: string, limit = 6): string[] {
    const [word] = tokenize(prefix);
    if (!word) return [];
    return this.prefixRange(word)
      .sort((a, b) => this.index.postings[b]!.length - this.index.postings[a]!.length)
      .slice(0, limit)
      .map((i) => this.index.terms[i]!);
  }

  private scoreWord(word: string, isLastWord: boolean): Map<number, number> {
    const scores = new Map<number, number>();
    const add = (termIndex: number, quality: number) => {
      for (const [doc, weight] of this.index.postings[termIndex]!) {
        scores.set(doc, Math.max(scores.get(doc) ?? 0, weight * quality));
      }
    };

    const exact = this.findTerm(word);
    if (exact >= 0) add(exact, matchQuality.exact);

    // The word being typed is probably incomplete, so prefix-match it; earlier
    // words get prefix matching only when long enough to be meaningful.
    if (isLastWord || word.length >= 4) {
      for (const i of this.prefixRange(word)) if (i !== exact) add(i, matchQuality.prefix);
    }

    const budget = fuzzBudget(word);
    if (budget > 0) {
      this.index.terms.forEach((term, i) => {
        if (term !== word && withinEditDistance(word, term, budget)) add(i, matchQuality.fuzzy);
      });
    }
    return scores;
  }

  private combine(perWord: Map<number, number>[], candidates: number[], requireAll: boolean) {
    return candidates.flatMap((doc) => {
      const matched = perWord.map((scores) => scores.get(doc) ?? 0);
      const matchedCount = matched.filter((s) => s > 0).length;
      if (matchedCount === 0 || (requireAll && matchedCount < perWord.length)) return [];
      const score = matched.reduce((sum, s) => sum + s, 0) * (matchedCount / perWord.length);
      return [{ document: this.index.documents[doc]!, score }];
    });
  }

  private applyFilters(filters: Readonly<Record<string, readonly string[]>>): number[] {
    const active = Object.entries(filters).filter(([, values]) => values.length > 0);
    return this.index.documents.flatMap((doc, i) =>
      active.every(([facet, values]) => values.every((v) => doc.facets[facet]?.includes(v))) ? [i] : [],
    );
  }

  private result(hits: SearchHit[], limit = 50, relaxed: boolean): SearchResult {
    const sorted = [...hits].sort((a, b) => b.score - a.score || a.document.title.localeCompare(b.document.title));
    return { hits: sorted.slice(0, limit), total: hits.length, facetCounts: countFacets(hits), relaxed };
  }

  private findTerm(term: string): number {
    const i = this.lowerBound(term);
    return this.index.terms[i] === term ? i : -1;
  }

  private prefixRange(prefix: string): number[] {
    const range: number[] = [];
    for (let i = this.lowerBound(prefix); i < this.index.terms.length && this.index.terms[i]!.startsWith(prefix); i++) {
      range.push(i);
    }
    return range;
  }

  private lowerBound(term: string): number {
    let low = 0;
    let high = this.index.terms.length;
    while (low < high) {
      const mid = (low + high) >>> 1;
      if (this.index.terms[mid]! < term) low = mid + 1;
      else high = mid;
    }
    return low;
  }
}

function countFacets(hits: SearchHit[]): Record<string, Record<string, number>> {
  const counts: Record<string, Record<string, number>> = {};
  for (const { document } of hits) {
    for (const [facet, values] of Object.entries(document.facets)) {
      const facetCounts = (counts[facet] ??= {});
      for (const value of values) facetCounts[value] = (facetCounts[value] ?? 0) + 1;
    }
  }
  return counts;
}
