import { useState, useEffect, useCallback } from 'react';

export function useSubmittedGuard(key: 'review' | 'complaint', orderId: string) {
  const storageKey = `submitted_${key}_${orderId}`;
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    try {
      setIsSubmitted(localStorage.getItem(storageKey) === '1');
    } catch {
      // localStorage unavailable
    }
  }, [storageKey]);

  const markSubmitted = useCallback(() => {
    try {
      localStorage.setItem(storageKey, '1');
    } catch {
      // localStorage unavailable
    }
    setIsSubmitted(true);
  }, [storageKey]);

  return { isSubmitted, markSubmitted };
}
