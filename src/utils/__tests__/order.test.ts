import { describe, it, expect } from 'vitest';
import {
  minutesLeft,
  secondsLeft,
  takenCount,
  isExpired,
  isAutoClosedNoResponse,
  ORDER_LIFETIME_MINUTES,
  NO_RESPONSE_CLOSE_MINUTES,
  MAX_EXECUTORS_PER_ORDER,
} from '../order';
import type { Order } from '@/src/models/Order';

// ─── Helpers ────────────────────────────────────────────

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: '1',
    category: 'Сантехника',
    description: 'Тестовый заказ',
    city: 'Москва',
    contact: '@test',
    createdAt: new Date().toISOString(),
    expiresInMinutes: 60,
    status: 'active',
    takenBy: [],
    cityLocked: false,
    ...overrides,
  };
}

function minutesAgo(mins: number): string {
  return new Date(Date.now() - mins * 60_000).toISOString();
}

// ─── Constants ──────────────────────────────────────────

describe('constants', () => {
  it('ORDER_LIFETIME_MINUTES = 60', () => {
    expect(ORDER_LIFETIME_MINUTES).toBe(60);
  });

  it('NO_RESPONSE_CLOSE_MINUTES = 15', () => {
    expect(NO_RESPONSE_CLOSE_MINUTES).toBe(15);
  });

  it('MAX_EXECUTORS_PER_ORDER = 3', () => {
    expect(MAX_EXECUTORS_PER_ORDER).toBe(3);
  });
});

// ─── minutesLeft ────────────────────────────────────────

describe('minutesLeft', () => {
  it('returns 60 for just-created order', () => {
    const order = makeOrder({ createdAt: new Date().toISOString() });
    expect(minutesLeft(order)).toBe(60);
  });

  it('returns ~30 for order created 30 min ago', () => {
    const order = makeOrder({ createdAt: minutesAgo(30) });
    expect(minutesLeft(order)).toBe(30);
  });

  it('returns 0 for expired order (created 61 min ago)', () => {
    const order = makeOrder({ createdAt: minutesAgo(61) });
    expect(minutesLeft(order)).toBe(0);
  });

  it('returns 0 for exactly expired (60 min ago)', () => {
    const now = Date.now();
    const createdAt = new Date(now - 60 * 60_000).toISOString();
    const order = makeOrder({ createdAt });
    expect(minutesLeft(order, now)).toBe(0);
  });

  it('uses Math.ceil — 59.1 min left rounds to 60', () => {
    const now = Date.now();
    // Created 54 seconds ago → 59 min 6 sec left → ceil = 60
    const createdAt = new Date(now - 54_000).toISOString();
    const order = makeOrder({ createdAt });
    expect(minutesLeft(order, now)).toBe(60);
  });

  it('respects custom expiresInMinutes', () => {
    const now = Date.now();
    const createdAt = new Date(now).toISOString();
    const order = makeOrder({ createdAt, expiresInMinutes: 30 });
    expect(minutesLeft(order, now)).toBe(30);
  });

  it('never returns negative', () => {
    const order = makeOrder({ createdAt: minutesAgo(120) });
    expect(minutesLeft(order)).toBe(0);
  });

  it('accepts nowMs parameter for deterministic tests', () => {
    const now = new Date('2025-01-01T12:00:00Z').getTime();
    const createdAt = '2025-01-01T11:30:00Z';
    const order = makeOrder({ createdAt });
    expect(minutesLeft(order, now)).toBe(30);
  });
});

// ─── secondsLeft ────────────────────────────────────────

describe('secondsLeft', () => {
  it('returns ~3600 for just-created order', () => {
    const now = Date.now();
    const order = makeOrder({ createdAt: new Date(now).toISOString() });
    expect(secondsLeft(order, now)).toBe(3600);
  });

  it('returns 0 for expired order', () => {
    const order = makeOrder({ createdAt: minutesAgo(61) });
    expect(secondsLeft(order)).toBe(0);
  });

  it('returns exact seconds remaining', () => {
    const now = Date.now();
    const createdAt = new Date(now - 3590_000).toISOString(); // 59 min 50 sec ago
    const order = makeOrder({ createdAt });
    expect(secondsLeft(order, now)).toBe(10);
  });

  it('never returns negative', () => {
    const order = makeOrder({ createdAt: minutesAgo(120) });
    expect(secondsLeft(order)).toBe(0);
  });

  it('uses Math.ceil for sub-second precision', () => {
    const now = Date.now();
    // 3599.5 seconds ago → 0.5 sec left → ceil = 1
    const createdAt = new Date(now - 3599_500).toISOString();
    const order = makeOrder({ createdAt });
    expect(secondsLeft(order, now)).toBe(1);
  });
});

// ─── takenCount ─────────────────────────────────────────

describe('takenCount', () => {
  it('returns 0 for order with no executors', () => {
    const order = makeOrder({ takenBy: [] });
    expect(takenCount(order)).toBe(0);
  });

  it('returns 1 for single executor', () => {
    const order = makeOrder({
      takenBy: [{ executorId: 'e1', takenAt: new Date().toISOString() }],
    });
    expect(takenCount(order)).toBe(1);
  });

  it('returns 3 for max executors', () => {
    const now = new Date().toISOString();
    const order = makeOrder({
      takenBy: [
        { executorId: 'e1', takenAt: now },
        { executorId: 'e2', takenAt: now },
        { executorId: 'e3', takenAt: now },
      ],
    });
    expect(takenCount(order)).toBe(3);
  });
});

// ─── isExpired ──────────────────────────────────────────

describe('isExpired', () => {
  it('returns false for active order with time left', () => {
    const order = makeOrder({ createdAt: new Date().toISOString() });
    expect(isExpired(order)).toBe(false);
  });

  it('returns true when time has run out', () => {
    const order = makeOrder({ createdAt: minutesAgo(61) });
    expect(isExpired(order)).toBe(true);
  });

  it('returns true when status is "expired"', () => {
    const order = makeOrder({
      createdAt: new Date().toISOString(),
      status: 'expired',
    });
    expect(isExpired(order)).toBe(true);
  });

  it('returns false for status "completed" with time left', () => {
    const order = makeOrder({
      createdAt: new Date().toISOString(),
      status: 'completed',
    });
    // completed does not mean expired in the function logic
    expect(isExpired(order)).toBe(false);
  });

  it('returns true at exact expiration boundary', () => {
    const now = Date.now();
    const createdAt = new Date(now - 60 * 60_000).toISOString();
    const order = makeOrder({ createdAt });
    expect(isExpired(order, now)).toBe(true);
  });
});

// ─── isAutoClosedNoResponse ─────────────────────────────

describe('isAutoClosedNoResponse', () => {
  it('returns true when status is closed_no_response', () => {
    const order = makeOrder({ status: 'closed_no_response' });
    expect(isAutoClosedNoResponse(order)).toBe(true);
  });

  it('returns false when customer has responded', () => {
    const order = makeOrder({
      customerResponse: { respondedAt: new Date().toISOString() },
      takenBy: [{ executorId: 'e1', takenAt: minutesAgo(20) }],
    });
    expect(isAutoClosedNoResponse(order)).toBe(false);
  });

  it('returns false when no executors have taken the order', () => {
    const order = makeOrder({ takenBy: [] });
    expect(isAutoClosedNoResponse(order)).toBe(false);
  });

  it('returns false when executor took <15 min ago', () => {
    const order = makeOrder({
      takenBy: [{ executorId: 'e1', takenAt: minutesAgo(10) }],
    });
    expect(isAutoClosedNoResponse(order)).toBe(false);
  });

  it('returns true when executor took >=15 min ago without response', () => {
    const order = makeOrder({
      takenBy: [{ executorId: 'e1', takenAt: minutesAgo(16) }],
    });
    expect(isAutoClosedNoResponse(order)).toBe(true);
  });

  it('uses earliest take time when multiple executors', () => {
    const now = Date.now();
    const order = makeOrder({
      takenBy: [
        { executorId: 'e1', takenAt: new Date(now - 20 * 60_000).toISOString() },
        { executorId: 'e2', takenAt: new Date(now - 5 * 60_000).toISOString() },
      ],
    });
    // Earliest was 20 min ago → should be auto-closed
    expect(isAutoClosedNoResponse(order, now)).toBe(true);
  });

  it('returns true at exactly 15 min boundary', () => {
    const now = Date.now();
    const order = makeOrder({
      takenBy: [{ executorId: 'e1', takenAt: new Date(now - 15 * 60_000).toISOString() }],
    });
    expect(isAutoClosedNoResponse(order, now)).toBe(true);
  });
});
