'use client';

import { Dialog, DialogButton } from 'konsta/react';
import { useHaptic } from '@/hooks/useTelegram';

export interface ConfirmDialogProps {
  opened: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'default' | 'danger' | 'warning';
}

export default function ConfirmDialog({
  opened,
  title,
  message,
  confirmText = 'Підтвердити',
  cancelText = 'Скасувати',
  onConfirm,
  onCancel,
  variant = 'default',
}: ConfirmDialogProps) {
  const { impact, notification } = useHaptic();

  const handleConfirm = () => {
    if (variant === 'danger') {
      notification('warning');
    } else {
      impact('medium');
    }
    onConfirm();
  };

  const handleCancel = () => {
    impact('light');
    onCancel();
  };

  const confirmColor = variant === 'danger' ? 'text-red-500' : variant === 'warning' ? 'text-orange-500' : 'text-blue-500';

  return (
    <Dialog
      opened={opened}
      onBackdropClick={handleCancel}
      title={title}
      content={message}
      buttons={
        <>
          <DialogButton onClick={handleCancel}>{cancelText}</DialogButton>
          <DialogButton
            onClick={handleConfirm}
            strong
            className={confirmColor}
          >
            {confirmText}
          </DialogButton>
        </>
      }
    />
  );
}
