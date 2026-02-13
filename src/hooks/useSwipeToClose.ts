'use client';

import { useRef, useEffect } from 'react';
import { hapticFeedbackImpactOccurred } from '@telegram-apps/sdk-react';

const CLOSE_THRESHOLD = 80;

interface UseSwipeToCloseOptions {
  onClose: () => void;
  enabled?: boolean;
}

export function useSwipeToClose({ onClose, enabled = true }: UseSwipeToCloseOptions) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const draggingRef = useRef(false);
  const thresholdReachedRef = useRef(false);
  const currentYRef = useRef(0);

  useEffect(() => {
    const el = sheetRef.current;
    if (!el || !enabled) {
      // Reset DOM when disabled
      if (el) {
        el.style.transform = '';
        el.style.transition = '';
      }
      return;
    }

    function canDrag(e: TouchEvent): boolean {
      const touch = e.touches[0];
      const rect = el!.getBoundingClientRect();
      const relativeY = touch.clientY - rect.top;

      // Allow drag from handle bar area (top 40px)
      if (relativeY <= 40) return true;

      // Allow drag when scrollable content is at the top
      const scrollable = el!.querySelector('[data-scroll-container]');
      if (scrollable && scrollable.scrollTop === 0) return true;

      return false;
    }

    function onTouchStart(e: TouchEvent) {
      if (!canDrag(e)) return;
      startYRef.current = e.touches[0].clientY;
      draggingRef.current = true;
      thresholdReachedRef.current = false;
      el!.style.transition = 'none';
    }

    function onTouchMove(e: TouchEvent) {
      if (!draggingRef.current) return;

      const deltaY = e.touches[0].clientY - startYRef.current;
      if (deltaY <= 0) {
        currentYRef.current = 0;
        el!.style.transform = '';
        return;
      }

      e.preventDefault();
      const distance = deltaY * 0.6;
      currentYRef.current = distance;
      el!.style.transform = `translateY(${distance}px)`;

      if (distance >= CLOSE_THRESHOLD && !thresholdReachedRef.current) {
        thresholdReachedRef.current = true;
        try {
          if (hapticFeedbackImpactOccurred.isAvailable()) {
            hapticFeedbackImpactOccurred('light');
          }
        } catch {
          // Not in Telegram environment
        }
      } else if (distance < CLOSE_THRESHOLD) {
        thresholdReachedRef.current = false;
      }
    }

    function onTouchEnd() {
      if (!draggingRef.current) return;
      draggingRef.current = false;

      el!.style.transition = 'transform 0.3s ease-out';

      if (currentYRef.current >= CLOSE_THRESHOLD) {
        onClose();
        setTimeout(() => {
          el!.style.transform = '';
          el!.style.transition = '';
        }, 300);
      } else {
        el!.style.transform = '';
        currentYRef.current = 0;
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
  }, [enabled, onClose]);

  return { sheetRef };
}
