"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Block, BlockTitle, Preloader } from "konsta/react";
import { AppNavbar, AppPage, HistoryCard, InfoBlock, OrderCard, PageTransition, PullToRefresh } from "@/src/components";
import type { HistoryCardData } from "@/src/components/HistoryCard";
import { minutesLeft, takenCount } from "@/src/utils/order";
import { useTelegramBackButton } from "@/src/hooks/useTelegram";
import { useTakenOrders } from "@/hooks/useOrders";

export default function TakenOrdersPage() {
  const router = useRouter();
  useTelegramBackButton("/profile");

  const { data: orders, isLoading, isError, refetch } = useTakenOrders();

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const { active, past } = useMemo(() => {
    if (!orders) return { active: [], past: [] };
    const a: typeof orders = [];
    const p: HistoryCardData[] = [];
    for (const o of orders) {
      if (minutesLeft(o) > 0 && o.status === 'active') {
        a.push(o);
      } else {
        p.push({
          id: o.id,
          title: o.description.split("\n")[0]?.slice(0, 70) ?? "",
          category: o.category,
          city: o.city,
          createdAt: o.createdAt,
          status: o.status === 'completed' || takenCount(o) > 0 ? 'completed' : 'cancelled',
        });
      }
    }
    p.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    return { active: a, past: p };
  }, [orders]);

  const isEmpty = active.length === 0 && past.length === 0;

  return (
    <PageTransition>
      <AppPage className="min-h-screen flex flex-col">
        <AppNavbar title="Мои заказы" />

        <PullToRefresh onRefresh={handleRefresh} className="flex-1">
          <Block className="flex-1 flex flex-col gap-4 pb-16 my-4 pl-0! pr-0!">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Preloader className="text-primary" />
              </div>
            ) : isError ? (
              <InfoBlock
                className="mx-4"
                variant="red"
                message="Не удалось загрузить заказы. Попробуйте позже."
                icon="⚠️"
                onRetry={() => refetch()}
              />
            ) : isEmpty ? (
              <InfoBlock
                className="mx-4"
                variant="blue"
                message="У вас пока нет взятых заказов"
              />
            ) : (
              <>
                {active.length > 0 && (
                  <>
                    <BlockTitle className="my-0 mx-4">В работе</BlockTitle>
                    <div className="flex flex-col gap-4">
                      {active.map((order, index) => (
                        <div key={order.id} className="stagger-item" style={{ animationDelay: `${index * 0.05}s` }}>
                          <OrderCard
                            order={order}
                            onClick={() => router.push(`/orders/${order.id}`)}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {past.length > 0 && (
                  <>
                    <BlockTitle className="my-0 mx-4">Завершённые</BlockTitle>
                    <div className="flex flex-col gap-4">
                      {past.map((item, index) => (
                        <div key={item.id} className="stagger-item" style={{ animationDelay: `${index * 0.05}s` }}>
                          <HistoryCard
                            item={item}
                            onClick={() => router.push(`/history/${item.id}`)}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </Block>
        </PullToRefresh>
      </AppPage>
    </PageTransition>
  );
}
