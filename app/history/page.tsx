"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Block, Button, Chip, Preloader } from "konsta/react";
import { Star } from "lucide-react";
import { AppNavbar, AppPage, InfoBlock, HistoryCard, PageTransition, PullToRefresh } from "@/src/components";
import type { HistoryCardData, HistoryStatus } from "@/src/components/HistoryCard";
import { minutesLeft, takenCount } from "@/src/utils/order";
import { useRouter } from "next/navigation";
import { useTelegramBackButton } from "@/src/hooks/useTelegram";
import { useMyOrders } from "@/hooks/useOrders";
import type { Order } from "@/src/models/Order";

function firstLine(text: string) {
  const line = text.split("\n")[0] ?? "";
  return line.length > 70 ? `${line.slice(0, 70)}…` : line;
}

function deriveHistoryStatus(order: Order): HistoryStatus {
  if (order.status === 'completed') return 'completed';
  if (order.status === 'closed_no_response') return 'closed_no_response';
  if (order.status === 'deleted') return 'cancelled';
  if (order.status === 'expired') {
    return takenCount(order) > 0 ? 'completed' : 'cancelled';
  }

  const left = minutesLeft(order);
  if (left <= 0) {
    return takenCount(order) > 0 ? "completed" : "cancelled";
  }
  return "in_progress";
}

export default function HistoryPage() {
  const router = useRouter();
  useTelegramBackButton('/profile');
  const [tab, setTab] = useState<"all" | "completed" | "cancelled" | "in_progress">("all");

  const { data: orders, isLoading, isError, refetch } = useMyOrders();

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const filterTabs: { key: "all" | "completed" | "cancelled" | "in_progress"; label: string }[] = [
    { key: "all", label: "Все" },
    { key: "in_progress", label: "В работе" },
    { key: "completed", label: "Выполнены" },
    { key: "cancelled", label: "Отменены" },
  ];

  const allItems = useMemo<HistoryCardData[]>(() => {
    if (!orders) return [];
    return orders
      .map((o) => {
        const status = deriveHistoryStatus(o);
        return {
          id: o.id,
          title: firstLine(o.description),
          category: o.category,
          city: o.city,
          createdAt: o.createdAt,
          status,
          rating: o.rating,
        };
      })
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }, [orders]);

  const items = useMemo(() => {
    if (tab === "all") return allItems;
    if (tab === "cancelled") {
      return allItems.filter((i) => i.status === "cancelled" || i.status === "closed_no_response");
    }
    return allItems.filter((i) => i.status === tab);
  }, [allItems, tab]);

  return (
    <PageTransition>
      <AppPage className="min-h-dvh flex flex-col">
        <AppNavbar title="История заказов" showRight />

        <Block className="my-4 pl-0! pr-0!">
          <div className="px-4 overflow-x-auto hide-scrollbar scroll-hint-right">
            <div className="flex gap-2 w-max pr-4">
              {filterTabs.map((f) => (
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

        <PullToRefresh onRefresh={handleRefresh} className="flex-1">
        <Block className="flex-1 pb-20 my-0 pl-0! pr-0! flex flex-col gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Preloader className="text-primary" />
            </div>
          ) : isError ? (
            <InfoBlock
              className="mx-4"
              variant="red"
              icon="⚠️"
              message="Не удалось загрузить историю. Попробуйте позже."
              onRetry={() => refetch()}
            />
          ) : items.length === 0 ? (
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

          <Block className="my-0 mx-4">
            <Button
              rounded
              outline
              onClick={() => router.push('/reviews')}
              className="w-full justify-center"
            >
              <Star className="w-4 h-4" />
              <span className="text-sm">Все отзывы</span>
            </Button>
          </Block>
        </Block>
        </PullToRefresh>
      </AppPage>
    </PageTransition>
  );
}
