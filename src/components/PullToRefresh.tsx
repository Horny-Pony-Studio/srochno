'use client';

import React, { useRef } from 'react';
import { Preloader } from 'konsta/react';
import { usePullToRefresh } from '@/src/hooks/usePullToRefresh';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
}

const THRESHOLD = 60;

export default function PullToRefresh({
  onRefresh,
  children,
  className,
}: PullToRefreshProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh,
    containerRef,
  });

  const showIndicator = pullDistance > 0 || isRefreshing;
  const indicatorHeight = isRefreshing ? 48 : pullDistance;
  const isReady = pullDistance >= THRESHOLD;

  return (
    <div ref={containerRef} className={`overflow-auto ${className ?? ''}`}>
      {showIndicator && (
        <div
          className="flex items-center justify-center overflow-hidden transition-opacity duration-200"
          style={{ height: indicatorHeight }}
        >
          {isRefreshing ? (
            <Preloader className="text-primary" />
          ) : (
            <div
              className={`text-sm transition-all duration-150 ${
                isReady ? 'text-primary scale-110' : 'opacity-40'
              }`}
            >
              {isReady ? 'Отпустите для обновления' : 'Потяните для обновления'}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
