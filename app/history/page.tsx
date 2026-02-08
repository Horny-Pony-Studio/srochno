"use client";

import React, { useMemo, useState } from "react";
import { Block, Chip } from "konsta/react";
import { AppNavbar, AppPage, InfoBlock, HistoryCard, PageTransition } from "@/src/components";
import type { HistoryCardData, HistoryStatus } from "@/src/components/HistoryCard";
import { MOCK_ORDERS } from "@/src/data/mockOrders";
import { minutesLeft, takenCount } from "@/src/utils/order";
import { useRouter } from "next/navigation";
import { useTelegramBackButton } from "@/src/hooks/useTelegram";

function firstLine(text: string) {
  const line = text.split("\n")[0] ?? "";
  return line.length > 70 ? `${line.slice(0, 70)}…` : line;
}

function deriveHistoryStatus(order: (typeof MOCK_ORDERS)[number]): HistoryStatus {
  const left = minutesLeft(order);
  if (left <= 0) {
    return takenCount(order) > 0 ? "completed" : "cancelled";
  }
  return "in_progress";
}

function deriveRating(orderId: string, status: HistoryStatus): number | undefined {
  if (status !== "completed") return undefined;
  const n = Number(orderId) || 1;
  return 3 + (n % 3);
}

export default function HistoryPage() {
  const router = useRouter();
  useTelegramBackButton('/profile');
  const [tab, setTab] = useState<"all" | "completed" | "cancelled" | "in_progress">("all");

  const filters: { key: "all" | "completed" | "cancelled" | "in_progress"; label: string }[] = [
    { key: "all", label: "Все" },
    { key: "in_progress", label: "В работе" },
    { key: "completed", label: "Выполнены" },
    { key: "cancelled", label: "Отменены" },
  ];

  const allItems = useMemo<HistoryCardData[]>(() => {
    return MOCK_ORDERS
      .map((o) => {
        const status = deriveHistoryStatus(o);
        return {
          id: o.id,
          title: firstLine(o.description),
          category: o.category,
          city: o.city,
          createdAt: o.createdAt,
          status,
          rating: deriveRating(o.id, status),
        };
      })
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }, []);

  const items = useMemo(() => {
    if (tab === "all") return allItems;
    return allItems.filter((i) => i.status === tab);
  }, [allItems, tab]);

  return (
    <PageTransition>
      <AppPage className="min-h-dvh flex flex-col">
        <AppNavbar title="История заказов" showRight />

        <Block className="my-3 pl-0! pr-0!">
          <div className="px-4 overflow-x-auto hide-scrollbar scroll-hint-right">
            <div className="flex gap-2 w-max pr-4">
              {filters.map((f) => (
                <Chip
                  key={f.key}
                  component="button"
                  onClick={() => setTab(f.key)}
                  className={
                    `text-base p-3 transition-all duration-200
                    ${tab === f.key
                      ? "bg-primary text-white"
                      : "bg-transparent text-primary border border-primary"}
                    `
                  }
                >
                  {f.label}
                </Chip>
              ))}
            </div>
          </div>
        </Block>

        <Block className="flex-1 pb-20 my-0 pl-0! pr-0! flex flex-col gap-3">
          {items.length === 0 ? (
            <InfoBlock
              className="mx-4 scale-in"
              variant="blue"
              icon="📚"
              message="Пока пусто. Здесь появятся ваши выполненные и отменённые заявки."
            />
          ) : (
            items.map((i, index) => (
              <div key={i.id} className="stagger-item" style={{ animationDelay: `${index * 0.05}s` }}>
                <HistoryCard item={i} onClick={() => router.push(`/history/${i.id}`)} />
              </div>
            ))
          )}
        </Block>
      </AppPage>
    </PageTransition>
  );
}
