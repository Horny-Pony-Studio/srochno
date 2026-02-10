'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Block, Button } from 'konsta/react';
import InfoBlock from './InfoBlock';
import AppListInput from './AppListInput';
import { useSubmittedGuard } from '@/src/hooks/useSubmittedGuard';

/** Isolated comment field — own state, doesn't re-render siblings */
function CommentField({ placeholder }: { placeholder: string }) {
  const [value, setValue] = useState('');
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setValue(e.target.value),
    []
  );

  return (
    <AppListInput
      name="feedback-comment"
      labelText="Комментарий (необязательно)"
      type="textarea"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      inputClassName="!h-20 resize-none"
    />
  );
}

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
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const formElRef = useRef<HTMLFormElement>(null);

  const { isSubmitted, markSubmitted } = useSubmittedGuard(type, orderId);

  const handleSubmit = async () => {
    setError(null);
    setIsPending(true);

    try {
      const formData = new FormData(formElRef.current ?? undefined);
      const comment = (formData.get('feedback-comment') as string ?? '').trim();
      await onSubmit(comment);
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
      <form ref={formElRef} onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
        <div className="font-medium text-sm">{title}</div>

        {children}

        <CommentField placeholder={commentPlaceholder} />

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
      </form>
    </Block>
  );
}
