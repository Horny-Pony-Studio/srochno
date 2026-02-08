import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useOrderTimer } from '../useOrderTimer';
import type { Order } from '@/src/models/Order';

function makeOrder(minutesAgo: number): Order {
  return {
    id: '1',
    category: 'Сантехника',
    description: 'Тест',
    city: 'Москва',
    contact: '@test',
    createdAt: new Date(Date.now() - minutesAgo * 60_000).toISOString(),
    expiresInMinutes: 60,
    status: 'active',
    takenBy: [],
    cityLocked: false,
  };
}

afterEach(() => {
  vi.useRealTimers();
});

describe('useOrderTimer', () => {
  it('returns totalSeconds and minutes for fresh order', () => {
    const order = makeOrder(0);
    const { result } = renderHook(() => useOrderTimer(order));

    expect(result.current.totalSeconds).toBeGreaterThanOrEqual(3599);
    expect(result.current.totalSeconds).toBeLessThanOrEqual(3600);
    expect(result.current.minutes).toBeGreaterThanOrEqual(59);
    expect(result.current.minutes).toBeLessThanOrEqual(60);
  });

  it('returns isExpired=false for active order', () => {
    const order = makeOrder(30);
    const { result } = renderHook(() => useOrderTimer(order));
    expect(result.current.isExpired).toBe(false);
  });

  it('returns isExpired=true for expired order', () => {
    const order = makeOrder(61);
    const { result } = renderHook(() => useOrderTimer(order));
    expect(result.current.isExpired).toBe(true);
    expect(result.current.totalSeconds).toBe(0);
  });

  it('returns isUrgent=true when <10 min left', () => {
    const order = makeOrder(52); // 8 min left
    const { result } = renderHook(() => useOrderTimer(order));
    expect(result.current.isUrgent).toBe(true);
  });

  it('returns isUrgent=false when >=10 min left', () => {
    const order = makeOrder(30); // 30 min left
    const { result } = renderHook(() => useOrderTimer(order));
    expect(result.current.isUrgent).toBe(false);
  });

  it('returns isUrgent=false when expired (0 sec)', () => {
    const order = makeOrder(61);
    const { result } = renderHook(() => useOrderTimer(order));
    expect(result.current.isUrgent).toBe(false);
  });

  it('returns formatted display string', () => {
    const order = makeOrder(30); // ~30 min left
    const { result } = renderHook(() => useOrderTimer(order));
    expect(result.current.display).toBe('30 мин');
  });

  it('returns M:SS display when <10 min', () => {
    const order = makeOrder(55); // ~5 min left
    const { result } = renderHook(() => useOrderTimer(order));
    expect(result.current.display).toMatch(/^\d:\d{2}$/);
  });

  it('returns all zeros for undefined order', () => {
    const { result } = renderHook(() => useOrderTimer(undefined));
    expect(result.current.totalSeconds).toBe(0);
    expect(result.current.minutes).toBe(0);
    expect(result.current.isExpired).toBe(true);
    expect(result.current.isUrgent).toBe(false);
    expect(result.current.display).toBe('0:00');
  });
});
