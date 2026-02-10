"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Block, ListItem, Preloader } from "konsta/react";
import { AppList, AppNavbar, AppPage, InfoBlock, OrderCard, PageTransition, PullToRefresh, Select } from "@/src/components";
import { CATEGORIES, CITIES } from "@/src/data";
import { minutesLeft, takenCount } from "@/src/utils/order";
import { useTelegramBackButton } from "@/src/hooks/useTelegram";
import { useOrders } from "@/hooks/useOrders";

const takeButtonElement = (
  <div className="bg-primary text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:opacity-80">
    Взять (2 ₽)
  </div>
);

export default function OrdersPage() {
  const router = useRouter();
  useTelegramBackButton('/');
  const [selectedCategory, setSelectedCategory] = useState<string>("Все");
  const [selectedCity, setSelectedCity] = useState<string>("Все");

  const categoryOptions = useMemo(() => ["Все", ...CATEGORIES], []);
  const cityOptions = useMemo(() => ["Все", ...CITIES], []);

  const filters = useMemo(() => {
    const f: { category?: string; city?: string; status?: 'active' } = { status: 'active' };
    if (selectedCategory !== "Все") f.category = selectedCategory;
    if (selectedCity !== "Все") f.city = selectedCity;
    return f;
  }, [selectedCategory, selectedCity]);

  const { data: orders, isLoading, isError, refetch } = useOrders(filters);

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const activeOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((o) => minutesLeft(o) > 0);
  }, [orders]);

  return (
    <PageTransition>
      <AppPage className={"min-h-screen flex flex-col"}>
        <AppNavbar title="Срочные заказы" showRight />

        <PullToRefresh onRefresh={handleRefresh} className="flex-1">
        <Block className="flex-1 flex flex-col gap-4 pb-16 my-4 pl-0! pr-0!">

          <AppList>
            <ListItem
              label
              title={<span className={"text-sm"}>Категория</span>}
              after={
                <Select
                  value={selectedCategory}
                  onChangeAction={setSelectedCategory}
                  options={categoryOptions}
                  placeholder="Выберите категорию"
                  className="w-48 text-right"
                />
              }
            />
          </AppList>

          <AppList>
            <ListItem
              label
              title={<span className={"text-sm"}>Город</span>}
              after={
                <Select
                  value={selectedCity}
                  onChangeAction={setSelectedCity}
                  options={cityOptions}
                  placeholder="Выберите город"
                  className="w-48 text-right"
                />
              }
            />
          </AppList>

          <Block className="flex-1 flex flex-col gap-4 pb-16 my-0 pl-0! pr-0!">
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
            ) : activeOrders.length === 0 ? (
              <InfoBlock
                className={"mx-4"}
                variant={"blue"}
                message={"Нет заказов в этой категории или городе"}
              />
            ) : (
              <div className="flex flex-col gap-4">
                {activeOrders.map((order, index) => {
                  const takes = takenCount(order);
                  const left = minutesLeft(order);
                  const canShowTake = takes < 3 && left > 0;

                  return (
                    <div key={order.id} className="stagger-item" style={{ animationDelay: `${index * 0.05}s` }}>
                      <OrderCard
                        order={order}
                        onClick={() => router.push(`/orders/${order.id}`)}
                        footerRight={canShowTake ? takeButtonElement : undefined}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </Block>
        </Block>
        </PullToRefresh>
      </AppPage>
    </PageTransition>
  );
}
