'use client';

import React from 'react';
import { Block } from 'konsta/react';
import StarRating from './StarRating';

function formatDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

interface FeedbackDisplayProps {
  rating: number;
  comment: string | null;
  createdAt: string;
}

export default function FeedbackDisplay({ rating, comment, createdAt }: FeedbackDisplayProps) {
  return (
    <Block className="my-0" strong inset>
      <StarRating value={rating} readonly size="sm" />
      {comment && (
        <p className="mt-2 text-sm whitespace-pre-wrap">{comment}</p>
      )}
      <div className="mt-2 text-xs opacity-55">{formatDate(createdAt)}</div>
    </Block>
  );
}
