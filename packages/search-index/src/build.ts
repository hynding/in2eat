import { tokenize } from "./tokenize.js";
import { fieldWeights, type FieldName, type IndexableDocument, type Posting, type SerializedIndex } from "./types.js";

function weightedTermFrequencies(doc: IndexableDocument): Map<string, number> {
  const frequencies = new Map<string, number>();
  for (const field of Object.keys(fieldWeights) as FieldName[]) {
    for (const term of tokenize(doc.text[field])) {
      frequencies.set(term, (frequencies.get(term) ?? 0) + fieldWeights[field]);
    }
  }
  return frequencies;
}

/** Builds a compact inverted index. Runs at build time; the output is shipped as JSON. */
export function buildIndex(docs: readonly IndexableDocument[], builtAt = new Date()): SerializedIndex {
  const termPostings = new Map<string, Posting[]>();

  docs.forEach((doc, docIndex) => {
    for (const [term, weight] of weightedTermFrequencies(doc)) {
      const postings = termPostings.get(term) ?? [];
      postings.push([docIndex, weight]);
      termPostings.set(term, postings);
    }
  });

  const terms = [...termPostings.keys()].sort();
  return {
    version: 1,
    builtAt: builtAt.toISOString(),
    documents: docs.map(({ text: _text, ...stored }) => stored),
    terms,
    postings: terms.map((term) => termPostings.get(term) ?? []),
  };
}
