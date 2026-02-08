'use client';

import React, { useState } from 'react';
import StarRating from './StarRating';
import FeedbackFormBase from './FeedbackFormBase';
import { clientReviewSchema } from '@/lib/validation/review.schema';
import { useSubmitReview } from '@/src/hooks/useReviews';

interface ReviewFormProps {
  orderId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ orderId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const submitMut = useSubmitReview();

  return (
    <FeedbackFormBase
      type="review"
      orderId={orderId}
      title="Оставить отзыв"
      submitLabel="Отправить отзыв"
      successIcon="⭐"
      successMessage="Спасибо за отзыв!"
      errorMessage="Не удалось отправить отзыв. Попробуйте позже."
      commentPlaceholder="Расскажите о работе исполнителя..."
      isValid={rating > 0}
      onSubmit={async (comment) => {
        const result = clientReviewSchema.safeParse({
          orderId,
          rating,
          comment: comment || undefined,
        });

        if (!result.success) {
          throw new Error(result.error.issues[0]?.message ?? 'Ошибка валидации');
        }

        await submitMut.mutateAsync({
          order_id: orderId,
          rating: result.data.rating,
          comment: result.data.comment ?? null,
        });

        onSuccess?.();
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm opacity-55">Оценка:</span>
        <StarRating value={rating} onChange={setRating} />
      </div>
    </FeedbackFormBase>
  );
}
