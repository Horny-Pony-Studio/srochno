'use client';

import { useSyncExternalStore } from 'react';
import { subscribe, getToasts, dismissToast } from '@/lib/toast-store';
import ToastStack from './Toast';

export default function ToastContainer() {
  const toasts = useSyncExternalStore(subscribe, getToasts, () => []);

  return <ToastStack toasts={toasts} onDismiss={dismissToast} />;
}
