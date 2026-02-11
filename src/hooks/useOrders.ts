import {
  useQuery,
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
  type OrderListParams,
} from '@/lib/api';
import type {
  CreateOrderRequest,
  UpdateOrderRequest,
  ExecutorTakeResponse,
} from '@/types/api';
import { mapOrder, mapOrders } from '@/lib/mappers';
import type { Order } from '@/src/models/Order';
import { useAuth } from '@/src/providers/AuthProvider';
import { isTakenByUser } from '@/src/utils/order';

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
      const res = await getOrders();
      const all = mapOrders(res.orders);
      if (!user) return all;
      return all.filter((o) => o.status !== 'deleted');
    },
    enabled: !!user,
  });
}

export function useTakenOrders() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...orderKeys.all, 'taken'] as const,
    queryFn: async (): Promise<Order[]> => {
      const res = await getOrders({ status: 'active' });
      const all = mapOrders(res.orders);
      if (!user) return [];
      return all.filter((o) => isTakenByUser(o, user.id));
    },
    enabled: !!user,
  });
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
    },
  });
}
