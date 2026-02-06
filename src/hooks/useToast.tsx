'use client';

import { useState, useCallback } from 'react';
import Toast, { type ToastType } from '@/components/Toast';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

export function useToast() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ToastOptions>({
    message: '',
    type: 'info',
    duration: 3000,
  });

  const show = useCallback((opts: ToastOptions) => {
    setOptions({
      duration: 3000,
      type: 'info',
      ...opts,
    });
    setIsOpen(true);
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

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const ToastComponent = useCallback(
    () => (
      <Toast
        opened={isOpen}
        message={options.message}
        type={options.type}
        duration={options.duration}
        onClose={handleClose}
      />
    ),
    [isOpen, options, handleClose]
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
