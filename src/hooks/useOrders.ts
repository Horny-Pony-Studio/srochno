import { useRef, useCallback, useEffect } from 'react';
import {
  useQuery,
  useQueries,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  takeOrder,
  closeOrder,
  respondToOrder,
  completeOrder,
  type OrderListParams,
} from '@/lib/api';
import type {
  CreateOrderRequest,
  UpdateOrderRequest,
  ExecutorTakeResponse,
  OrderResponse,
  OrderStatus,
} from '@/types/api';
import { mapOrder, mapOrders } from '@/lib/mappers';
import type { Order } from '@/src/models/Order';
import { useAuth } from '@/src/providers/AuthProvider';

// Backend defaults to status=active when no status filter is provided.
// History pages need all statuses, so we query each explicitly.
const HISTORY_STATUSES: OrderStatus[] = ['active', 'completed', 'expired', 'closed_no_response'];

function deduplicateOrders(orders: Order[]): Order[] {
  const seen = new Set<string>();
  return orders.filter((o) => {
    if (seen.has(o.id)) return false;
    seen.add(o.id);
    return true;
  });
}

// ─── Query keys ─────────────────────────────────────────

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters?: OrderListParams) =>
    [...orderKeys.lists(), filters ?? {}] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  my: () => [...orderKeys.all, 'my'] as const,
};

// ─── Queries ────────────────────────────────────────────

export function useOrders(filters?: OrderListParams) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: async (): Promise<Order[]> => {
      const res = await getOrders(filters);
      return mapOrders(res.orders);
    },
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: orderKeys.detail(id ?? ''),
    queryFn: async (): Promise<Order> => {
      const res = await getOrder(id!);
      return mapOrder(res);
    },
    enabled: !!id,
  });
}

export function useMyOrders() {
  const { user } = useAuth();

  return useQuery({
    queryKey: orderKeys.my(),
    queryFn: async (): Promise<Order[]> => {
      const res = await getOrders({ mine: true });
      return mapOrders(res.orders);
    },
    enabled: !!user,
  });
}

export function useTakenOrders() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...orderKeys.all, 'taken'] as const,
    queryFn: async (): Promise<Order[]> => {
      const res = await getOrders({ taken_by_me: true });
      return mapOrders(res.orders);
    },
    enabled: !!user,
  });
}

// ─── History queries (all statuses) ─────────────────────

export function useMyOrderHistory() {
  const { user } = useAuth();

  const results = useQueries({
    queries: HISTORY_STATUSES.map((status) => ({
      queryKey: [...orderKeys.my(), status] as const,
      queryFn: async (): Promise<Order[]> => {
        const res = await getOrders({ mine: true, status });
        return mapOrders(res.orders);
      },
      enabled: !!user,
    })),
  });

  const isLoading = results.some((r) => r.isPending);
  const isError = !isLoading && results.some((r) => r.isError);
  const data = isLoading
    ? undefined
    : deduplicateOrders(results.flatMap((r) => r.data ?? []));

  const resultsRef = useRef(results);
  useEffect(() => { resultsRef.current = results; });
  const refetch = useCallback(
    async () => { await Promise.all(resultsRef.current.map((r) => r.refetch())); },
    [],
  );

  return { data, isLoading, isError, refetch };
}

export function useTakenOrderHistory() {
  const { user } = useAuth();

  const results = useQueries({
    queries: HISTORY_STATUSES.map((status) => ({
      queryKey: [...orderKeys.all, 'taken', status] as const,
      queryFn: async (): Promise<Order[]> => {
        const res = await getOrders({ taken_by_me: true, status });
        return mapOrders(res.orders);
      },
      enabled: !!user,
    })),
  });

  const isLoading = results.some((r) => r.isPending);
  const isError = !isLoading && results.some((r) => r.isError);
  const data = isLoading
    ? undefined
    : deduplicateOrders(results.flatMap((r) => r.data ?? []));

  const resultsRef = useRef(results);
  useEffect(() => { resultsRef.current = results; });
  const refetch = useCallback(
    async () => { await Promise.all(resultsRef.current.map((r) => r.refetch())); },
    [],
  );

  return { data, isLoading, isError, refetch };
}

// ─── Mutations ──────────────────────────────────────────

export function useCreateOrder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => createOrder(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.lists() });
      qc.invalidateQueries({ queryKey: orderKeys.my() });
    },
  });
}

export function useUpdateOrder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderRequest }) =>
      updateOrder(id, data),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: orderKeys.detail(vars.id) });
      qc.invalidateQueries({ queryKey: orderKeys.lists() });
      qc.invalidateQueries({ queryKey: orderKeys.my() });
    },
  });
}

export function useDeleteOrder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.lists() });
      qc.invalidateQueries({ queryKey: orderKeys.my() });
    },
  });
}

export function useTakeOrder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => takeOrder(id),
    onSuccess: (_res: ExecutorTakeResponse, id: string) => {
      qc.invalidateQueries({ queryKey: orderKeys.detail(id) });
      qc.invalidateQueries({ queryKey: orderKeys.lists() });
      qc.invalidateQueries({ queryKey: [...orderKeys.all, 'taken'] });
    },
  });
}

export function useCloseOrder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => closeOrder(id),
    onSuccess: (_res: void, id: string) => {
      qc.invalidateQueries({ queryKey: orderKeys.detail(id) });
      qc.invalidateQueries({ queryKey: orderKeys.lists() });
      qc.invalidateQueries({ queryKey: orderKeys.my() });
      qc.invalidateQueries({ queryKey: [...orderKeys.all, 'taken'] });
    },
  });
}

export function useRespondToOrder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => respondToOrder(id),
    onSuccess: (_res: OrderResponse, id: string) => {
      qc.invalidateQueries({ queryKey: orderKeys.detail(id) });
      qc.invalidateQueries({ queryKey: orderKeys.lists() });
      qc.invalidateQueries({ queryKey: orderKeys.my() });
      qc.invalidateQueries({ queryKey: [...orderKeys.all, 'taken'] });
    },
  });
}

export function useCompleteOrder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => completeOrder(id),
    onSuccess: (_res: OrderResponse, id: string) => {
      qc.invalidateQueries({ queryKey: orderKeys.detail(id) });
      qc.invalidateQueries({ queryKey: orderKeys.lists() });
      qc.invalidateQueries({ queryKey: orderKeys.my() });
      qc.invalidateQueries({ queryKey: [...orderKeys.all, 'taken'] });
    },
  });
}
