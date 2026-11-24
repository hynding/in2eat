const stopWords = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "in", "into", "is", "it",
  "of", "on", "or", "the", "to", "with", "your", "you", "until", "then", "this", "that",
]);

const stripDiacritics = (text: string): string => text.normalize("NFKD").replace(/\p{Diacritic}/gu, "");

/**
 * A deliberately light stemmer: folds common English plurals so "tomatoes",
 * "tomato" and "noodles"/"noodle" meet. Aggressive stemming hurts prefix search.
 */
export function stem(word: string): string {
  if (word.length <= 3) return word;
  if (word.endsWith("ies") && word.length > 4) return `${word.slice(0, -3)}y`;
  if (word.endsWith("oes")) return word.slice(0, -2);
  if (/(ches|shes|sses|xes)$/.test(word)) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss") && !word.endsWith("us")) return word.slice(0, -1);
  return word;
}

/** Normalizes text into index terms. Used identically at build time and query time. */
export function tokenize(text: string): string[] {
  return stripDiacritics(text.toLowerCase())
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word.length > 1 && !stopWords.has(word))
    .map(stem);
}
