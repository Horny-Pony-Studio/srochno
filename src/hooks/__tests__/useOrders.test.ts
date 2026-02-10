import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock API
const mockGetOrders = vi.fn();
const mockGetOrder = vi.fn();
const mockCreateOrder = vi.fn();
const mockDeleteOrder = vi.fn();
const mockTakeOrder = vi.fn();
const mockCloseOrder = vi.fn();

vi.mock('@/lib/api', () => ({
  getOrders: (...args: unknown[]) => mockGetOrders(...args),
  getOrder: (...args: unknown[]) => mockGetOrder(...args),
  createOrder: (...args: unknown[]) => mockCreateOrder(...args),
  updateOrder: vi.fn(),
  deleteOrder: (...args: unknown[]) => mockDeleteOrder(...args),
  takeOrder: (...args: unknown[]) => mockTakeOrder(...args),
  closeOrder: (...args: unknown[]) => mockCloseOrder(...args),
}));

vi.mock('@/lib/mappers', () => ({
  mapOrder: (raw: Record<string, unknown>) => ({ ...raw, mapped: true }),
  mapOrders: (orders: Record<string, unknown>[]) =>
    orders.map((o) => ({ ...o, mapped: true })),
}));

vi.mock('@/src/providers/AuthProvider', () => ({
  useAuth: () => ({
    user: { id: 'user-1', name: 'Test' },
    refetchUser: vi.fn(),
  }),
}));

import {
  useOrders,
  useOrder,
  useMyOrders,
  useTakenOrders,
  useCreateOrder,
  useTakeOrder,
  useCloseOrder,
  orderKeys,
} from '../useOrders';

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: qc }, children);
  }
  return Wrapper;
}

describe('orderKeys', () => {
  it('generates correct key hierarchy', () => {
    expect(orderKeys.all).toEqual(['orders']);
    expect(orderKeys.lists()).toEqual(['orders', 'list']);
    expect(orderKeys.list({ status: 'active' })).toEqual([
      'orders',
      'list',
      { status: 'active' },
    ]);
    expect(orderKeys.details()).toEqual(['orders', 'detail']);
    expect(orderKeys.detail('abc')).toEqual(['orders', 'detail', 'abc']);
    expect(orderKeys.my()).toEqual(['orders', 'my']);
  });
});

describe('useOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and maps orders', async () => {
    const rawOrders = [
      { id: '1', category: 'plumbing' },
      { id: '2', category: 'electric' },
    ];
    mockGetOrders.mockResolvedValue({ orders: rawOrders });

    const { result } = renderHook(() => useOrders(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockGetOrders).toHaveBeenCalledWith(undefined);
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data![0]).toHaveProperty('mapped', true);
  });

  it('passes filters to API', async () => {
    mockGetOrders.mockResolvedValue({ orders: [] });

    const { result } = renderHook(
      () => useOrders({ status: 'active' as const }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGetOrders).toHaveBeenCalledWith({ status: 'active' });
  });
});

describe('useOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches single order by id', async () => {
    const raw = { id: 'order-1', category: 'cleaning' };
    mockGetOrder.mockResolvedValue(raw);

    const { result } = renderHook(() => useOrder('order-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGetOrder).toHaveBeenCalledWith('order-1');
    expect(result.current.data).toHaveProperty('mapped', true);
  });

  it('does not fetch when id is undefined', () => {
    const { result } = renderHook(() => useOrder(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFetching).toBe(false);
    expect(mockGetOrder).not.toHaveBeenCalled();
  });
});

describe('useMyOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and filters out deleted orders', async () => {
    const rawOrders = [
      { id: '1', contact: '+380', status: 'active' },
      { id: '2', contact: '', status: 'active' },
      { id: '3', contact: '+380', status: 'deleted' },
    ];
    mockGetOrders.mockResolvedValue({ orders: rawOrders });

    const { result } = renderHook(() => useMyOrders(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Only deleted orders are filtered out
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data!.map(o => o.id)).toEqual(['1', '2']);
  });
});

describe('useTakenOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns only orders taken by the current user', async () => {
    const rawOrders = [
      { id: '1', takenBy: [{ executorId: 'user-1', takenAt: '2025-01-01T00:00:00Z' }] },
      { id: '2', takenBy: [{ executorId: 'other-user', takenAt: '2025-01-01T00:00:00Z' }] },
      { id: '3', takenBy: [
        { executorId: 'other-user', takenAt: '2025-01-01T00:00:00Z' },
        { executorId: 'user-1', takenAt: '2025-01-01T00:00:00Z' },
      ] },
    ];
    mockGetOrders.mockResolvedValue({ orders: rawOrders });

    const { result } = renderHook(() => useTakenOrders(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockGetOrders).toHaveBeenCalledWith({ status: 'active' });
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data!.map((o) => o.id)).toEqual(['1', '3']);
  });

  it('returns empty array when no orders are taken by user', async () => {
    const rawOrders = [
      { id: '1', takenBy: [{ executorId: 'other', takenAt: '2025-01-01T00:00:00Z' }] },
    ];
    mockGetOrders.mockResolvedValue({ orders: rawOrders });

    const { result } = renderHook(() => useTakenOrders(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(0);
  });
});

describe('useCreateOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls createOrder API', async () => {
    mockCreateOrder.mockResolvedValue({ id: 'new-1' });

    const { result } = renderHook(() => useCreateOrder(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      category: 'plumbing',
      description: 'Fix pipe',
      city: 'Kyiv',
      contact: '+380',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockCreateOrder).toHaveBeenCalledWith({
      category: 'plumbing',
      description: 'Fix pipe',
      city: 'Kyiv',
      contact: '+380',
    });
  });
});

describe('useTakeOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls takeOrder API with order id', async () => {
    mockTakeOrder.mockResolvedValue({ success: true });

    const { result } = renderHook(() => useTakeOrder(), {
      wrapper: createWrapper(),
    });

    result.current.mutate('order-5');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockTakeOrder).toHaveBeenCalledWith('order-5');
  });
});

describe('useCloseOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls closeOrder API with order id', async () => {
    mockCloseOrder.mockResolvedValue(undefined);

    const { result } = renderHook(() => useCloseOrder(), {
      wrapper: createWrapper(),
    });

    result.current.mutate('order-7');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockCloseOrder).toHaveBeenCalledWith('order-7');
  });
});
