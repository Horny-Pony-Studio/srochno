/**
 * Format a rating value to exactly 1 decimal place.
 * Examples: 5 → "5.0", 3.3333 → "3.3", 4.7 → "4.7"
 */
export function formatRating(value: number): string {
  return value.toFixed(1);
}

/**
 * Format a balance/currency value as an integer (no decimals).
 * Examples: 500 → "500", 1234 → "1 234", 99.9 → "100"
 */
export function formatBalance(value: number): string {
  return Math.round(value).toLocaleString('ru-RU');
}
