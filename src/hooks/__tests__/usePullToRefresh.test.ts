import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock Telegram haptic SDK — use vi.hoisted so refs are available in factory
const {
  mockImpactAvailable,
  mockImpact,
  mockNotifAvailable,
  mockNotif,
} = vi.hoisted(() => ({
  mockImpactAvailable: vi.fn(() => false),
  mockImpact: vi.fn(),
  mockNotifAvailable: vi.fn(() => false),
  mockNotif: vi.fn(),
}));

vi.mock('@telegram-apps/sdk-react', () => ({
  hapticFeedbackImpactOccurred: Object.assign(mockImpact, {
    isAvailable: mockImpactAvailable,
  }),
  hapticFeedbackNotificationOccurred: Object.assign(mockNotif, {
    isAvailable: mockNotifAvailable,
  }),
}));

import { usePullToRefresh } from '../usePullToRefresh';

function createContainer() {
  const el = document.createElement('div');
  Object.defineProperty(el, 'scrollTop', { value: 0, writable: true });
  document.body.appendChild(el);
  return el;
}

function touch(clientY: number): Touch {
  return { clientY } as Touch;
}

function fireTouchStart(el: HTMLElement, clientY: number) {
  el.dispatchEvent(
    new TouchEvent('touchstart', {
      bubbles: true,
      touches: [touch(clientY)],
    }),
  );
}

function fireTouchMove(el: HTMLElement, clientY: number) {
  el.dispatchEvent(
    new TouchEvent('touchmove', {
      bubbles: true,
      cancelable: true,
      touches: [touch(clientY)],
    }),
  );
}

function fireTouchEnd(el: HTMLElement) {
  el.dispatchEvent(new TouchEvent('touchend', { bubbles: true }));
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('usePullToRefresh', () => {
  it('returns initial state', () => {
    const el = createContainer();
    const ref = { current: el };
    const { result } = renderHook(() =>
      usePullToRefresh({ onRefresh: vi.fn(), containerRef: ref }),
    );

    expect(result.current.pullDistance).toBe(0);
    expect(result.current.isRefreshing).toBe(false);
  });

  it('tracks pull distance on touch move', () => {
    const el = createContainer();
    const ref = { current: el };
    const { result } = renderHook(() =>
      usePullToRefresh({ onRefresh: vi.fn(), containerRef: ref }),
    );

    act(() => {
      fireTouchStart(el, 100);
      fireTouchMove(el, 150);
    });

    // Distance = (150 - 100) * 0.5 = 25
    expect(result.current.pullDistance).toBe(25);
  });

  it('triggers refresh when pull exceeds threshold', async () => {
    const el = createContainer();
    const ref = { current: el };
    const onRefresh = vi.fn().mockResolvedValue(undefined);
    renderHook(() => usePullToRefresh({ onRefresh, containerRef: ref }));

    act(() => {
      fireTouchStart(el, 0);
      fireTouchMove(el, 200); // distance = 200 * 0.5 = 100 > threshold 60
    });

    await act(async () => {
      fireTouchEnd(el);
    });

    expect(onRefresh).toHaveBeenCalledOnce();
  });

  it('does not trigger refresh when pull is below threshold', async () => {
    const el = createContainer();
    const ref = { current: el };
    const onRefresh = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      usePullToRefresh({ onRefresh, containerRef: ref }),
    );

    act(() => {
      fireTouchStart(el, 100);
      fireTouchMove(el, 130); // distance = 30 * 0.5 = 15 < threshold
    });

    act(() => {
      fireTouchEnd(el);
    });

    expect(onRefresh).not.toHaveBeenCalled();
    expect(result.current.pullDistance).toBe(0);
  });

  it('ignores pull when disabled', () => {
    const el = createContainer();
    const ref = { current: el };
    const { result } = renderHook(() =>
      usePullToRefresh({ onRefresh: vi.fn(), containerRef: ref, disabled: true }),
    );

    act(() => {
      fireTouchStart(el, 100);
      fireTouchMove(el, 200);
    });

    expect(result.current.pullDistance).toBe(0);
  });

  it('ignores pull when scrollTop > 0', () => {
    const el = createContainer();
    Object.defineProperty(el, 'scrollTop', { value: 50, writable: true });
    const ref = { current: el };
    const { result } = renderHook(() =>
      usePullToRefresh({ onRefresh: vi.fn(), containerRef: ref }),
    );

    act(() => {
      fireTouchStart(el, 100);
      fireTouchMove(el, 200);
    });

    expect(result.current.pullDistance).toBe(0);
  });

  it('calls haptic impact when crossing threshold', () => {
    mockImpactAvailable.mockReturnValue(true);

    const el = createContainer();
    const ref = { current: el };
    renderHook(() =>
      usePullToRefresh({ onRefresh: vi.fn(), containerRef: ref }),
    );

    act(() => {
      fireTouchStart(el, 0);
      fireTouchMove(el, 200); // distance = 100 > threshold
    });

    expect(mockImpact).toHaveBeenCalledWith('light');
  });

  it('calls haptic notification on refresh', async () => {
    mockNotifAvailable.mockReturnValue(true);

    const el = createContainer();
    const ref = { current: el };
    const onRefresh = vi.fn().mockResolvedValue(undefined);
    renderHook(() =>
      usePullToRefresh({ onRefresh, containerRef: ref }),
    );

    act(() => {
      fireTouchStart(el, 0);
      fireTouchMove(el, 200);
    });

    await act(async () => {
      fireTouchEnd(el);
    });

    expect(mockNotif).toHaveBeenCalledWith('success');
  });

  it('caps pull distance at MAX_PULL (100)', () => {
    const el = createContainer();
    const ref = { current: el };
    const { result } = renderHook(() =>
      usePullToRefresh({ onRefresh: vi.fn(), containerRef: ref }),
    );

    act(() => {
      fireTouchStart(el, 0);
      fireTouchMove(el, 500); // 500 * 0.5 = 250, capped at 100
    });

    expect(result.current.pullDistance).toBe(100);
  });
});
