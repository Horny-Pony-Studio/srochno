import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const mockGetCities = vi.fn();

vi.mock('@/lib/api', () => ({
  getCities: (...args: unknown[]) => mockGetCities(...args),
}));

import { useCities } from '../useCities';

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: qc }, children);
  }
  return Wrapper;
}

describe('useCities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches cities list', async () => {
    const cities = ['Москва', 'Санкт-Петербург', 'Казань'];
    mockGetCities.mockResolvedValue(cities);

    const { result } = renderHook(() => useCities(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockGetCities).toHaveBeenCalledOnce();
    expect(result.current.data).toEqual(cities);
  });

  it('returns empty array fallback before data loads', () => {
    mockGetCities.mockReturnValue(new Promise(() => {})); // never resolves

    const { result } = renderHook(() => useCities(), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
  });

  it('handles API error', async () => {
    mockGetCities.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useCities(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
