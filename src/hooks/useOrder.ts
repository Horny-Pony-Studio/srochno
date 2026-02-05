/**
 * useOrder Hook
 *
 * React hook for fetching and managing a single order
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getOrder, claimOrder, cancelOrder } from '@/src/lib/api';
import { ApiError } from '@/src/lib/api';
import type { Order } from '@/src/types/order';

export interface UseOrderResult {
  order: Order | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  claim: () => Promise<void>;
  cancel: () => Promise<void>;
  claiming: boolean;
  canceling: boolean;
}

/**
 * Hook to fetch and manage a single order
 *
 * @param orderId - Order ID
 * @param autoFetch - Whether to fetch automatically on mount (default: true)
 * @returns Order state and action functions
 *
 * @example
 * ```tsx
 * function OrderDetails({ orderId }: { orderId: number }) {
 *   const { order, loading, error, claim, cancel, claiming } = useOrder(orderId);
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   if (!order) return <div>Order not found</div>;
 *
 *   return (
 *     <div>
 *       <h2>Order #{order.id}</h2>
 *       <p>Amount: {order.amount_minor} {order.currency}</p>
 *       <p>Status: {order.status}</p>
 *       {order.status === 'AVAILABLE' && (
 *         <button onClick={claim} disabled={claiming}>
 *           {claiming ? 'Claiming...' : 'Claim Order'}
 *         </button>
 *       )}
 *       <button onClick={cancel}>Cancel</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useOrder(
  orderId: number,
  autoFetch: boolean = true
): UseOrderResult {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState<boolean>(false);
  const [canceling, setCanceling] = useState<boolean>(false);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getOrder(orderId);
      setOrder(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.getUserMessage());
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load order');
      }
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const handleClaim = useCallback(async () => {
    if (!orderId || claiming) return;

    setClaiming(true);
    setError(null);

    try {
      const updatedOrder = await claimOrder(orderId);
      setOrder(updatedOrder);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.getUserMessage());
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to claim order');
      }
    } finally {
      setClaiming(false);
    }
  }, [orderId, claiming]);

  const handleCancel = useCallback(async () => {
    if (!orderId || canceling) return;

    setCanceling(true);
    setError(null);

    try {
      const updatedOrder = await cancelOrder(orderId);
      setOrder(updatedOrder);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.getUserMessage());
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to cancel order');
      }
    } finally {
      setCanceling(false);
    }
  }, [orderId, canceling]);

  useEffect(() => {
    if (autoFetch) {
      fetchOrder();
    }
  }, [autoFetch, fetchOrder]);

  return {
    order,
    loading,
    error,
    refetch: fetchOrder,
    claim: handleClaim,
    cancel: handleCancel,
    claiming,
    canceling,
  };
}
