import { describe, it, expect } from 'vitest';
import { formatTimeLeft, getTimeColor, getTimeBackground } from '../time';

// ─── formatTimeLeft ─────────────────────────────────────

describe('formatTimeLeft', () => {
  it('shows "MM мин" when >= 10 minutes', () => {
    expect(formatTimeLeft(600)).toBe('10 мин'); // exactly 10 min
    expect(formatTimeLeft(3600)).toBe('60 мин'); // 60 min
    expect(formatTimeLeft(1800)).toBe('30 мин'); // 30 min
  });

  it('shows "M:SS" when < 10 minutes', () => {
    expect(formatTimeLeft(599)).toBe('9:59');
    expect(formatTimeLeft(60)).toBe('1:00');
    expect(formatTimeLeft(61)).toBe('1:01');
  });

  it('pads seconds with leading zero', () => {
    expect(formatTimeLeft(5)).toBe('0:05');
    expect(formatTimeLeft(65)).toBe('1:05');
  });

  it('handles 0 seconds', () => {
    expect(formatTimeLeft(0)).toBe('0:00');
  });

  it('handles 1 second', () => {
    expect(formatTimeLeft(1)).toBe('0:01');
  });

  it('drops remainder seconds in MM мин format', () => {
    // 10 min 30 sec → shows 10 мин (floor)
    expect(formatTimeLeft(630)).toBe('10 мин');
  });
});

// ─── getTimeColor ───────────────────────────────────────

describe('getTimeColor', () => {
  it('returns green for > 40 minutes', () => {
    expect(getTimeColor(41)).toBe('text-[#34C759]');
    expect(getTimeColor(60)).toBe('text-[#34C759]');
  });

  it('returns orange for 21-40 minutes', () => {
    expect(getTimeColor(21)).toBe('text-[#FF9500]');
    expect(getTimeColor(40)).toBe('text-[#FF9500]');
    expect(getTimeColor(30)).toBe('text-[#FF9500]');
  });

  it('returns red for <= 20 minutes', () => {
    expect(getTimeColor(20)).toBe('text-[#FF3B30]');
    expect(getTimeColor(10)).toBe('text-[#FF3B30]');
    expect(getTimeColor(0)).toBe('text-[#FF3B30]');
  });

  it('boundary: 40 is orange, 41 is green', () => {
    expect(getTimeColor(40)).toBe('text-[#FF9500]');
    expect(getTimeColor(41)).toBe('text-[#34C759]');
  });

  it('boundary: 20 is red, 21 is orange', () => {
    expect(getTimeColor(20)).toBe('text-[#FF3B30]');
    expect(getTimeColor(21)).toBe('text-[#FF9500]');
  });
});

// ─── getTimeBackground ─────────────────────────────────

describe('getTimeBackground', () => {
  it('returns green bg for > 40 minutes', () => {
    expect(getTimeBackground(41)).toBe('bg-[#E5F8ED] dark:bg-[#1a3a2a]');
    expect(getTimeBackground(60)).toBe('bg-[#E5F8ED] dark:bg-[#1a3a2a]');
  });

  it('returns orange bg for 21-40 minutes', () => {
    expect(getTimeBackground(21)).toBe('bg-[#FFF5E5] dark:bg-[#3a2f1a]');
    expect(getTimeBackground(40)).toBe('bg-[#FFF5E5] dark:bg-[#3a2f1a]');
  });

  it('returns red bg for <= 20 minutes', () => {
    expect(getTimeBackground(20)).toBe('bg-[#FFE5E5] dark:bg-[#3a1a1a]');
    expect(getTimeBackground(0)).toBe('bg-[#FFE5E5] dark:bg-[#3a1a1a]');
  });

  it('matches color thresholds (same boundaries)', () => {
    // Ensure color and background have same breakpoints
    expect(getTimeColor(41).includes('34C759')).toBe(true);
    expect(getTimeBackground(41).includes('E5F8ED')).toBe(true);

    expect(getTimeColor(30).includes('FF9500')).toBe(true);
    expect(getTimeBackground(30).includes('FFF5E5')).toBe(true);

    expect(getTimeColor(10).includes('FF3B30')).toBe(true);
    expect(getTimeBackground(10).includes('FFE5E5')).toBe(true);
  });
});
