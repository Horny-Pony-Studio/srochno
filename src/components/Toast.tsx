'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useHaptic } from '@/hooks/useTelegram';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  opened: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 shrink-0 text-green-500" />,
  error: <XCircle className="w-5 h-5 shrink-0 text-red-500" />,
  warning: <AlertCircle className="w-5 h-5 shrink-0 text-orange-500" />,
  info: <Info className="w-5 h-5 shrink-0 text-blue-500" />,
};

const bgColors: Record<ToastType, string> = {
  success: 'bg-green-50 dark:bg-green-950/80 border-green-200 dark:border-green-800',
  error: 'bg-red-50 dark:bg-red-950/80 border-red-200 dark:border-red-800',
  warning: 'bg-orange-50 dark:bg-orange-950/80 border-orange-200 dark:border-orange-800',
  info: 'bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800',
};

export default function Toast({
  opened,
  message,
  type = 'info',
  duration = 3000,
  onClose,
}: ToastProps) {
  const { notification } = useHaptic();
  const toastRef = useRef<HTMLDivElement>(null);
  const prevOpened = useRef(false);

  // Haptic feedback on open
  useEffect(() => {
    if (opened && !prevOpened.current) {
      if (type === 'success') notification('success');
      else if (type === 'error') notification('error');
      else if (type === 'warning') notification('warning');
    }
    prevOpened.current = opened;
  }, [opened, type, notification]);

  // Enter animation via DOM
  useEffect(() => {
    if (!opened) return;
    const el = toastRef.current;
    if (!el) return;

    // Force initial state then animate in
    el.style.opacity = '0';
    el.style.transform = 'translateY(-1rem)';

    const raf = requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });

    return () => cancelAnimationFrame(raf);
  }, [opened, message]);

  // Auto close
  useEffect(() => {
    if (opened && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [opened, duration, onClose]);

  const handleClose = useCallback(() => {
    const el = toastRef.current;
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(-1rem)';
      setTimeout(onClose, 300);
    } else {
      onClose();
    }
  }, [onClose]);

  if (typeof document === 'undefined' || !opened) return null;

  return createPortal(
    <div
      className="fixed inset-x-0 top-0 z-[9999] flex justify-center pointer-events-none"
      style={{ paddingTop: 'calc(var(--content-safe-top, 0px) + var(--safe-area-top, 0px) + 8px)' }}
    >
      <div
        ref={toastRef}
        className={`
          pointer-events-auto mx-4 max-w-sm w-full
          flex items-center gap-3 px-4 py-3
          border rounded-2xl shadow-lg backdrop-blur-sm
          ${bgColors[type]}
        `}
        style={{
          transition: 'opacity 300ms ease-out, transform 300ms ease-out',
          opacity: 0,
          transform: 'translateY(-1rem)',
        }}
      >
        {icons[type]}
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button
          onClick={handleClose}
          className="shrink-0 p-0.5 rounded-full opacity-50 hover:opacity-100 active:scale-90 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>,
    document.body,
  );
}
