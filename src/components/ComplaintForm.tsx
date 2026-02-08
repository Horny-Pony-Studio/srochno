'use client';

import React, { useState } from 'react';
import { Block, Button, List, ListItem, Radio } from 'konsta/react';
import InfoBlock from './InfoBlock';
import AppListInput from './AppListInput';
import {
  COMPLAINT_REASONS,
  executorComplaintSchema,
} from '@/lib/validation/review.schema';
import { useSubmitComplaint } from '@/src/hooks/useReviews';
import { useHaptic } from '@/src/hooks/useTelegram';
import { useSubmittedGuard } from '@/src/hooks/useSubmittedGuard';
import type { ComplaintReason } from '@/types/api';

interface ComplaintFormProps {
  orderId: string;
  onSuccess?: () => void;
}

export default function ComplaintForm({ orderId, onSuccess }: ComplaintFormProps) {
  const [reason, setReason] = useState<string>('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { notification, selection } = useHaptic();
  const submitMut = useSubmitComplaint();
  const { isSubmitted: submitted, markSubmitted } = useSubmittedGuard('complaint', orderId);

  const handleSubmit = () => {
    setError(null);

    const result = executorComplaintSchema.safeParse({
      orderId,
      complaint: reason,
      comment: comment.trim() || undefined,
    });

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      setError(firstIssue?.message ?? 'Ошибка валидации');
      notification('error');
      return;
    }

    submitMut.mutate(
      {
        order_id: orderId,
        complaint: reason as ComplaintReason,
        comment: result.data.comment ?? null,
      },
      {
        onSuccess: () => {
          notification('success');
          markSubmitted();
          onSuccess?.();
        },
        onError: () => {
          notification('error');
          setError('Не удалось отправить жалобу. Попробуйте позже.');
        },
      },
    );
  };

  if (submitted) {
    return (
      <InfoBlock
        className="mx-4 scale-in"
        variant="green"
        icon="✅"
        message="Жалоба отправлена. Спасибо за обратную связь."
      />
    );
  }

  return (
    <Block className="my-0 mx-4" strong inset>
      <div className="flex flex-col gap-3">
        <div className="font-medium text-sm">Пожаловаться на клиента</div>

        <List className="my-0">
          {COMPLAINT_REASONS.map((r) => (
            <ListItem
              key={r}
              label
              title={r}
              media={
                <Radio
                  checked={reason === r}
                  onChange={() => {
                    selection();
                    setReason(r);
                  }}
                />
              }
            />
          ))}
        </List>

        <AppListInput
          labelText="Комментарий (необязательно)"
          type="textarea"
          placeholder="Дополнительные детали..."
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
          disabled={!reason || submitMut.isPending}
          className="w-full"
        >
          {submitMut.isPending ? 'Отправка...' : 'Отправить жалобу'}
        </Button>
      </div>
    </Block>
  );
}
