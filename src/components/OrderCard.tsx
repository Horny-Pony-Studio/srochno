"use client";

import React from "react";
import { Block } from "konsta/react";
import { Order } from "@/src/models/Order";
import { takenCount } from "@/src/utils/order";
import { useHaptic } from "@/hooks/useTelegram";
import OrderTimerChip from "./OrderTimerChip";

type Props = {
  order: Order;
  onClick?: () => void;
  className?: string;
  footerRight?: React.ReactNode;
};

function OrderCard({ order, onClick, className, footerRight }: Props) {
  const takes = takenCount(order);
  const { impact } = useHaptic();

  const handleClick = () => {
    impact('light');
    onClick?.();
  };

  return (
    <Block
      className={`my-0 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${className ?? ""}`}
      strong
      inset
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="text-sm opacity-55 mb-1">{order.category}</div>
          <div className="text-xs opacity-55">{order.city}</div>
        </div>
        <OrderTimerChip order={order} />
      </div>

      <p className="mb-3 line-clamp-2">{order.description}</p>

      <div className="flex items-center justify-between">
        <div className="text-sm opacity-55">
          {takes > 0 ? `${takes}/3 откликов` : "Нет откликов"}
        </div>
        {footerRight}
      </div>
    </Block>
  );
}

export default OrderCard;
