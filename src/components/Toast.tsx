'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

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

const GAP = 8;

function SingleToast({
  item,
  depth,
  offsetY,
  onDismiss,
  onMeasure,
}: {
  item: ToastItem;
  depth: number;
  offsetY: number;
  onDismiss: (id: number) => void;
  onMeasure: (id: number, height: number) => void;
}) {
  const [exiting, setExiting] = useState(false);

  const measureRef = useCallback((node: HTMLDivElement | null) => {
    if (node) onMeasure(item.id, node.offsetHeight);
  }, [item.id, onMeasure]);

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

  const scale = Math.max(1 - depth * 0.07, 0.8);
  const contentOpacity = depth === 0 ? 1 : Math.max(1 - depth * 0.15, 0.85);

  return (
    <div
      ref={measureRef}
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
      <div className="flex items-center gap-2 px-3 py-3 rounded-2xl shadow-lg backdrop-blur-md
        bg-white/90 dark:bg-neutral-800/90 border border-black/5 dark:border-white/10">
        {icons[item.type]}
        <span className="flex-1 text-sm font-medium">{item.message}</span>
        {depth === 0 && (
          <button
            onClick={handleClose}
            className="rounded-full"
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
  const [heights, setHeights] = useState<Record<number, number>>({});

  const onMeasure = useCallback((id: number, height: number) => {
    setHeights(prev => prev[id] === height ? prev : { ...prev, [id]: height });
  }, []);

  if (typeof document === 'undefined' || toasts.length === 0) return null;

  const reversed = [...toasts].reverse();
  const visible = reversed.slice(0, 3);

  // Calculate cumulative offsets from measured heights
  const offsets: number[] = [];
  let cumulative = 0;
  for (let i = 0; i < visible.length; i++) {
    offsets.push(cumulative);
    if (i < visible.length - 1) {
      const h = heights[visible[i].id] ?? 48;
      cumulative += h + GAP;
    }
  }

  return createPortal(
    <div
      className="fixed inset-x-0 top-0 z-[9999] pointer-events-none"
      style={{
        paddingTop: 'calc(var(--content-safe-top, 0px) + var(--safe-area-top, 0px) + 8px)',
      }}
    >
      <div className="relative pointer-events-auto mx-auto max-w-sm" style={{ minHeight: 48 }}>
        {visible.map((item, i) => (
          <SingleToast
            key={item.id}
            item={item}
            depth={i}
            offsetY={offsets[i]}
            onDismiss={onDismiss}
            onMeasure={onMeasure}
          />
        ))}
      </div>
    </div>,
    document.body,
  );
}
