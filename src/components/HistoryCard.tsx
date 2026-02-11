"use client";

import React from "react";
import { Block, Chip } from "konsta/react";

export type HistoryStatus = "completed" | "cancelled" | "closed_no_response" | "in_progress";

export type HistoryCardData = {
  id: string;
  title: string;
  category: string;
  city: string;
  createdAt: string; // ISO
  status: HistoryStatus;
  rating?: number;
};

type Props = {
  item: HistoryCardData;
  onClick?: () => void;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function statusChip(status: HistoryStatus, rating?: number) {
  if (status === "completed") {
    return (
      <Chip
        colors={{
          fillBgIos: 'rgb(var(--k-color-green-light))',
          fillTextIos: 'rgb(var(--k-color-green))',
        }}
      >
        Выполнен{typeof rating === "number" ? ` • ${rating}★` : ""}
      </Chip>
    );
  }
  if (status === "closed_no_response") {
    return (
      <Chip
        colors={{
          fillBgIos: 'rgb(var(--k-color-red-light))',
          fillTextIos: 'rgb(var(--k-color-red))',
        }}
      >
        Нет ответа
      </Chip>
    );
  }
  if (status === "cancelled") {
    return (
      <Chip
        colors={{
          fillBgIos: 'rgb(var(--k-color-red-light))',
          fillTextIos: 'rgb(var(--k-color-red))',
        }}
      >
        Отменён
      </Chip>
    );
  }
  return (
    <Chip
      colors={{
        fillBgIos: 'rgb(var(--k-color-yellow-light))',
        fillTextIos: 'rgb(var(--k-color-yellow))',
      }}
    >
      В работе
    </Chip>
  );
}

function HistoryCard({ item, onClick }: Props) {
  return (
    <Block
      className="my-0 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
      strong
      inset
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <div className="text-sm opacity-55 mb-1">
            {item.category} • {item.city}
          </div>
          <div className="font-medium leading-snug line-clamp-2">{item.title}</div>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-2">
          {statusChip(item.status, item.rating)}
          <div className="text-xs opacity-55">{formatDate(item.createdAt)}</div>
        </div>
      </div>
    </Block>
  );
}

export default React.memo(HistoryCard);

