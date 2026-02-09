import type { ToastType, ToastItem } from '@/components/Toast';

let toasts: ToastItem[] = [];
let nextId = 0;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function getToasts() {
  return toasts;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function addToast(message: string, type: ToastType = 'info', duration = 3000) {
  toasts = [...toasts, { id: ++nextId, message, type, duration }];
  emit();
}

export function dismissToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}
