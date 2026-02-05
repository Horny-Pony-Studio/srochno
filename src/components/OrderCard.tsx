"use client";

import React from "react";
import { Block, Chip } from "konsta/react";
import { Order } from "@/src/models/Order";
import { getTimeBackground, getTimeColor } from "@/src/utils/time";
import { minutesLeft, takenCount } from "@/src/utils/order";

type Props = {
  order: Order;
  onClick?: () => void;
  className?: string;
  footerRight?: React.ReactNode;
};

function OrderCard({ order, onClick, className, footerRight }: Props) {
  const left = minutesLeft(order);
  const takes = takenCount(order);

  return (
    <Block
      className={`my-0 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${className ?? ""}`}
      strong
      inset
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="text-sm text-[#8E8E93] mb-1">{order.category}</div>
          <div className="text-xs text-[#8E8E93]">{order.city}</div>
        </div>
        <Chip
          colors={{
            fillBgIos: getTimeBackground(left),
            fillTextIos: getTimeColor(left),
          }}
          className="text-sm transition-all duration-200"
        >
          ⏱️ {left} мин
        </Chip>
      </div>

      <p className="mb-3 line-clamp-2">{order.description}</p>

      <div className="flex items-center justify-between">
        <div className="text-sm text-[#8E8E93]">
          {takes > 0 ? `${takes}/3 откликов` : "Нет откликов"}
        </div>
        {footerRight}
      </div>
    </Block>
  );
}

export default OrderCard;
