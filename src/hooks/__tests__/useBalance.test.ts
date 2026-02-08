import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const mockRecharge = vi.fn();
const mockRefetchUser = vi.fn();

vi.mock('@/lib/api', () => ({
  rechargeBalance: (...args: unknown[]) => mockRecharge(...args),
}));

vi.mock('@/src/providers/AuthProvider', () => ({
  useAuth: () => ({
    user: { id: 'user-1' },
    refetchUser: mockRefetchUser,
  }),
}));

import { useRechargeBalance } from '../useBalance';

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
}

describe('useRechargeBalance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls rechargeBalance API', async () => {
    mockRecharge.mockResolvedValue({ balance: 500 });

    const { result } = renderHook(() => useRechargeBalance(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ amount: 100, payment_method: 'card' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockRecharge).toHaveBeenCalledWith({
      amount: 100,
      payment_method: 'card',
    });
  });

  it('calls refetchUser on success', async () => {
    mockRecharge.mockResolvedValue({ balance: 500 });

    const { result } = renderHook(() => useRechargeBalance(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ amount: 200, payment_method: 'card' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockRefetchUser).toHaveBeenCalled();
  });

  it('handles API error', async () => {
    mockRecharge.mockRejectedValue(new Error('Payment failed'));

    const { result } = renderHook(() => useRechargeBalance(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ amount: 100, payment_method: 'card' });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
