'use client';

import { useRef, useEffect, useState, useCallback, type RefObject } from 'react';

const THRESHOLD = 60;
const MAX_PULL = 100;

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  containerRef: RefObject<HTMLDivElement | null>;
}

export function usePullToRefresh({ onRefresh, containerRef }: UsePullToRefreshOptions) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef(0);
  const pullingRef = useRef(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
    }
  }, [onRefresh]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function onTouchStart(e: TouchEvent) {
      if (isRefreshing) return;
      if (el!.scrollTop > 0) return;
      startYRef.current = e.touches[0].clientY;
      pullingRef.current = true;
    }

    function onTouchMove(e: TouchEvent) {
      if (!pullingRef.current || isRefreshing) return;

      const deltaY = e.touches[0].clientY - startYRef.current;
      if (deltaY <= 0) {
        setPullDistance(0);
        return;
      }

      // Prevent default scroll while pulling down from top
      if (el!.scrollTop <= 0 && deltaY > 0) {
        e.preventDefault();
      }

      const distance = Math.min(deltaY * 0.5, MAX_PULL);
      setPullDistance(distance);
    }

    function onTouchEnd() {
      if (!pullingRef.current || isRefreshing) return;
      pullingRef.current = false;

      if (pullDistance >= THRESHOLD) {
        handleRefresh();
      } else {
        setPullDistance(0);
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [containerRef, isRefreshing, pullDistance, handleRefresh]);

  return { pullDistance, isRefreshing };
}
