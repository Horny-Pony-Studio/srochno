import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSubmittedGuard } from '../useSubmittedGuard';

beforeEach(() => {
  localStorage.clear();
});

describe('useSubmittedGuard', () => {
  it('returns isSubmitted=false when no localStorage entry', () => {
    const { result } = renderHook(() => useSubmittedGuard('review', 'order-1'));
    expect(result.current.isSubmitted).toBe(false);
  });

  it('markSubmitted sets isSubmitted to true', () => {
    const { result } = renderHook(() => useSubmittedGuard('review', 'order-1'));

    act(() => {
      result.current.markSubmitted();
    });

    expect(result.current.isSubmitted).toBe(true);
  });

  it('markSubmitted persists to localStorage', () => {
    const { result } = renderHook(() => useSubmittedGuard('review', 'order-1'));

    act(() => {
      result.current.markSubmitted();
    });

    expect(localStorage.getItem('submitted_review_order-1')).toBe('1');
  });

  it('reads existing flag from localStorage on mount', () => {
    localStorage.setItem('submitted_review_order-42', '1');
    const { result } = renderHook(() => useSubmittedGuard('review', 'order-42'));
    expect(result.current.isSubmitted).toBe(true);
  });

  it('uses different keys for review vs complaint', () => {
    localStorage.setItem('submitted_review_order-1', '1');

    const { result: reviewResult } = renderHook(() => useSubmittedGuard('review', 'order-1'));
    const { result: complaintResult } = renderHook(() => useSubmittedGuard('complaint', 'order-1'));

    expect(reviewResult.current.isSubmitted).toBe(true);
    expect(complaintResult.current.isSubmitted).toBe(false);
  });

  it('uses different keys for different orderIds', () => {
    localStorage.setItem('submitted_review_order-1', '1');

    const { result: order1 } = renderHook(() => useSubmittedGuard('review', 'order-1'));
    const { result: order2 } = renderHook(() => useSubmittedGuard('review', 'order-2'));

    expect(order1.current.isSubmitted).toBe(true);
    expect(order2.current.isSubmitted).toBe(false);
  });

  it('complaint markSubmitted works independently', () => {
    const { result } = renderHook(() => useSubmittedGuard('complaint', 'order-5'));

    act(() => {
      result.current.markSubmitted();
    });

    expect(result.current.isSubmitted).toBe(true);
    expect(localStorage.getItem('submitted_complaint_order-5')).toBe('1');
    // Review for same order is still unsubmitted
    expect(localStorage.getItem('submitted_review_order-5')).toBeNull();
  });
});
