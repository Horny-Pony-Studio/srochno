'use client';

import { Actions, ActionsGroup, ActionsButton, ActionsLabel } from 'konsta/react';
import { useHaptic } from '@/hooks/useTelegram';

export interface ActionSheetAction {
  label: string;
  onClick: () => void;
  color?: 'red' | 'default';
  icon?: React.ReactNode;
}

export interface ActionSheetProps {
  opened: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  actions: ActionSheetAction[];
}

export default function ActionSheet({
  opened,
  onClose,
  title,
  message,
  actions,
}: ActionSheetProps) {
  const { impact } = useHaptic();

  const handleAction = (action: ActionSheetAction) => {
    impact('medium');
    action.onClick();
    onClose();
  };

  const handleClose = () => {
    impact('light');
    onClose();
  };

  return (
    <Actions opened={opened} onBackdropClick={handleClose}>
      <ActionsGroup>
        {(title || message) && (
          <ActionsLabel>
            {title && <div className="font-semibold">{title}</div>}
            {message && <div className="text-sm text-gray-600">{message}</div>}
          </ActionsLabel>
        )}
        {actions.map((action, index) => (
          <ActionsButton
            key={index}
            onClick={() => handleAction(action)}
            colors={{
              textIos: action.color === 'red' ? 'text-red-500' : undefined,
            }}
          >
            <div className="flex items-center gap-3">
              {action.icon}
              <span>{action.label}</span>
            </div>
          </ActionsButton>
        ))}
      </ActionsGroup>
      <ActionsGroup>
        <ActionsButton onClick={handleClose} bold>
          Скасувати
        </ActionsButton>
      </ActionsGroup>
    </Actions>
  );
}
