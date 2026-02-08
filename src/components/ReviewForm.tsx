'use client';

import React, { useState } from 'react';
import { Block, Button } from 'konsta/react';
import StarRating from './StarRating';
import InfoBlock from './InfoBlock';
import AppListInput from './AppListInput';
import { clientReviewSchema } from '@/lib/validation/review.schema';
import { useSubmitReview } from '@/src/hooks/useReviews';
import { useHaptic } from '@/src/hooks/useTelegram';
import { useSubmittedGuard } from '@/src/hooks/useSubmittedGuard';

interface ReviewFormProps {
  orderId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ orderId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { notification } = useHaptic();
  const submitMut = useSubmitReview();
  const { isSubmitted: submitted, markSubmitted } = useSubmittedGuard('review', orderId);

  const handleSubmit = () => {
    setError(null);

    const result = clientReviewSchema.safeParse({
      orderId,
      rating,
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
        rating: result.data.rating,
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
          setError('Не удалось отправить отзыв. Попробуйте позже.');
        },
      },
    );
  };

  if (submitted) {
    return (
      <InfoBlock
        className="mx-4 scale-in"
        variant="green"
        icon="⭐"
        message="Спасибо за отзыв!"
      />
    );
  }

  return (
    <Block className="my-0 mx-4" strong inset>
      <div className="flex flex-col gap-3">
        <div className="font-medium text-sm">Оставить отзыв</div>

        <div className="flex items-center gap-2">
          <span className="text-sm opacity-55">Оценка:</span>
          <StarRating value={rating} onChange={setRating} />
        </div>

        <AppListInput
          labelText="Комментарий (необязательно)"
          type="textarea"
          placeholder="Расскажите о работе исполнителя..."
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
          disabled={rating === 0 || submitMut.isPending}
          className="w-full"
        >
          {submitMut.isPending ? 'Отправка...' : 'Отправить отзыв'}
        </Button>
      </div>
    </Block>
  );
}
