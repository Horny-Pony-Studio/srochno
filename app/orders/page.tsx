"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Block, BlockTitle, Chip, Preloader } from "konsta/react";
import { AppNavbar, AppPage, HistoryCard, InfoBlock, OrderCard, PageTransition, PullToRefresh, SearchableSelect } from "@/src/components";
import type { HistoryCardData } from "@/src/components/HistoryCard";
import { CATEGORIES } from "@/src/data";
import { useCities } from "@/hooks/useCities";
import { isTakenByUser, minutesLeft, takenCount } from "@/src/utils/order";
import { useTelegramBackButton } from "@/src/hooks/useTelegram";
import { useOrders, useTakenOrders } from "@/hooks/useOrders";
import { useAuth } from "@/providers/AuthProvider";
import type { Order } from "@/src/models/Order";

const takeButtonElement = (
  <div className="bg-primary text-white px-4 py-2 rounded-lg text-sm">
    Взять (2 ₽)
  </div>
);

type RoleTab = "available" | "taken";

const ROLE_TABS: { key: RoleTab; label: string }[] = [
  { key: "available", label: "Доступные" },
  { key: "taken", label: "Взятые мной" },
];

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  useTelegramBackButton('/');
  const [roleTab, setRoleTab] = useState<RoleTab>("available");
  const [selectedCategory, setSelectedCategory] = useState<string>("Все");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const { data: cities = [], isLoading: isCitiesLoading } = useCities();

  const allCategories = useMemo(() => ["Все", ...CATEGORIES], []);

  const filters = useMemo(() => {
    const f: { category?: string; city?: string; status?: 'active' } = { status: 'active' };
    if (selectedCategory !== "Все") f.category = selectedCategory;
    if (selectedCity) f.city = selectedCity;
    return f;
  }, [selectedCategory, selectedCity]);

  const { data: orders, isLoading: ordersLoading, isError: ordersError, refetch: ordersRefetch } = useOrders(filters);
  const { data: takenOrders, isLoading: takenLoading, isError: takenError, refetch: takenRefetch } = useTakenOrders();

  const handleRefresh = useCallback(async () => {
    if (roleTab === "available") {
      await ordersRefetch();
    } else {
      await takenRefetch();
    }
  }, [roleTab, ordersRefetch, takenRefetch]);

  // — Available orders: filter out expired and already taken by user —
  const activeOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((o) => {
      if (minutesLeft(o) <= 0) return false;
      if (user && isTakenByUser(o, user.id)) return false;
      return true;
    });
  }, [orders, user]);

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
          status: o.status === 'completed' || takenCount(o) > 0 ? 'completed' : 'cancelled',
        });
      }
    }
    past.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    return { takenActive: active, takenPast: past };
  }, [takenOrders]);

  const isLoading = roleTab === "available" ? ordersLoading : takenLoading;
  const isError = roleTab === "available" ? ordersError : takenError;
  const refetch = roleTab === "available" ? ordersRefetch : takenRefetch;

  const takenEmpty = (takenActive?.length ?? 0) === 0 && takenPast.length === 0;

  return (
    <PageTransition>
      <AppPage className={"min-h-screen flex flex-col"}>
        <AppNavbar title="Заказы" showRight />

        {/* Role tabs — large, full-width for 40+ audience */}
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

            {roleTab === "available" && (
              <>
                {/* Category chips — horizontal scroll */}
                <div className="overflow-x-auto hide-scrollbar px-4">
                  <div className="flex gap-2">
                    {allCategories.map((cat) => {
                      const isActive = selectedCategory === cat;
                      return (
                        <Chip
                          key={cat}
                          outline={!isActive}
                          onClick={() => setSelectedCategory(cat)}
                          className={`shrink-0 ${
                            isActive ? 'bg-primary text-white' : ''
                          }`}
                          colors={isActive ? {
                            fillBgIos: 'bg-primary',
                            fillTextIos: 'text-white',
                          } : undefined}
                        >
                          {cat}
                        </Chip>
                      );
                    })}
                  </div>
                </div>

                {/* City filter */}
                <div className="px-4">
                  <SearchableSelect
                    value={selectedCity}
                    onSelect={setSelectedCity}
                    options={cities}
                    placeholder="Все города"
                    label="Выберите город"
                    isLoading={isCitiesLoading}
                    clearLabel="Все города"
                    className="w-full justify-between py-2.5 px-3 rounded-xl bg-black/5 dark:bg-white/10 opacity-100!"
                  />
                </div>
              </>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Preloader className="text-primary" />
              </div>
            ) : isError ? (
              <InfoBlock
                className={"mx-4"}
                variant={"red"}
                message={"Не удалось загрузить заказы. Попробуйте позже."}
                icon={"⚠️"}
                onRetry={() => refetch()}
              />
            ) : roleTab === "available" ? (
              /* ─── Available orders ─── */
              activeOrders.length === 0 ? (
                <InfoBlock
                  className={"mx-4"}
                  variant={"blue"}
                  message={"Нет заказов в этой категории или городе"}
                />
              ) : (
                <div className="flex flex-col gap-4">
                  {activeOrders.map((order) => {
                    const takes = takenCount(order);
                    const left = minutesLeft(order);
                    const canShowTake = takes < 3 && left > 0;

                    return (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onClick={() => router.push(`/orders/${order.id}`)}
                        footerRight={canShowTake ? takeButtonElement : undefined}
                      />
                    );
                  })}
                </div>
              )
            ) : (
              /* ─── Taken orders ─── */
              takenEmpty ? (
                <InfoBlock
                  className="mx-4"
                  variant="blue"
                  message="У вас пока нет взятых заказов"
                />
              ) : (
                <>
                  {(takenActive?.length ?? 0) > 0 && (
                    <>
                      <BlockTitle className="my-0 mx-4">В работе</BlockTitle>
                      <div className="flex flex-col gap-4">
                        {takenActive!.map((order) => (
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
                      {(takenActive?.length ?? 0) > 0 && (
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
