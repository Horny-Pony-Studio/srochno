'use client';

import React, { useRef } from 'react';
import { Preloader } from 'konsta/react';
import { ArrowDown, RefreshCw } from 'lucide-react';
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
  const progress = Math.min(pullDistance / THRESHOLD, 1);

  return (
    <div ref={containerRef} className={`overflow-auto ${className ?? ''}`}>
      {showIndicator && (
        <div
          className="flex items-center justify-center overflow-hidden"
          style={{ height: indicatorHeight }}
        >
          {isRefreshing ? (
            <Preloader className="text-primary" />
          ) : (
            <div
              className="transition-transform duration-150"
              style={{
                opacity: 0.4 + progress * 0.6,
                transform: `scale(${0.6 + progress * 0.4}) rotate(${isReady ? 180 : 0}deg)`,
              }}
            >
              {isReady ? (
                <RefreshCw className="w-5 h-5 text-primary" />
              ) : (
                <ArrowDown className="w-5 h-5 text-primary" />
              )}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
