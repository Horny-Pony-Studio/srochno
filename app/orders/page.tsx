"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {Block, ListItem} from "konsta/react";
import {AppList, AppPage, OrderCard, Select} from "@/src/components";
import {CATEGORIES} from "@/src/data";
import { MOCK_ORDERS } from "@/src/data/mockOrders";
import { minutesLeft, takenCount } from "@/src/utils/order";

export default function OrdersPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("Все");

  const categoryOptions = useMemo(() => ["Все", ...CATEGORIES], []);

  const filteredOrders = useMemo(() => {
    const activeOrders = MOCK_ORDERS.filter((o) => o.status === "active" && minutesLeft(o) > 0);
    if (selectedCategory === "Все") return activeOrders;
    return activeOrders.filter((o) => o.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <AppPage title="Срочные заказы"  className={"min-h-screen bg-[#F2F2F7] flex flex-col"}>
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

        <Block className="flex-1 flex flex-col gap-4 pb-16 my-0 pl-0! pr-0!">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#8E8E93]">Нет заказов в этой категории</p>
            </div>
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
