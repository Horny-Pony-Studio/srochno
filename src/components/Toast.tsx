'use client';

import { Toast as KonstaToast } from 'konsta/react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { useHaptic } from '@/hooks/useTelegram';
import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  opened: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertCircle className="w-5 h-5 text-orange-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const colors = {
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  warning: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
};

export default function Toast({
  opened,
  message,
  type = 'info',
  duration = 3000,
  onClose,
}: ToastProps) {
  const { notification } = useHaptic();

  useEffect(() => {
    if (opened) {
      // Haptic feedback based on type
      if (type === 'success') notification('success');
      else if (type === 'error') notification('error');
      else if (type === 'warning') notification('warning');

      // Auto close
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [opened, type, duration, onClose, notification]);

  return (
    <KonstaToast
      opened={opened}
      position="center"
      className={`${colors[type]} border rounded-2xl shadow-lg`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {icons[type]}
        <span className="flex-1 text-sm font-medium">{message}</span>
      </div>
    </KonstaToast>
  );
}
