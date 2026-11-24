/**
 * Returns true when `a` and `b` are within `max` edits, counting insertions,
 * deletions, substitutions and adjacent transpositions ("noodels" → "noodles")
 * as one edit each (optimal string alignment distance).
 * Stops early once a whole row exceeds the budget.
 */
export function withinEditDistance(a: string, b: string, max: number): boolean {
  if (Math.abs(a.length - b.length) > max) return false;

  const rows: number[][] = [Array.from({ length: b.length + 1 }, (_, j) => j)];
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(rows[i - 1]![j]! + 1, row[j - 1]! + 1, rows[i - 1]![j - 1]! + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        value = Math.min(value, rows[i - 2]![j - 2]! + 1);
      }
      row.push(value);
    }
    if (Math.min(...row) > max) return false;
    rows.push(row);
  }
  return rows[a.length]![b.length]! <= max;
}
