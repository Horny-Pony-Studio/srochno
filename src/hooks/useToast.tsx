'use client';

import { useState, useCallback, useRef } from 'react';
import ToastStack, { type ToastType, type ToastItem } from '@/components/Toast';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const show = useCallback((opts: ToastOptions) => {
    const id = ++idRef.current;
    const item: ToastItem = {
      id,
      message: opts.message,
      type: opts.type ?? 'info',
      duration: opts.duration ?? 3000,
    };
    setToasts((prev) => [...prev, item]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    show({ message, type: 'success', duration });
  }, [show]);

  const error = useCallback((message: string, duration?: number) => {
    show({ message, type: 'error', duration });
  }, [show]);

  const warning = useCallback((message: string, duration?: number) => {
    show({ message, type: 'warning', duration });
  }, [show]);

  const info = useCallback((message: string, duration?: number) => {
    show({ message, type: 'info', duration });
  }, [show]);

  const ToastComponent = useCallback(
    () => <ToastStack toasts={toasts} onDismiss={dismiss} />,
    [toasts, dismiss],
  );

  return {
    show,
    success,
    error,
    warning,
    info,
    Toast: ToastComponent,
  };
}
