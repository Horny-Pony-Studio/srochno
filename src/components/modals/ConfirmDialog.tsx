'use client';

import { Dialog, DialogButton } from 'konsta/react';
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
  const confirmColor = variant === 'danger' ? 'text-red-500' : variant === 'warning' ? 'text-orange-500' : 'text-blue-500';

  return (
    <Dialog
      opened={opened}
      onBackdropClick={onCancel}
      title={title}
      content={message}
      buttons={
        <>
          <DialogButton onClick={onCancel}>{cancelText}</DialogButton>
          <DialogButton
            onClick={onConfirm}
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
