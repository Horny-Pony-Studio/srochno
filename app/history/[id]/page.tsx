"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Block, Button, Chip, ListItem } from "konsta/react";
import { AppList, AppNavbar, AppPage, InfoBlock, PageTransition } from "@/src/components";
import { MOCK_ORDERS } from "@/src/data/mockOrders";
import { minutesLeft, takenCount } from "@/src/utils/order";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
}

export default function HistoryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const id = typeof params?.id === "string" ? params.id : "";

  const order = useMemo(() => {
    if (!id) return undefined;
    return MOCK_ORDERS.find((o) => o.id === id) ?? null;
  }, [id]);

  if (!id || order === undefined) {
    return (
      <AppPage className="min-h-dvh flex flex-col">
        <AppNavbar title="История" />
        <div className="flex-1" />
      </AppPage>
    );
  }

  if (order === null) {
    return (
      <AppPage className="min-h-dvh flex flex-col">
        <AppNavbar title="История" showRight />
        <InfoBlock className="mx-4 mt-4" variant="red" icon="⚠️" message="Запись не найдена" />
        <div className="fixed bottom-0 left-0 right-0 bg-[--k-color-surface-1] border-t border-ios px-4 py-3 safe-area-bottom z-50">
          <Button large rounded onClick={() => router.push("/history")}>
            К истории
          </Button>
        </div>
      </AppPage>
    );
  }

  const left = minutesLeft(order);
  const takes = takenCount(order);
  const expired = left <= 0;
  const status = expired ? (takes > 0 ? "Выполнен" : "Отменён") : "В работе";

  return (
    <PageTransition>
      <AppPage className="min-h-dvh flex flex-col">
        <AppNavbar title="История заказа" showRight />

        <Block className="flex-1 flex flex-col gap-4 pb-20 my-4 pl-0! pr-0!">
          <Block className="my-0 card-appear transition-all duration-200" strong inset>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm opacity-55 mb-1">{order.category} • {order.city}</div>
                <p className="whitespace-pre-wrap">{order.description}</p>
              </div>
              <Chip
                className={
                  expired
                    ? takes > 0
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                    : "bg-orange-100 text-orange-600"
                }
              >
                {status}
              </Chip>
            </div>

            <div className="mt-3 text-xs opacity-55">Создано: {formatDateTime(order.createdAt)}</div>
          </Block>

          <div className="card-appear-delayed">
            <AppList>
              <ListItem label title="Откликов" after={`${takes}/3`} />
              <ListItem label title="Таймер" after={expired ? "Истек" : `${left} мин`} />
            </AppList>
          </div>

          {expired && takes > 0 ? (
            <InfoBlock
              className="mx-4 scale-in"
              variant="blue"
              icon="⭐"
              message="Дальше тут будет отзыв и оценка (пока мок)."
            />
          ) : null}
        </Block>
      </AppPage>
    </PageTransition>
  );
}
