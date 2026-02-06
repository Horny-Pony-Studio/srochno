'use client';

import { useState, useCallback } from 'react';
import ConfirmDialog, { type ConfirmDialogProps } from '@/components/modals/ConfirmDialog';

type ConfirmOptions = Omit<ConfirmDialogProps, 'opened' | 'onConfirm' | 'onCancel'>;

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({
    title: '',
    message: '',
  });
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    setIsOpen(true);

    return new Promise((resolve) => {
      setResolveRef(() => resolve);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (resolveRef) {
      resolveRef(true);
      setResolveRef(null);
    }
  }, [resolveRef]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    if (resolveRef) {
      resolveRef(false);
      setResolveRef(null);
    }
  }, [resolveRef]);

  const ConfirmDialogComponent = useCallback(
    () => (
      <ConfirmDialog
        opened={isOpen}
        {...options}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    ),
    [isOpen, options, handleConfirm, handleCancel]
  );

  return {
    confirm,
    ConfirmDialog: ConfirmDialogComponent,
  };
}
