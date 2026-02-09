'use client';

import { useEffect, useRef, useCallback } from 'react';
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
  const elRef = useRef<HTMLDivElement>(null);
  const hapticFired = useRef(false);
  const closingRef = useRef(false);

  const scale = Math.max(1 - depth * 0.05, 0.85);
  const offsetY = depth * 10;
  const contentOpacity = Math.max(1 - depth * 0.3, 0.3);

  useEffect(() => {
    if (hapticFired.current) return;
    hapticFired.current = true;
    if (item.type === 'success') notification('success');
    else if (item.type === 'error') notification('error');
    else if (item.type === 'warning') notification('warning');
  }, [item.type, notification]);

  // Slide-in
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = `translateY(${offsetY}px) scale(${scale})`;
    });
    return () => cancelAnimationFrame(raf);
  }, [offsetY, scale]);

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    const el = elRef.current;
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(-2rem) scale(0.95)';
      setTimeout(() => onDismiss(item.id), 300);
    } else {
      onDismiss(item.id);
    }
  }, [onDismiss, item.id]);

  // Auto close
  useEffect(() => {
    if (item.duration <= 0) return;
    const timer = setTimeout(handleClose, item.duration);
    return () => clearTimeout(timer);
  }, [item.id, item.duration, handleClose]);

  return (
    <div
      ref={elRef}
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        top: 0,
        opacity: 0,
        transform: 'translateY(-3rem) scale(0.95)',
        transition: 'transform 300ms cubic-bezier(0.34, 1.3, 0.64, 1), opacity 300ms ease-out',
        zIndex: 100 - depth,
      }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg backdrop-blur-md
          bg-white/90 dark:bg-neutral-800/90 border border-black/5 dark:border-white/10"
        style={{ opacity: contentOpacity }}
      >
        {icons[item.type]}
        <span className="flex-1 text-sm font-medium">{item.message}</span>
        {depth === 0 && (
          <button
            onClick={handleClose}
            className="shrink-0 p-1 -mr-1 rounded-full opacity-40 hover:opacity-100 active:scale-90 transition-all"
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

  // Newest toast first (depth 0 = front)
  const reversed = [...toasts].reverse();

  return createPortal(
    <div
      className="fixed inset-x-0 top-0 z-[9999] pointer-events-none"
      style={{
        paddingTop: 'calc(var(--content-safe-top, 0px) + var(--safe-area-top, 0px) + 8px)',
      }}
    >
      <div className="relative pointer-events-auto mx-auto max-w-sm" style={{ height: 56 }}>
        {reversed.map((item, i) => (
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
