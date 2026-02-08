'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/src/models/Order';
import { secondsLeft } from '@/src/utils/order';
import { formatTimeLeft } from '@/src/utils/time';

export function useOrderTimer(order: Order | undefined) {
  const [now, setNow] = useState(Date.now());
  const totalSec = order ? secondsLeft(order, now) : 0;
  const mins = Math.floor(totalSec / 60);
  const isUrgent = mins < 10 && totalSec > 0;

  useEffect(() => {
    const ms = isUrgent ? 1000 : 60_000;
    const id = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(id);
  }, [isUrgent]);

  useEffect(() => {
    const handler = () => {
      if (!document.hidden) setNow(Date.now());
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  return {
    totalSeconds: totalSec,
    minutes: mins,
    display: formatTimeLeft(totalSec),
    isUrgent,
    isExpired: totalSec <= 0,
  };
}
