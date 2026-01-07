"use client";

import React from "react";
import { Block, Button, List, ListItem } from "konsta/react";
import { ChevronRight, Star, Wallet, CreditCard } from "lucide-react";
import { AppPage, AppNavbar } from "@/src/components";

const PACKAGES = [
  { amount: 100, label: "100 ₽" },
  { amount: 300, label: "300 ₽", popular: true },
  { amount: 1000, label: "1000 ₽" },
  { amount: 3000, label: "3000 ₽" },
];

export default function ProfilePage() {
  const balance = 128;

  const rating = 4.8;
  const completedOrders = 127;
  const activeOrders = 3;

  const onTopUp = (amount: number) => {
    alert(`Пополнение (мок): +${amount} ₽`);
  };

  return (
    <AppPage className="min-h-screen bg-[#F2F2F7] flex flex-col">
      <AppNavbar title="Профиль" />

      <Block className="flex-1 overflow-auto px-4 py-4 space-y-4 pb-20">
        <Block className="my-0" strong inset>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#007AFF] rounded-full flex items-center justify-center text-white text-2xl">
              И
            </div>
            <div className="flex-1">
              <div className="text-lg mb-1">Иван Петров</div>
              <div className="text-sm text-[#8E8E93]">@ivan_petrov</div>
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
            <div className="text-2xl">{balance} ₽</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-[#8E8E93]">Пополнить баланс</div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {PACKAGES.map((pkg) => (
                <Button
                  key={pkg.amount}
                  onClick={() => onTopUp(pkg.amount)}
                  rounded
                  className={`relative ${
                    pkg.popular ? "k-color-brand" : "k-color-brand" // keep Konsta token
                  }`}
                  outline={!pkg.popular}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#FF9500] text-white text-xs px-2 py-0.5 rounded-full">
                      Популярное
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    <span>{pkg.label}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </Block>

        <List strong inset className="my-0">
          <ListItem title="История заказов" after={<ChevronRight className="w-5 h-5 text-[#8E8E93]" />} link />
          <ListItem title="Мои категории" after={<ChevronRight className="w-5 h-5 text-[#8E8E93]" />} link />
          <ListItem title="Отзывы" after={<ChevronRight className="w-5 h-5 text-[#8E8E93]" />} link />
          <ListItem
            title="Настройки уведомлений"
            after={<ChevronRight className="w-5 h-5 text-[#8E8E93]" />}
            link
          />
        </List>

        <List strong inset className="my-0">
          <ListItem title="Помощь" after={<ChevronRight className="w-5 h-5 text-[#8E8E93]" />} link />
          <ListItem title="О сервисе" after={<ChevronRight className="w-5 h-5 text-[#8E8E93]" />} link />
        </List>
      </Block>
    </AppPage>
  );
}

