"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {Block, ListItem} from "konsta/react";
import {AppList, AppPage, InfoBlock, OrderCard, Select, AppNavbar} from "@/src/components";
import {CATEGORIES} from "@/src/data";
import { CITIES } from "@/src/data";
import { MOCK_ORDERS } from "@/src/data/mockOrders";
import { minutesLeft, takenCount } from "@/src/utils/order";

export default function OrdersPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("Все");
  const [selectedCity, setSelectedCity] = useState<string>("Все");

  const categoryOptions = useMemo(() => ["Все", ...CATEGORIES], []);
  const cityOptions = useMemo(() => ["Все", ...CITIES], []);

  const filteredOrders = useMemo(() => {
    const activeOrders = MOCK_ORDERS.filter((o) => o.status === "active" && minutesLeft(o) > 0);

    const byCategory = selectedCategory === "Все"
      ? activeOrders
      : activeOrders.filter((o) => o.category === selectedCategory);

    const byCity = selectedCity === "Все"
      ? byCategory
      : byCategory.filter((o) => o.city === selectedCity);

    return byCity;
  }, [selectedCategory, selectedCity]);

  return (
    <AppPage className={"min-h-screen bg-[#F2F2F7] flex flex-col"}>
      <AppNavbar title="Срочные заказы" showRight />

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
          {filteredOrders.length === 0 ? (
            <InfoBlock
              className={"mx-4"}
              variant={"blue"}
              message={"Нет заказов в этой категории или городе"}
            />
          ) : (
            <div className="flex flex-col gap-4">
              {filteredOrders.map((order) => {
                const takes = takenCount(order);
                const left = minutesLeft(order);
                const canShowTake = takes < 3 && left > 0;

                return (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onClick={() => router.push(`/orders/${order.id}`)}
                    footerRight={
                      canShowTake ? (
                        <div className="bg-[#007AFF] text-white px-4 py-2 rounded-lg text-sm">
                          Взять (2 ₽)
                        </div>
                      ) : null
                    }
                  />
                );
              })}
            </div>
          )}
        </Block>
      </Block>
    </AppPage>
  );
}
