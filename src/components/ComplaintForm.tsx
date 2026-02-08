'use client';

import React, { useState } from 'react';
import { List, ListItem, Radio } from 'konsta/react';
import FeedbackFormBase from './FeedbackFormBase';
import {
  COMPLAINT_REASONS,
  executorComplaintSchema,
} from '@/lib/validation/review.schema';
import { useSubmitComplaint } from '@/src/hooks/useReviews';
import { useHaptic } from '@/src/hooks/useTelegram';
import type { ComplaintReason } from '@/types/api';

interface ComplaintFormProps {
  orderId: string;
  onSuccess?: () => void;
}

export default function ComplaintForm({ orderId, onSuccess }: ComplaintFormProps) {
  const [reason, setReason] = useState<string>('');
  const { selection } = useHaptic();
  const submitMut = useSubmitComplaint();

  return (
    <FeedbackFormBase
      type="complaint"
      orderId={orderId}
      title="Пожаловаться на клиента"
      submitLabel="Отправить жалобу"
      successIcon="✅"
      successMessage="Жалоба отправлена. Спасибо за обратную связь."
      errorMessage="Не удалось отправить жалобу. Попробуйте позже."
      commentPlaceholder="Дополнительные детали..."
      isValid={!!reason}
      onSubmit={async (comment) => {
        const result = executorComplaintSchema.safeParse({
          orderId,
          complaint: reason,
          comment: comment || undefined,
        });

        if (!result.success) {
          throw new Error(result.error.issues[0]?.message ?? 'Ошибка валидации');
        }

        await submitMut.mutateAsync({
          order_id: orderId,
          complaint: reason as ComplaintReason,
          comment: result.data.comment ?? null,
        });

        onSuccess?.();
      }}
    >
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
    </FeedbackFormBase>
  );
}
