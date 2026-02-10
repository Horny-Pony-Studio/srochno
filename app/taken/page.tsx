"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Block, Preloader } from "konsta/react";
import { AppNavbar, AppPage, InfoBlock, OrderCard, PageTransition, PullToRefresh } from "@/src/components";
import { minutesLeft } from "@/src/utils/order";
import { useTelegramBackButton } from "@/src/hooks/useTelegram";
import { useTakenOrders } from "@/hooks/useOrders";

export default function TakenOrdersPage() {
  const router = useRouter();
  useTelegramBackButton("/profile");

  const { data: orders, isLoading, isError, refetch } = useTakenOrders();

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const activeOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((o) => minutesLeft(o) > 0);
  }, [orders]);

  return (
    <PageTransition>
      <AppPage className="min-h-screen flex flex-col">
        <AppNavbar title="Заказы в работе" />

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
            ) : activeOrders.length === 0 ? (
              <InfoBlock
                className="mx-4"
                variant="blue"
                message="У вас пока нет заказов в работе"
              />
            ) : (
              <div className="flex flex-col gap-4">
                {activeOrders.map((order, index) => (
                  <div key={order.id} className="stagger-item" style={{ animationDelay: `${index * 0.05}s` }}>
                    <OrderCard
                      order={order}
                      onClick={() => router.push(`/orders/${order.id}`)}
                    />
                  </div>
                ))}
              </div>
            )}
          </Block>
        </PullToRefresh>
      </AppPage>
    </PageTransition>
  );
}
