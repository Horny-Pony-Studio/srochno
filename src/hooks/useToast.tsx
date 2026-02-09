'use client';

import { useMemo } from 'react';
import { addToast } from '@/lib/toast-store';
import type { ToastType } from '@/components/Toast';

/**
 * Returns stable toast action functions.
 * Does NOT hold any state — toast rendering is handled
 * by ToastContainer in the app layout.
 */
export function useToast() {
  return useMemo(() => ({
    show(opts: { message: string; type?: ToastType; duration?: number }) {
      addToast(opts.message, opts.type ?? 'info', opts.duration ?? 3000);
    },
    success(message: string, duration?: number) {
      addToast(message, 'success', duration ?? 3000);
    },
    error(message: string, duration?: number) {
      addToast(message, 'error', duration ?? 3000);
    },
    warning(message: string, duration?: number) {
      addToast(message, 'warning', duration ?? 3000);
    },
    info(message: string, duration?: number) {
      addToast(message, 'info', duration ?? 3000);
    },
  }), []);
}
