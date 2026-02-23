'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Preloader } from 'konsta/react';
import FeedbackDisplay from './FeedbackDisplay';
import InfoBlock from './InfoBlock';
import type { OrderFeedbackData } from '@/src/models/Order';

const ReviewForm = dynamic(() => import('./ReviewForm'), {
  loading: () => <Preloader className="text-primary" />,
});

interface OrderFeedbackSectionProps {
  orderId: string;
  isExecutor: boolean;
  feedback?: OrderFeedbackData;
  onFeedbackSubmitted: () => void;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-medium opacity-55 mx-4">{children}</div>;
}

export default function OrderFeedbackSection({
  orderId,
  isExecutor,
  feedback,
  onFeedbackSubmitted,
}: OrderFeedbackSectionProps) {
  const review = feedback?.clientReview ?? null;

  // Fallback: backend hasn't been updated yet — show only client form (current behavior)
  if (feedback === undefined) {
    return isExecutor ? null : (
      <ReviewForm orderId={orderId} onSuccess={onFeedbackSubmitted} />
    );
  }

  if (isExecutor) {
    // Executor can only view the client's review (read-only)
    return (
      <>
        <SectionLabel>Отзыв клиента</SectionLabel>
        {review ? (
          <FeedbackDisplay
            rating={review.rating}
            comment={review.comment}
            createdAt={review.createdAt}
          />
        ) : (
          <InfoBlock className="mx-4" variant="blue" icon="ℹ️" message="Клиент пока не оставил отзыв" />
        )}
      </>
    );
  }

  // Client: show form or submitted review
  return (
    <>
      <SectionLabel>Ваш отзыв</SectionLabel>
      {review ? (
        <FeedbackDisplay
          rating={review.rating}
          comment={review.comment}
          createdAt={review.createdAt}
        />
      ) : (
        <ReviewForm orderId={orderId} onSuccess={onFeedbackSubmitted} />
      )}
    </>
  );
}
