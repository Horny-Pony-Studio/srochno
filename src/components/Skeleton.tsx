'use client';

import { Block } from 'konsta/react';

export interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({
  className = '',
  width,
  height,
  variant = 'text',
}: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={`
        animate-pulse bg-gray-200 dark:bg-gray-700
        ${variantClasses[variant]}
        ${className}
      `}
      style={{ width, height }}
    />
  );
}

export function OrderCardSkeleton() {
  return (
    <Block strong inset className="my-0">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Skeleton width="40%" className="mb-2" />
          <Skeleton width="30%" />
        </div>
        <Skeleton width="80px" height="28px" variant="rectangular" />
      </div>

      <Skeleton className="mb-2" />
      <Skeleton width="80%" className="mb-3" />

      <div className="flex items-center justify-between">
        <Skeleton width="30%" />
      </div>
    </Block>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <OrderCardSkeleton key={index} />
      ))}
    </>
  );
}
