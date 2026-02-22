"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Block, BlockTitle, Preloader } from "konsta/react";
import { AppNavbar, AppPage, HistoryCard, InfoBlock, OrderCard, PageTransition, PullToRefresh } from "@/src/components";
import type { HistoryCardData } from "@/src/components/HistoryCard";
import { minutesLeft, deriveHistoryStatus } from "@/src/utils/order";
import { useTelegramBackButton } from "@/src/hooks/useTelegram";
import { useMyOrders, useTakenOrders } from "@/hooks/useOrders";
import type { Order } from "@/src/models/Order";

type RoleTab = "my" | "taken";

const ROLE_TABS: { key: RoleTab; label: string }[] = [
  { key: "my", label: "Мои заказы" },
  { key: "taken", label: "Взятые мной" },
];

export default function TakenOrdersPage() {
  const router = useRouter();
  useTelegramBackButton("/profile");
  const [roleTab, setRoleTab] = useState<RoleTab>("my");

  const { data: myOrders, isLoading: myLoading, isError: myError, refetch: myRefetch } = useMyOrders();
  const { data: takenOrders, isLoading: takenLoading, isError: takenError, refetch: takenRefetch } = useTakenOrders();

  const handleRefresh = useCallback(async () => {
    if (roleTab === "my") {
      await myRefetch();
    } else {
      await takenRefetch();
    }
  }, [roleTab, myRefetch, takenRefetch]);

  // — My orders: show active ones as OrderCards —
  const myActiveOrders = useMemo(() => {
    if (!myOrders) return [];
    return myOrders.filter((o) => o.status === 'active' && minutesLeft(o) > 0);
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
          title: o.description.split("\n")[0]?.slice(0, 70) ?? "",
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

  const isLoading = roleTab === "my" ? myLoading : takenLoading;
  const isError = roleTab === "my" ? myError : takenError;
  const refetch = roleTab === "my" ? myRefetch : takenRefetch;

  const takenEmpty = takenActive.length === 0 && takenPast.length === 0;

  return (
    <PageTransition>
      <AppPage className="min-h-screen flex flex-col">
        <AppNavbar title="Заказы в работе" />

        {/* Role tabs */}
        <Block className="my-0 pt-4 pb-0 px-4!">
          <div className="flex gap-2">
            {ROLE_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setRoleTab(t.key)}
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
            ) : roleTab === "my" ? (
              /* ─── My orders (created by user) ─── */
              myActiveOrders.length === 0 ? (
                <InfoBlock
                  className="mx-4"
                  variant="blue"
                  message="Пока нет активных заказов."
                />
              ) : (
                <div className="flex flex-col gap-4">
                  {myActiveOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onClick={() => router.push(`/orders/${order.id}`)}
                    />
                  ))}
                </div>
              )
            ) : (
              /* ─── Taken orders (user is executor) ─── */
              takenEmpty ? (
                <InfoBlock
                  className="mx-4"
                  variant="blue"
                  message="Пока нет взятых заказов."
                />
              ) : (
                <>
                  {takenActive.length > 0 && (
                    <>
                      <BlockTitle className="my-0 mx-4">В работе</BlockTitle>
                      <div className="flex flex-col gap-4">
                        {takenActive.map((order) => (
                          <OrderCard
                            key={order.id}
                            order={order}
                            onClick={() => router.push(`/orders/${order.id}`)}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {takenPast.length > 0 && (
                    <>
                      {takenActive.length > 0 && (
                        <BlockTitle className="my-0 mx-4">Завершённые</BlockTitle>
                      )}
                      <div className="flex flex-col gap-4">
                        {takenPast.map((item) => (
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
              )
            )}
          </Block>
        </PullToRefresh>
      </AppPage>
    </PageTransition>
  );
}
