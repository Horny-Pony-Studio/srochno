'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { createInvoice, getPaymentStatus } from '@/lib/api';
import type { CreateInvoiceResponse } from '@/types/api';
import { useAuth } from '@/src/providers/AuthProvider';

export type PaymentState =
  | 'idle'
  | 'creating'
  | 'awaiting_payment'
  | 'paid'
  | 'expired'
  | 'error';

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export function usePayment() {
  const [state, setState] = useState<PaymentState>('idle');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const { refetchUser } = useAuth();

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stopPolling();
    setState('idle');
  }, [stopPolling]);

  const startPolling = useCallback(
    (paymentId: number) => {
      stopPolling();
      startTimeRef.current = Date.now();

      intervalRef.current = setInterval(async () => {
        // Timeout check
        if (Date.now() - startTimeRef.current > MAX_POLL_DURATION_MS) {
          stopPolling();
          setState('expired');
          return;
        }

        try {
          const result = await getPaymentStatus(paymentId);

          if (result.status === 'paid') {
            stopPolling();
            setState('paid');
            // Best-effort balance refresh — payment is already confirmed
            refetchUser().catch(() => {});
          } else if (result.status === 'expired') {
            stopPolling();
            setState('expired');
          }
        } catch {
          // Ignore polling errors, retry next tick
        }
      }, POLL_INTERVAL_MS);
    },
    [stopPolling, refetchUser],
  );

  const startPayment = useCallback(
    async (amount: number): Promise<CreateInvoiceResponse | null> => {
      try {
        setState('creating');
        const invoice = await createInvoice({ amount });
        setState('awaiting_payment');
        startPolling(invoice.payment_id);
        return invoice;
      } catch {
        setState('error');
        return null;
      }
    },
    [startPolling],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  return { state, startPayment, reset };
}
