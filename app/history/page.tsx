"use client";

import React, { useMemo, useState } from "react";
import { Block, Chip, ListItem } from "konsta/react";
import { AppList, AppNavbar, AppPage } from "@/src/components";

type HistoryStatus = "completed" | "cancelled" | "in_progress";

type HistoryItem = {
  id: string;
  title: string;
  category: string;
  city: string;
  createdAt: string; // ISO
  status: HistoryStatus;
  rating?: number; // when completed
};

const MOCK_HISTORY: HistoryItem[] = [
  {
    id: "h1",
    title: "Течет кран на кухне",
    category: "Сантехника",
    city: "Москва",
    createdAt: new Date(Date.now() - 3 * 86400_000).toISOString(),
    status: "completed",
    rating: 5,
  },
  {
    id: "h2",
    title: "Не работает розетка",
    category: "Электрика",
    city: "Москва",
    createdAt: new Date(Date.now() - 7 * 86400_000).toISOString(),
    status: "cancelled",
  },
  {
    id: "h3",
    title: "Собрать шкаф ИКЕА",
    category: "Сборка/установка",
    city: "Санкт-Петербург",
    createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
    status: "in_progress",
  },
];

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
      <Chip className="bg-[#E5F8ED] text-[#34C759]">
        Выполнен{typeof rating === "number" ? ` • ${rating}★` : ""}
      </Chip>
    );
  }
  if (status === "cancelled") {
    return <Chip className="bg-[#FFE5E5] text-[#FF3B30]">Отменён</Chip>;
  }
  return <Chip className="bg-[#FFF5E5] text-[#FF9500]">В работе</Chip>;
}

export default function HistoryPage() {
  const [tab, setTab] = useState<"all" | HistoryStatus>("all");

  const filters: { key: "all" | HistoryStatus; label: string }[] = [
    { key: "all", label: "Все" },
    { key: "in_progress", label: "В работе" },
    { key: "completed", label: "Выполнены" },
    { key: "cancelled", label: "Отменены" },
  ];

  const items = useMemo(() => {
    if (tab === "all") return MOCK_HISTORY;
    return MOCK_HISTORY.filter((i) => i.status === tab);
  }, [tab]);

  return (
    <AppPage className="min-h-dvh bg-[#F2F2F7] flex flex-col">
      <AppNavbar title="История заказов" />

      <Block className="my-3 pl-0! pr-0!">
        <div className="px-4 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 w-max">
            {filters.map((f) => (
              <Chip
                key={f.key}
                component="button"
                onClick={() => setTab(f.key)}
                className={
                  `text-base p-3
                  ${tab === f.key
                    ? "bg-[#007AFF] text-white"
                    : "bg-white text-[#007AFF] border border-[#007AFF]"}
                  `
                }
              >
                {f.label}
              </Chip>
            ))}
          </div>
        </div>
      </Block>

      <Block className="flex-1 pb-20 my-0 pl-0! pr-0!">
        <AppList>
          {items.length === 0 ? (
            <ListItem title="Пока пусто" subtitle="Здесь появятся ваши выполненные и отменённые заявки" />
          ) : (
            items.map((i) => (
              <ListItem
                key={i.id}
                title={i.title}
                subtitle={`${i.category} • ${i.city} • ${formatDate(i.createdAt)}`}
                after={statusChip(i.status, i.rating)}
                link
                onClick={() => {}}
              />
            ))
          )}
        </AppList>
      </Block>
    </AppPage>
  );
}
