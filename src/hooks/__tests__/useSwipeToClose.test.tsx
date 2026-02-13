import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import React from 'react';

// Mock Telegram haptic SDK — use vi.hoisted so refs are available in factory
const { mockImpactAvailable, mockImpact } = vi.hoisted(() => ({
  mockImpactAvailable: vi.fn(() => false),
  mockImpact: vi.fn(),
}));

vi.mock('@telegram-apps/sdk-react', () => ({
  hapticFeedbackImpactOccurred: Object.assign(mockImpact, {
    isAvailable: mockImpactAvailable,
  }),
}));

import { useSwipeToClose } from '../useSwipeToClose';

function touch(clientY: number): Touch {
  return { clientY, clientX: 0 } as Touch;
}

function fireTouchStart(el: HTMLElement, clientY: number) {
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    top: 0, left: 0, right: 100, bottom: 500,
    width: 100, height: 500, x: 0, y: 0,
    toJSON: () => ({}),
  });

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

/**
 * Test wrapper component that renders a div and passes the ref to useSwipeToClose.
 */
function TestSheet({ onClose, enabled = true }: { onClose: () => void; enabled?: boolean }) {
  const { sheetRef } = useSwipeToClose({ onClose, enabled });
  return <div ref={sheetRef} data-testid="sheet" />;
}

function getSheet() {
  return document.querySelector('[data-testid="sheet"]') as HTMLElement;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useSwipeToClose', () => {
  it('applies translateY transform during swipe from handle bar', () => {
    render(<TestSheet onClose={vi.fn()} />);
    const el = getSheet();

    act(() => {
      fireTouchStart(el, 10); // Within handle bar area (top 40px)
      fireTouchMove(el, 110); // deltaY = 100, distance = 100 * 0.6 = 60
    });

    expect(el.style.transform).toBe('translateY(60px)');
  });

  it('calls onClose when swipe exceeds threshold', () => {
    const onClose = vi.fn();
    render(<TestSheet onClose={onClose} />);
    const el = getSheet();

    act(() => {
      fireTouchStart(el, 10);
      fireTouchMove(el, 200); // deltaY = 190, distance = 114 > threshold 80
      fireTouchEnd(el);
    });

    expect(onClose).toHaveBeenCalledOnce();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(el.style.transform).toBe('');
  });

  it('does not call onClose when swipe is below threshold', () => {
    const onClose = vi.fn();
    render(<TestSheet onClose={onClose} />);
    const el = getSheet();

    act(() => {
      fireTouchStart(el, 10);
      fireTouchMove(el, 50); // deltaY = 40, distance = 24 < threshold
      fireTouchEnd(el);
    });

    expect(onClose).not.toHaveBeenCalled();
    expect(el.style.transform).toBe('');
  });

  it('does not start drag when touch is outside handle bar and content is scrolled', () => {
    const onClose = vi.fn();
    render(<TestSheet onClose={onClose} />);
    const el = getSheet();

    // Add a scrollable child with scrollTop > 0
    const scrollable = document.createElement('div');
    scrollable.setAttribute('data-scroll-container', '');
    Object.defineProperty(scrollable, 'scrollTop', { value: 50, writable: true });
    el.appendChild(scrollable);

    act(() => {
      fireTouchStart(el, 100); // y=100 outside handle bar (relativeY > 40)
      fireTouchMove(el, 300);
      fireTouchEnd(el);
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls haptic feedback when crossing threshold', () => {
    mockImpactAvailable.mockReturnValue(true);

    render(<TestSheet onClose={vi.fn()} />);
    const el = getSheet();

    act(() => {
      fireTouchStart(el, 10);
      fireTouchMove(el, 200); // distance = 114 > threshold 80
    });

    expect(mockImpact).toHaveBeenCalledWith('light');
  });

  it('does not move on upward swipe', () => {
    render(<TestSheet onClose={vi.fn()} />);
    const el = getSheet();

    act(() => {
      fireTouchStart(el, 10);
      fireTouchMove(el, 5); // deltaY = -5 (upward)
    });

    expect(el.style.transform).toBe('');
  });

  it('does nothing when not enabled', () => {
    const onClose = vi.fn();
    render(<TestSheet onClose={onClose} enabled={false} />);
    const el = getSheet();

    act(() => {
      fireTouchStart(el, 10);
      fireTouchMove(el, 200);
      fireTouchEnd(el);
    });

    expect(onClose).not.toHaveBeenCalled();
    expect(el.style.transform).toBe('');
  });

  it('allows drag from scroll container at scrollTop 0', () => {
    render(<TestSheet onClose={vi.fn()} />);
    const el = getSheet();

    // Add a scrollable child at scrollTop = 0
    const scrollable = document.createElement('div');
    scrollable.setAttribute('data-scroll-container', '');
    Object.defineProperty(scrollable, 'scrollTop', { value: 0, writable: true });
    el.appendChild(scrollable);

    act(() => {
      fireTouchStart(el, 100); // Outside handle bar but scrollTop=0
      fireTouchMove(el, 250); // deltaY = 150, distance = 90
    });

    expect(el.style.transform).toBe('translateY(90px)');
  });
});
