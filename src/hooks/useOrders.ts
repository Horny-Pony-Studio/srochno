/**
 * useOrders Hook
 *
 * React hook for fetching and managing list of orders
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getOrders } from '@/src/lib/api';
import { ApiError } from '@/src/lib/api';
import type { Order, ListOrdersParams } from '@/src/types/order';

export interface UseOrdersResult {
  orders: Order[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch list of orders
 *
 * @param params - Query parameters (pagination, filters)
 * @param autoFetch - Whether to fetch automatically on mount (default: true)
 * @returns Orders state and refetch function
 *
 * @example
 * ```tsx
 * function OrdersList() {
 *   const { orders, loading, error, refetch } = useOrders();
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return (
 *     <div>
 *       {orders.map(order => (
 *         <div key={order.id}>{order.amount_minor} {order.currency}</div>
 *       ))}
 *       <button onClick={refetch}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useOrders(
  params?: ListOrdersParams,
  autoFetch: boolean = true
): UseOrdersResult {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getOrders(params);
      setOrders(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.getUserMessage());
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load orders');
      }
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (autoFetch) {
      fetchOrders();
    }
  }, [autoFetch, fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
  };
}
