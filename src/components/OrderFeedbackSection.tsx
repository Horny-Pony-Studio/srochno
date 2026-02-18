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
const ComplaintForm = dynamic(() => import('./ComplaintForm'), {
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
  // Fallback: backend hasn't been updated yet — show only own form (current behavior)
  if (feedback === undefined) {
    return isExecutor ? (
      <ComplaintForm orderId={orderId} onSuccess={onFeedbackSubmitted} />
    ) : (
      <ReviewForm orderId={orderId} onSuccess={onFeedbackSubmitted} />
    );
  }

  if (isExecutor) {
    return (
      <>
        {/* Own feedback first */}
        <SectionLabel>Ваша жалоба</SectionLabel>
        {feedback.executorComplaint ? (
          <FeedbackDisplay
            type="complaint"
            reason={feedback.executorComplaint.reason}
            comment={feedback.executorComplaint.comment}
            createdAt={feedback.executorComplaint.createdAt}
          />
        ) : (
          <ComplaintForm orderId={orderId} onSuccess={onFeedbackSubmitted} />
        )}

        {/* Other party's feedback */}
        <SectionLabel>Отзыв клиента</SectionLabel>
        {feedback.clientReview ? (
          <FeedbackDisplay
            type="review"
            rating={feedback.clientReview.rating}
            comment={feedback.clientReview.comment}
            createdAt={feedback.clientReview.createdAt}
          />
        ) : (
          <InfoBlock className="mx-4" variant="blue" icon="ℹ️" message="Клиент пока не оставил отзыв" />
        )}
      </>
    );
  }

  // Client POV
  return (
    <>
      {/* Own feedback first */}
      <SectionLabel>Ваш отзыв</SectionLabel>
      {feedback.clientReview ? (
        <FeedbackDisplay
          type="review"
          rating={feedback.clientReview.rating}
          comment={feedback.clientReview.comment}
          createdAt={feedback.clientReview.createdAt}
        />
      ) : (
        <ReviewForm orderId={orderId} onSuccess={onFeedbackSubmitted} />
      )}

      {/* Other party's feedback */}
      <SectionLabel>Отзыв исполнителя</SectionLabel>
      {feedback.executorComplaint ? (
        <FeedbackDisplay
          type="complaint"
          reason={feedback.executorComplaint.reason}
          comment={feedback.executorComplaint.comment}
          createdAt={feedback.executorComplaint.createdAt}
        />
      ) : (
        <InfoBlock className="mx-4" variant="blue" icon="ℹ️" message="Исполнитель пока не оставил отзыв" />
      )}
    </>
  );
}
