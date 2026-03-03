"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Block, BlockTitle, Chip, Preloader } from "konsta/react";
import { AppNavbar, AppPage, InfoBlock, HistoryCard, OrderCard, PageTransition, PullToRefresh } from "@/src/components";
import type { HistoryCardData } from "@/src/components/HistoryCard";
import { minutesLeft, deriveHistoryStatus } from "@/src/utils/order";
import { useRouter } from "next/navigation";
import { useTelegramBackButton } from "@/src/hooks/useTelegram";
import { useMyOrderHistory, useTakenOrderHistory } from "@/hooks/useOrders";
import type { Order } from "@/src/models/Order";

function firstLine(text: string) {
  const line = text.split("\n")[0] ?? "";
  return line.length > 70 ? `${line.slice(0, 70)}…` : line;
}

type RoleTab = "my" | "taken";
type StatusFilter = "all" | "completed" | "cancelled" | "in_progress";

const ROLE_TABS: { key: RoleTab; label: string }[] = [
  { key: "my", label: "Мои заказы" },
  { key: "taken", label: "Выполненные мной" },
];

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "in_progress", label: "В работе" },
  { key: "completed", label: "Выполнены" },
  { key: "cancelled", label: "Отменены" },
];

export default function HistoryPage() {
  const router = useRouter();
  useTelegramBackButton('/profile');
  const [roleTab, setRoleTab] = useState<RoleTab>("my");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const { data: myOrders, isLoading: myLoading, isError: myError, refetch: myRefetch } = useMyOrderHistory();
  const { data: takenOrders, isLoading: takenLoading, isError: takenError, refetch: takenRefetch } = useTakenOrderHistory();

  const handleRefresh = useCallback(async () => {
    if (roleTab === "my") {
      await myRefetch();
    } else {
      await takenRefetch();
    }
  }, [roleTab, myRefetch, takenRefetch]);

  // — My orders: map to history cards —
  const myItems = useMemo<HistoryCardData[]>(() => {
    if (!myOrders) return [];
    return myOrders
      .map((o) => ({
        id: o.id,
        title: firstLine(o.description),
        category: o.category,
        city: o.city,
        createdAt: o.createdAt,
        status: deriveHistoryStatus(o),
        rating: o.rating,
      }))
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }, [myOrders]);

  // — Taken orders: split into active (live) and past (history cards) —
  const { takenActive, takenPast } = useMemo(() => {
    if (!takenOrders) return { takenActive: [] as Order[], takenPast: [] as HistoryCardData[] };
    const active: Order[] = [];
    const past: HistoryCardData[] = [];
    for (const o of takenOrders) {
      if (minutesLeft(o) > 0 && o.status === 'active') {
        active.push(o);
      } else {
        past.push({
          id: o.id,
          title: firstLine(o.description),
          category: o.category,
          city: o.city,
          createdAt: o.createdAt,
          status: deriveHistoryStatus(o),
        });
      }
    }
    past.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    return { takenActive: active, takenPast: past };
  }, [takenOrders]);

  // — Apply status filter —
  const filteredMyItems = useMemo(() => {
    if (statusFilter === "all") return myItems;
    if (statusFilter === "cancelled") {
      return myItems.filter((i) => i.status === "cancelled" || i.status === "closed_no_response");
    }
    return myItems.filter((i) => i.status === statusFilter);
  }, [myItems, statusFilter]);

  const filteredTakenActive = useMemo(() => {
    if (statusFilter === "all" || statusFilter === "in_progress") return takenActive;
    return [];
  }, [takenActive, statusFilter]);

  const filteredTakenPast = useMemo(() => {
    if (statusFilter === "all") return takenPast;
    if (statusFilter === "cancelled") {
      return takenPast.filter((i) => i.status === "cancelled" || i.status === "closed_no_response");
    }
    if (statusFilter === "in_progress") return [];
    return takenPast.filter((i) => i.status === statusFilter);
  }, [takenPast, statusFilter]);

  const isLoading = roleTab === "my" ? myLoading : takenLoading;
  const isError = roleTab === "my" ? myError : takenError;
  const refetch = roleTab === "my" ? myRefetch : takenRefetch;

  const isEmpty = roleTab === "my"
    ? filteredMyItems.length === 0
    : filteredTakenActive.length === 0 && filteredTakenPast.length === 0;

  return (
    <PageTransition>
      <AppPage className="min-h-dvh flex flex-col">
        <AppNavbar title="История заказов" showRight />

        {/* Role tabs — large, full-width for 40+ audience */}
        <Block className="my-0 pt-4 pb-0 px-4!">
          <div className="flex gap-2">
            {ROLE_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => { setRoleTab(t.key); setStatusFilter("all"); }}
                className={
                  `flex-1 py-3 rounded-lg text-base font-medium transition-colors
                  ${roleTab === t.key
                    ? "bg-primary text-white"
                    : "bg-transparent text-primary border-2 border-primary"}`
                }
              >
                {t.label}
              </button>
            ))}
          </div>
        </Block>

        {/* Status filter chips */}
        <Block className="my-4 pl-0! pr-0!">
          <div className="px-4 overflow-x-auto hide-scrollbar scroll-hint-right">
            <div className="flex gap-2 w-max pr-4">
              {STATUS_FILTERS.map((f) => (
                <Chip
                  key={f.key}
                  component="button"
                  onClick={() => setStatusFilter(f.key)}
                  className={
                    `text-base p-3
                    ${statusFilter === f.key
                      ? "bg-primary text-white"
                      : "bg-transparent text-primary border border-primary"}`
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
            ) : isEmpty ? (
              <InfoBlock
                className="mx-4"
                variant="blue"
                icon="📚"
                message={
                  roleTab === "my"
                    ? "Пока нет заказов в истории."
                    : "Пока нет взятых заказов."
                }
              />
            ) : roleTab === "my" ? (
              /* ─── My orders ─── */
              filteredMyItems.map((i) => (
                <HistoryCard key={i.id} item={i} onClick={() => router.push(`/history/${i.id}`)} />
              ))
            ) : (
              /* ─── Taken orders ─── */
              <>
                {filteredTakenActive.length > 0 && (
                  <>
                    <BlockTitle className="my-0 mx-4">В работе</BlockTitle>
                    <div className="flex flex-col gap-4">
                      {filteredTakenActive.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onClick={() => router.push(`/orders/${order.id}`)}
                        />
                      ))}
                    </div>
                  </>
                )}

                {filteredTakenPast.length > 0 && (
                  <>
                    {filteredTakenActive.length > 0 && (
                      <BlockTitle className="my-0 mx-4">Завершённые</BlockTitle>
                    )}
                    <div className="flex flex-col gap-4">
                      {filteredTakenPast.map((item) => (
                        <HistoryCard
                          key={item.id}
                          item={item}
                          onClick={() => router.push(`/history/${item.id}`)}
                        />
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
