'use client';

import React from 'react';
import { Chip } from 'konsta/react';
import { Order } from '@/src/models/Order';
import { useOrderTimer } from '@/src/hooks/useOrderTimer';
import { getTimeBackground, getTimeColor } from '@/src/utils/time';

type Props = {
  order: Order;
  className?: string;
};

function OrderTimerChip({ order, className }: Props) {
  const timer = useOrderTimer(order);

  return (
    <Chip
      colors={{
        fillBgIos: getTimeBackground(timer.minutes),
        fillTextIos: getTimeColor(timer.minutes),
      }}
      className={`text-sm transition-all duration-200 ${className ?? ''}`}
    >
      ⏱️ {timer.display}
    </Chip>
  );
}

export default OrderTimerChip;
