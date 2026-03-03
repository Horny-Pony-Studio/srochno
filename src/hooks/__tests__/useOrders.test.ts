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
const mockRespondToOrder = vi.fn();
const mockCompleteOrder = vi.fn();

vi.mock('@/lib/api', () => ({
  getOrders: (...args: unknown[]) => mockGetOrders(...args),
  getOrder: (...args: unknown[]) => mockGetOrder(...args),
  createOrder: (...args: unknown[]) => mockCreateOrder(...args),
  updateOrder: vi.fn(),
  deleteOrder: (...args: unknown[]) => mockDeleteOrder(...args),
  takeOrder: (...args: unknown[]) => mockTakeOrder(...args),
  closeOrder: (...args: unknown[]) => mockCloseOrder(...args),
  respondToOrder: (...args: unknown[]) => mockRespondToOrder(...args),
  completeOrder: (...args: unknown[]) => mockCompleteOrder(...args),
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
  useMyOrderHistory,
  useTakenOrderHistory,
  useCreateOrder,
  useTakeOrder,
  useCloseOrder,
  useRespondToOrder,
  useCompleteOrder,
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
  return { Wrapper, qc };
}

/** Legacy helper for tests that don't need qc access */
function createWrapperOnly() {
  return createWrapper().Wrapper;
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
      wrapper: createWrapperOnly(),
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
      { wrapper: createWrapperOnly() },
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
      wrapper: createWrapperOnly(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGetOrder).toHaveBeenCalledWith('order-1');
    expect(result.current.data).toHaveProperty('mapped', true);
  });

  it('does not fetch when id is undefined', () => {
    const { result } = renderHook(() => useOrder(undefined), {
      wrapper: createWrapperOnly(),
    });

    expect(result.current.isFetching).toBe(false);
    expect(mockGetOrder).not.toHaveBeenCalled();
  });
});

describe('useMyOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches user orders via mine param', async () => {
    const rawOrders = [
      { id: '1', contact: '+380', status: 'active' },
      { id: '2', contact: '', status: 'active' },
      { id: '3', contact: '+380', status: 'deleted' },
    ];
    mockGetOrders.mockResolvedValue({ orders: rawOrders });

    const { result } = renderHook(() => useMyOrders(), {
      wrapper: createWrapperOnly(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // All orders returned by API are mapped (filtering is server-side)
    expect(result.current.data).toHaveLength(3);
    expect(mockGetOrders).toHaveBeenCalledWith({ mine: true });
  });
});

describe('useTakenOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches orders via taken_by_me param (server-side filtering)', async () => {
    const rawOrders = [
      { id: '1', category: 'plumbing' },
      { id: '3', category: 'electric' },
    ];
    mockGetOrders.mockResolvedValue({ orders: rawOrders });

    const { result } = renderHook(() => useTakenOrders(), {
      wrapper: createWrapperOnly(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockGetOrders).toHaveBeenCalledWith({ taken_by_me: true });
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data![0]).toHaveProperty('mapped', true);
  });

  it('returns empty array when API returns no orders', async () => {
    mockGetOrders.mockResolvedValue({ orders: [] });

    const { result } = renderHook(() => useTakenOrders(), {
      wrapper: createWrapperOnly(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(0);
  });
});

// ─── History hooks (all statuses) ────────────────────────

describe('useMyOrderHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches mine=true for each status and merges results', async () => {
    mockGetOrders.mockImplementation((params: Record<string, unknown>) => {
      if (params.status === 'active') return Promise.resolve({ orders: [{ id: '1' }] });
      if (params.status === 'completed') return Promise.resolve({ orders: [{ id: '2' }] });
      if (params.status === 'expired') return Promise.resolve({ orders: [{ id: '3' }] });
      return Promise.resolve({ orders: [] });
    });

    const { result } = renderHook(() => useMyOrderHistory(), {
      wrapper: createWrapperOnly(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockGetOrders).toHaveBeenCalledTimes(4);
    expect(mockGetOrders).toHaveBeenCalledWith({ mine: true, status: 'active' });
    expect(mockGetOrders).toHaveBeenCalledWith({ mine: true, status: 'completed' });
    expect(mockGetOrders).toHaveBeenCalledWith({ mine: true, status: 'expired' });
    expect(mockGetOrders).toHaveBeenCalledWith({ mine: true, status: 'closed_no_response' });

    expect(result.current.data).toHaveLength(3);
  });

  it('deduplicates orders by id', async () => {
    mockGetOrders.mockImplementation((params: Record<string, unknown>) => {
      if (params.status === 'active') return Promise.resolve({ orders: [{ id: 'dup' }] });
      if (params.status === 'completed') return Promise.resolve({ orders: [{ id: 'dup' }] });
      if (params.status === 'expired') return Promise.resolve({ orders: [{ id: 'unique' }] });
      return Promise.resolve({ orders: [] });
    });

    const { result } = renderHook(() => useMyOrderHistory(), {
      wrapper: createWrapperOnly(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toHaveLength(2);
    const ids = result.current.data!.map((o: Record<string, unknown>) => o.id);
    expect(ids).toContain('dup');
    expect(ids).toContain('unique');
  });

  it('returns undefined data while loading', () => {
    mockGetOrders.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useMyOrderHistory(), {
      wrapper: createWrapperOnly(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('sets isError when a query fails', async () => {
    mockGetOrders.mockImplementation((params: Record<string, unknown>) => {
      if (params.status === 'completed') return Promise.reject(new Error('fail'));
      return Promise.resolve({ orders: [] });
    });

    const { result } = renderHook(() => useMyOrderHistory(), {
      wrapper: createWrapperOnly(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isError).toBe(true);
  });

  it('maps orders through mapOrders', async () => {
    mockGetOrders.mockImplementation((params: Record<string, unknown>) => {
      if (params.status === 'active') return Promise.resolve({ orders: [{ id: '1' }] });
      return Promise.resolve({ orders: [] });
    });

    const { result } = renderHook(() => useMyOrderHistory(), {
      wrapper: createWrapperOnly(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data![0]).toHaveProperty('mapped', true);
  });

  it('uses query keys nested under orderKeys.my()', async () => {
    mockGetOrders.mockResolvedValue({ orders: [] });
    const { Wrapper, qc } = createWrapper();

    renderHook(() => useMyOrderHistory(), { wrapper: Wrapper });

    await waitFor(() => {
      const queries = qc.getQueryCache().findAll();
      const keys = queries.map((q) => q.queryKey);
      expect(keys).toContainEqual([...orderKeys.my(), 'active']);
      expect(keys).toContainEqual([...orderKeys.my(), 'completed']);
      expect(keys).toContainEqual([...orderKeys.my(), 'expired']);
      expect(keys).toContainEqual([...orderKeys.my(), 'closed_no_response']);
    });
  });

  it('returns empty array when all queries return no orders', async () => {
    mockGetOrders.mockResolvedValue({ orders: [] });

    const { result } = renderHook(() => useMyOrderHistory(), {
      wrapper: createWrapperOnly(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toHaveLength(0);
  });
});

describe('useTakenOrderHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches taken_by_me=true for each status and merges results', async () => {
    mockGetOrders.mockImplementation((params: Record<string, unknown>) => {
      if (params.status === 'active') return Promise.resolve({ orders: [{ id: 't1' }] });
      if (params.status === 'completed') return Promise.resolve({ orders: [{ id: 't2' }] });
      return Promise.resolve({ orders: [] });
    });

    const { result } = renderHook(() => useTakenOrderHistory(), {
      wrapper: createWrapperOnly(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockGetOrders).toHaveBeenCalledTimes(4);
    expect(mockGetOrders).toHaveBeenCalledWith({ taken_by_me: true, status: 'active' });
    expect(mockGetOrders).toHaveBeenCalledWith({ taken_by_me: true, status: 'completed' });
    expect(mockGetOrders).toHaveBeenCalledWith({ taken_by_me: true, status: 'expired' });
    expect(mockGetOrders).toHaveBeenCalledWith({ taken_by_me: true, status: 'closed_no_response' });

    expect(result.current.data).toHaveLength(2);
  });

  it('deduplicates orders by id', async () => {
    mockGetOrders.mockImplementation((params: Record<string, unknown>) => {
      if (params.status === 'active') return Promise.resolve({ orders: [{ id: 'same' }] });
      if (params.status === 'completed') return Promise.resolve({ orders: [{ id: 'same' }] });
      if (params.status === 'expired') return Promise.resolve({ orders: [{ id: 'diff' }] });
      return Promise.resolve({ orders: [] });
    });

    const { result } = renderHook(() => useTakenOrderHistory(), {
      wrapper: createWrapperOnly(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toHaveLength(2);
  });

  it('uses query keys nested under [orders, taken]', async () => {
    mockGetOrders.mockResolvedValue({ orders: [] });
    const { Wrapper, qc } = createWrapper();

    renderHook(() => useTakenOrderHistory(), { wrapper: Wrapper });

    await waitFor(() => {
      const queries = qc.getQueryCache().findAll();
      const keys = queries.map((q) => q.queryKey);
      expect(keys).toContainEqual([...orderKeys.all, 'taken', 'active']);
      expect(keys).toContainEqual([...orderKeys.all, 'taken', 'completed']);
      expect(keys).toContainEqual([...orderKeys.all, 'taken', 'expired']);
      expect(keys).toContainEqual([...orderKeys.all, 'taken', 'closed_no_response']);
    });
  });

  it('sets isError when a query fails', async () => {
    mockGetOrders.mockImplementation((params: Record<string, unknown>) => {
      if (params.status === 'expired') return Promise.reject(new Error('network'));
      return Promise.resolve({ orders: [] });
    });

    const { result } = renderHook(() => useTakenOrderHistory(), {
      wrapper: createWrapperOnly(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isError).toBe(true);
  });

  it('maps all orders through mapOrders', async () => {
    mockGetOrders.mockImplementation((params: Record<string, unknown>) => {
      if (params.status === 'completed') return Promise.resolve({ orders: [{ id: '1' }] });
      return Promise.resolve({ orders: [] });
    });

    const { result } = renderHook(() => useTakenOrderHistory(), {
      wrapper: createWrapperOnly(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data![0]).toHaveProperty('mapped', true);
  });
});

describe('useCreateOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls createOrder API', async () => {
    mockCreateOrder.mockResolvedValue({ id: 'new-1' });

    const { result } = renderHook(() => useCreateOrder(), {
      wrapper: createWrapperOnly(),
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
      wrapper: createWrapperOnly(),
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
      wrapper: createWrapperOnly(),
    });

    result.current.mutate('order-7');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockCloseOrder).toHaveBeenCalledWith('order-7');
  });

  it('invalidates taken orders cache on success', async () => {
    mockCloseOrder.mockResolvedValue(undefined);
    const { Wrapper, qc } = createWrapper();
    const spy = vi.spyOn(qc, 'invalidateQueries');

    const { result } = renderHook(() => useCloseOrder(), { wrapper: Wrapper });

    result.current.mutate('order-7');
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const calls = spy.mock.calls.map((c) => c[0]);
    expect(calls).toContainEqual({ queryKey: [...orderKeys.all, 'taken'] });
  });
});

describe('useRespondToOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls respondToOrder API with order id', async () => {
    mockRespondToOrder.mockResolvedValue({ id: 'order-8', status: 'active' });

    const { result } = renderHook(() => useRespondToOrder(), {
      wrapper: createWrapperOnly(),
    });

    result.current.mutate('order-8');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockRespondToOrder).toHaveBeenCalledWith('order-8');
  });

  it('invalidates taken orders cache on success', async () => {
    mockRespondToOrder.mockResolvedValue({ id: 'order-8', status: 'active' });
    const { Wrapper, qc } = createWrapper();
    const spy = vi.spyOn(qc, 'invalidateQueries');

    const { result } = renderHook(() => useRespondToOrder(), { wrapper: Wrapper });

    result.current.mutate('order-8');
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const calls = spy.mock.calls.map((c) => c[0]);
    expect(calls).toContainEqual({ queryKey: [...orderKeys.all, 'taken'] });
    expect(calls).toContainEqual({ queryKey: orderKeys.detail('order-8') });
    expect(calls).toContainEqual({ queryKey: orderKeys.my() });
  });
});

describe('useCompleteOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls completeOrder API with order id', async () => {
    mockCompleteOrder.mockResolvedValue({ id: 'order-9', status: 'completed' });

    const { result } = renderHook(() => useCompleteOrder(), {
      wrapper: createWrapperOnly(),
    });

    result.current.mutate('order-9');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockCompleteOrder).toHaveBeenCalledWith('order-9');
  });

  it('invalidates taken orders cache on success', async () => {
    mockCompleteOrder.mockResolvedValue({ id: 'order-9', status: 'completed' });
    const { Wrapper, qc } = createWrapper();
    const spy = vi.spyOn(qc, 'invalidateQueries');

    const { result } = renderHook(() => useCompleteOrder(), { wrapper: Wrapper });

    result.current.mutate('order-9');
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const calls = spy.mock.calls.map((c) => c[0]);
    expect(calls).toContainEqual({ queryKey: [...orderKeys.all, 'taken'] });
    expect(calls).toContainEqual({ queryKey: orderKeys.detail('order-9') });
    expect(calls).toContainEqual({ queryKey: orderKeys.my() });
  });
});
