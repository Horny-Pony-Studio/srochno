'use client';

import { useSyncExternalStore } from 'react';
import { subscribe, getToasts, dismissToast } from '@/lib/toast-store';
import ToastStack from './Toast';

const EMPTY: never[] = [];
const getServerSnapshot = () => EMPTY;

export default function ToastContainer() {
  const toasts = useSyncExternalStore(subscribe, getToasts, getServerSnapshot);

  return <ToastStack toasts={toasts} onDismiss={dismissToast} />;
}
