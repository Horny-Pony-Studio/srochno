"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Block, Chip, Preloader } from "konsta/react";
import { AppNavbar, AppPage, InfoBlock, OrderCard, PageTransition, PullToRefresh, SearchableSelect } from "@/src/components";
import { CATEGORIES } from "@/src/data";
import { useCities } from "@/hooks/useCities";
import { isTakenByUser, minutesLeft, takenCount } from "@/src/utils/order";
import { useTelegramBackButton } from "@/src/hooks/useTelegram";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/providers/AuthProvider";

const takeButtonElement = (
  <div className="bg-primary text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:opacity-80">
    Взять (2 ₽)
  </div>
);

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  useTelegramBackButton('/');
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

  const { data: orders, isLoading, isError, refetch } = useOrders(filters);

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const activeOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((o) => {
      if (minutesLeft(o) <= 0) return false;
      if (user && isTakenByUser(o, user.id)) return false;
      return true;
    });
  }, [orders, user]);

  return (
    <PageTransition>
      <AppPage className={"min-h-screen flex flex-col"}>
        <AppNavbar title="Срочные заказы" showRight />

        <PullToRefresh onRefresh={handleRefresh} className="flex-1">
        <Block className="flex-1 flex flex-col gap-4 pb-16 my-4 pl-0! pr-0!">

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
                    className={`shrink-0 transition-all duration-200 active:scale-95 ${
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
