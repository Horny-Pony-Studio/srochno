import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRole } from '../useRole';

beforeEach(() => {
  localStorage.clear();
});

describe('useRole', () => {
  it('returns null role initially', () => {
    const { result } = renderHook(() => useRole());
    expect(result.current.role).toBeNull();
  });

  it('sets isReady to true after mount', async () => {
    const { result } = renderHook(() => useRole());
    // After useEffect runs, isReady should be true
    expect(result.current.isReady).toBe(true);
  });

  it('setRole("executor") persists to localStorage', () => {
    const { result } = renderHook(() => useRole());

    act(() => {
      result.current.setRole('executor');
    });

    expect(result.current.role).toBe('executor');
    expect(localStorage.getItem('user_role')).toBe('executor');
  });

  it('setRole("client") persists to localStorage', () => {
    const { result } = renderHook(() => useRole());

    act(() => {
      result.current.setRole('client');
    });

    expect(result.current.role).toBe('client');
    expect(localStorage.getItem('user_role')).toBe('client');
  });

  it('setRole(null) removes from localStorage', () => {
    localStorage.setItem('user_role', 'executor');
    const { result } = renderHook(() => useRole());

    act(() => {
      result.current.setRole(null);
    });

    expect(result.current.role).toBeNull();
    expect(localStorage.getItem('user_role')).toBeNull();
  });

  it('reads existing role from localStorage on mount', () => {
    localStorage.setItem('user_role', 'client');
    const { result } = renderHook(() => useRole());

    expect(result.current.role).toBe('client');
  });

  it('switching roles updates both state and storage', () => {
    const { result } = renderHook(() => useRole());

    act(() => {
      result.current.setRole('executor');
    });
    expect(result.current.role).toBe('executor');

    act(() => {
      result.current.setRole('client');
    });
    expect(result.current.role).toBe('client');
    expect(localStorage.getItem('user_role')).toBe('client');
  });
});
