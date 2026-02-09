import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

const mockAddToast = vi.fn();
vi.mock('@/lib/toast-store', () => ({
  addToast: (...args: unknown[]) => mockAddToast(...args),
}));

import { useToast } from '../useToast';

beforeEach(() => {
  mockAddToast.mockClear();
});

describe('useToast', () => {
  it('returns stable reference across renders', () => {
    const { result, rerender } = renderHook(() => useToast());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it('error() calls addToast with type error', () => {
    const { result } = renderHook(() => useToast());
    result.current.error('Something failed');
    expect(mockAddToast).toHaveBeenCalledWith('Something failed', 'error', 3000);
  });

  it('success() calls addToast with type success', () => {
    const { result } = renderHook(() => useToast());
    result.current.success('Done!');
    expect(mockAddToast).toHaveBeenCalledWith('Done!', 'success', 3000);
  });

  it('warning() calls addToast with type warning', () => {
    const { result } = renderHook(() => useToast());
    result.current.warning('Careful');
    expect(mockAddToast).toHaveBeenCalledWith('Careful', 'warning', 3000);
  });

  it('info() calls addToast with type info', () => {
    const { result } = renderHook(() => useToast());
    result.current.info('FYI');
    expect(mockAddToast).toHaveBeenCalledWith('FYI', 'info', 3000);
  });

  it('show() passes custom type and duration', () => {
    const { result } = renderHook(() => useToast());
    result.current.show({ message: 'Custom', type: 'warning', duration: 5000 });
    expect(mockAddToast).toHaveBeenCalledWith('Custom', 'warning', 5000);
  });

  it('respects custom duration', () => {
    const { result } = renderHook(() => useToast());
    result.current.error('Oops', 1000);
    expect(mockAddToast).toHaveBeenCalledWith('Oops', 'error', 1000);
  });

  it('defaults duration to 3000', () => {
    const { result } = renderHook(() => useToast());
    result.current.show({ message: 'Default' });
    expect(mockAddToast).toHaveBeenCalledWith('Default', 'info', 3000);
  });
});
