const fractions: ReadonlyArray<readonly [number, string]> = [
  [1 / 8, "⅛"], [1 / 4, "¼"], [1 / 3, "⅓"], [1 / 2, "½"], [2 / 3, "⅔"], [3 / 4, "¾"],
];

/** Shows kitchen-friendly numbers: 0.5 → "½", 1.333 → "1⅓", 412.7 → "413". */
export function formatQuantity(value: number): string {
  if (value >= 20) return String(Math.round(value));
  const whole = Math.floor(value);
  const remainder = value - whole;
  const match = fractions.find(([fraction]) => Math.abs(remainder - fraction) < 0.04);
  if (match) return whole === 0 ? match[1] : `${whole}${match[1]}`;
  if (remainder < 0.04) return String(whole);
  if (remainder > 0.96) return String(whole + 1);
  return String(Math.round(value * 10) / 10);
}

export const scaleQuantity = (quantity: number, baseServings: number, servings: number): number =>
  (quantity * servings) / baseServings;
