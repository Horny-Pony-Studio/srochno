'use client';

import React from 'react';
import { Block, Chip } from 'konsta/react';
import StarRating from './StarRating';

function formatDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

type FeedbackDisplayProps =
  | { type: 'review'; rating: number; comment: string | null; createdAt: string }
  | { type: 'complaint'; reason: string; comment: string | null; createdAt: string };

export default function FeedbackDisplay(props: FeedbackDisplayProps) {
  return (
    <Block className="my-0" strong inset>
      {props.type === 'review' ? (
        <>
          <StarRating value={props.rating} readonly size="sm" />
          {props.comment && (
            <p className="mt-2 text-sm whitespace-pre-wrap">{props.comment}</p>
          )}
        </>
      ) : (
        <>
          <Chip className="bg-orange-100 text-orange-600">{props.reason}</Chip>
          {props.comment && (
            <p className="mt-2 text-sm whitespace-pre-wrap">{props.comment}</p>
          )}
        </>
      )}
      <div className="mt-2 text-xs opacity-55">{formatDate(props.createdAt)}</div>
    </Block>
  );
}
