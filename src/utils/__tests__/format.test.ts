import { describe, it, expect } from 'vitest';
import { formatRating, formatBalance } from '../format';

// ─── formatRating ──────────────────────────────────────

describe('formatRating', () => {
  it('formats integer as X.0', () => {
    expect(formatRating(5)).toBe('5.0');
    expect(formatRating(1)).toBe('1.0');
    expect(formatRating(0)).toBe('0.0');
  });

  it('truncates long floating point to 1 decimal', () => {
    expect(formatRating(3.3333333333333334)).toBe('3.3');
    expect(formatRating(4.6666666666666667)).toBe('4.7');
    expect(formatRating(2.1499999999999999)).toBe('2.1');
  });

  it('preserves single decimal values', () => {
    expect(formatRating(4.5)).toBe('4.5');
    expect(formatRating(3.7)).toBe('3.7');
    expect(formatRating(1.0)).toBe('1.0');
  });

  it('rounds correctly at boundary', () => {
    expect(formatRating(4.95)).toBe('5.0');
    expect(formatRating(4.94)).toBe('4.9');
    expect(formatRating(3.25)).toBe('3.3');
  });

  it('handles edge case zero', () => {
    expect(formatRating(0)).toBe('0.0');
  });
});

// ─── formatBalance ─────────────────────────────────────

describe('formatBalance', () => {
  it('formats small integers without separator', () => {
    expect(formatBalance(500)).toBe('500');
    expect(formatBalance(0)).toBe('0');
    expect(formatBalance(99)).toBe('99');
  });

  it('formats thousands with space separator (ru-RU)', () => {
    // ru-RU uses non-breaking space (U+00A0) as thousands separator
    const result = formatBalance(1234);
    // Normalize any whitespace to regular space for assertion
    expect(result.replace(/\s/g, ' ')).toBe('1 234');
  });

  it('rounds float to integer', () => {
    expect(formatBalance(99.9)).toBe('100');
    expect(formatBalance(99.4)).toBe('99');
    expect(formatBalance(0.5)).toBe('1');
  });

  it('formats large numbers', () => {
    const result = formatBalance(1000000);
    expect(result.replace(/\s/g, ' ')).toBe('1 000 000');
  });
});
