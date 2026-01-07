"use client";

import React from "react";
import { Block, Button, ListItem } from "konsta/react";
import { Star, Wallet, CreditCard } from "lucide-react";
import {AppList, AppNavbar, AppPage} from "@/src/components";
import { PACKAGES } from "@/src/data";
import {useRouter} from "next/navigation";

export default function Profile() {
  const router = useRouter();

  const rating = 4.8;
  const completedOrders = 127;
  const activeOrders = 3;

  return (
    <AppPage className="min-h-dvh bg-[#F2F2F7] flex flex-col">
      <AppNavbar title="Профиль" />

      <Block className="flex-1 flex flex-col gap-4 pb-16 my-4 pl-0! pr-0!">
        <Block className="my-0" strong inset>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#007AFF] rounded-full flex items-center justify-center text-white text-2xl">
              И
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-lg mb-1 truncate">Иван Петров</div>
              <div className="text-sm text-[#8E8E93] truncate">@ivan_petrov</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#C6C6C8]">
            <div className="text-center">
              <div className="text-2xl mb-1">{completedOrders}</div>
              <div className="text-xs text-[#8E8E93]">Выполнено</div>
            </div>

            <div className="text-center">
              <div className="text-2xl mb-1 flex items-center justify-center gap-1">
                <Star className="w-5 h-5 text-[#FF9500] fill-[#FF9500]" />
                {rating}
              </div>
              <div className="text-xs text-[#8E8E93]">Рейтинг</div>
            </div>

            <div className="text-center">
              <div className="text-2xl mb-1">{activeOrders}</div>
              <div className="text-xs text-[#8E8E93]">Активных</div>
            </div>
          </div>
        </Block>

        <Block className="my-0" strong inset>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#007AFF]" />
              <span>Баланс</span>
            </div>
            <div className="text-2xl">{10_000} ₽</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-[#8E8E93]">Пополнить баланс</div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              {PACKAGES.map((_package) => (
                <Button
                  key={_package.amount}
                  onClick={() => {}}
                  rounded
                  outline={!_package.popular}
                  className={`relative h-10 overflow-visible ${_package.popular ? "k-color-brand" : "k-color-brand"}`}
                >
                  {_package.popular && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#FF9500] text-white text-xs px-2 py-0.5 rounded-full">
                      Популярное
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span className={"text-sm"}>{_package.label}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </Block>

        <AppList>
          <ListItem title="История заказов" link onClick={() => router.push("/history")} />
          <ListItem title="Мои категории" link onClick={() => router.push("/executor")} />
          <ListItem title="Отзывы" link onClick={() => router.push("/reviews")} />
          <ListItem title="Настройки уведомлений" link onClick={() => {}} />
        </AppList>

        <AppList>
          <ListItem
            title="Помощь"
            link
            onClick={() => window.open("https://t.me/drygsssss", "_blank")}
          />
          <ListItem
            title="О сервисе"
            link
            onClick={() => window.open("https://t.me/drygsssss", "_blank")}
          />
        </AppList>
      </Block>
    </AppPage>
  );
}
