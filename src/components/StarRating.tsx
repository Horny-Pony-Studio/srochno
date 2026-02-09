'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md';
}

const SIZE_MAP = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
} as const;

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = 'md',
}: StarRatingProps) {
  const sizeClass = SIZE_MAP[size];

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Рейтинг">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            aria-label={`${star} ${star === 1 ? 'звезда' : star < 5 ? 'звезды' : 'звёзд'}`}
            aria-pressed={filled}
            onClick={() => {
              if (readonly || !onChange) return;
              onChange(star);
            }}
            className={`p-0.5 transition-transform duration-150 ${
              readonly ? 'cursor-default' : 'cursor-pointer active:scale-125'
            }`}
          >
            <Star
              className={`${sizeClass} transition-colors duration-150 ${
                filled
                  ? 'text-[#FF9500] fill-[#FF9500]'
                  : 'text-gray-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
