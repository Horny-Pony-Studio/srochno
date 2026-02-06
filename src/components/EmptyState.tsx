'use client';

import { Block, Button } from 'konsta/react';
import { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <Block className={`text-center py-12 ${className}`}>
      {Icon && (
        <div className="flex justify-center mb-4">
          <Icon className="w-16 h-16 text-gray-400" strokeWidth={1.5} />
        </div>
      )}

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="mx-auto"
        >
          {actionLabel}
        </Button>
      )}
    </Block>
  );
}
