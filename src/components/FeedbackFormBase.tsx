'use client';

import React, { useState } from 'react';
import { Block, Button } from 'konsta/react';
import InfoBlock from './InfoBlock';
import AppListInput from './AppListInput';
import { useSubmittedGuard } from '@/src/hooks/useSubmittedGuard';

interface FeedbackFormBaseProps {
  type: 'review' | 'complaint';
  orderId: string;
  title: string;
  submitLabel: string;
  successIcon: string;
  successMessage: string;
  errorMessage: string;
  commentPlaceholder: string;
  isValid: boolean;
  onSubmit: (comment: string) => Promise<void>;
  children: React.ReactNode;
}

export default function FeedbackFormBase({
  type,
  orderId,
  title,
  submitLabel,
  successIcon,
  successMessage,
  errorMessage,
  commentPlaceholder,
  isValid,
  onSubmit,
  children,
}: FeedbackFormBaseProps) {
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const { isSubmitted, markSubmitted } = useSubmittedGuard(type, orderId);

  const handleSubmit = async () => {
    setError(null);
    setIsPending(true);

    try {
      await onSubmit(comment.trim());
      markSubmitted();
    } catch {
      setError(errorMessage);
    } finally {
      setIsPending(false);
    }
  };

  if (isSubmitted) {
    return (
      <InfoBlock
        className="mx-4 scale-in"
        variant="green"
        icon={successIcon}
        message={successMessage}
      />
    );
  }

  return (
    <Block className="my-0 mx-4" strong inset>
      <div className="flex flex-col gap-3">
        <div className="font-medium text-sm">{title}</div>

        {children}

        <AppListInput
          labelText="Комментарий (необязательно)"
          type="textarea"
          placeholder={commentPlaceholder}
          value={comment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setComment(e.target.value)}
          inputClassName="!h-20 resize-none"
        />

        {error && (
          <div className="text-xs text-red-500">{error}</div>
        )}

        <Button
          rounded
          onClick={handleSubmit}
          disabled={!isValid || isPending}
          className="w-full"
        >
          {isPending ? 'Отправка...' : submitLabel}
        </Button>
      </div>
    </Block>
  );
}
