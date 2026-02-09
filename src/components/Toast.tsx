'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useHaptic } from '@/hooks/useTelegram';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

export interface ToastStackProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 shrink-0 text-green-500" />,
  error: <XCircle className="w-5 h-5 shrink-0 text-red-500" />,
  warning: <AlertCircle className="w-5 h-5 shrink-0 text-orange-500" />,
  info: <Info className="w-5 h-5 shrink-0 text-blue-500" />,
};

function SingleToast({
  item,
  depth,
  onDismiss,
}: {
  item: ToastItem;
  depth: number;
  onDismiss: (id: number) => void;
}) {
  const { notification } = useHaptic();
  const hapticFired = useRef(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (hapticFired.current) return;
    hapticFired.current = true;
    if (item.type === 'success') notification('success');
    else if (item.type === 'error') notification('error');
    else if (item.type === 'warning') notification('warning');
  }, [item.type, notification]);

  const handleClose = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => onDismiss(item.id), 250);
  }, [exiting, onDismiss, item.id]);

  // Auto close
  useEffect(() => {
    if (item.duration <= 0) return;
    const timer = setTimeout(handleClose, item.duration);
    return () => clearTimeout(timer);
  }, [item.id, item.duration, handleClose]);

  const scale = Math.max(1 - depth * 0.05, 0.85);
  const offsetY = depth * 10;
  const contentOpacity = depth === 0 ? 1 : Math.max(1 - depth * 0.3, 0.3);

  return (
    <div
      className="toast-item absolute left-4 right-4"
      data-exiting={exiting || undefined}
      style={{
        zIndex: 100 - depth,
        transformOrigin: 'top center',
        top: offsetY,
        scale: String(scale),
        opacity: contentOpacity,
        willChange: 'transform, opacity',
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg backdrop-blur-md
        bg-white/90 dark:bg-neutral-800/90 border border-black/5 dark:border-white/10">
        {icons[item.type]}
        <span className="flex-1 text-sm font-medium">{item.message}</span>
        {depth === 0 && (
          <button
            onClick={handleClose}
            className="shrink-0 p-1 -mr-1 rounded-full"
            style={{ opacity: 0.4 }}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  if (typeof document === 'undefined' || toasts.length === 0) return null;

  const reversed = [...toasts].reverse();
  const visible = reversed.slice(0, 3);

  return createPortal(
    <div
      className="fixed inset-x-0 top-0 z-[9999] pointer-events-none"
      style={{
        paddingTop: 'calc(var(--content-safe-top, 0px) + var(--safe-area-top, 0px) + 8px)',
      }}
    >
      <div className="relative pointer-events-auto mx-auto max-w-sm" style={{ minHeight: 56 }}>
        {visible.map((item, i) => (
          <SingleToast
            key={item.id}
            item={item}
            depth={i}
            onDismiss={onDismiss}
          />
        ))}
      </div>
    </div>,
    document.body,
  );
}
