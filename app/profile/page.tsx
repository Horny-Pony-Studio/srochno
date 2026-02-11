"use client";

import React, { useEffect } from "react";
import { Block, Button, ListItem, Preloader } from "konsta/react";
import { Star, Wallet, CreditCard } from "lucide-react";
import {AppList, AppNavbar, AppPage, PageTransition, ThemeSelector} from "@/src/components";
import { PACKAGES } from "@/src/data";
import {useRouter} from "next/navigation";
import { useTelegramBackButton, useTelegramLinks } from "@/src/hooks/useTelegram";
import { useAuth } from "@/providers/AuthProvider";
import { usePayment } from "@/src/hooks/usePayment";
import { useToast } from "@/hooks/useToast";

export default function Profile() {
  const router = useRouter();
  useTelegramBackButton();
  const { openTelegramLink, openExternalLink } = useTelegramLinks();
  const { user } = useAuth();
  const toast = useToast();
  const { state: paymentState, startPayment, reset: resetPayment } = usePayment();

  const isPaymentBusy = paymentState === 'creating' || paymentState === 'awaiting_payment';

  const handleRecharge = async (amount: number) => {
    const invoice = await startPayment(amount);
    if (!invoice) return;

    if (invoice.mini_app_invoice_url) {
      openTelegramLink(invoice.mini_app_invoice_url);
    } else {
      openExternalLink(invoice.pay_url);
    }
  };

  useEffect(() => {
    if (paymentState === 'paid') {
      toast.success('Баланс успешно пополнен!');
      resetPayment();
    } else if (paymentState === 'error') {
      toast.error('Не удалось создать платёж. Попробуйте позже.');
      resetPayment();
    } else if (paymentState === 'expired') {
      toast.warning('Время оплаты истекло. Попробуйте снова.');
      resetPayment();
    }
  }, [paymentState, toast, resetPayment]);

  const rating = user?.rating ?? 0;
  const completedOrders = user?.completed_orders ?? 0;
  const activeOrders = user?.active_orders ?? 0;
  const balance = user?.balance ?? 0;
  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(' ')
    : '...';
  const displayUsername = user?.username ? `@${user.username}` : '';
  const avatarLetter = user?.first_name?.[0]?.toUpperCase() ?? '?';

  return (
    <PageTransition>
      <AppPage className="min-h-dvh flex flex-col">
        <AppNavbar title="Профиль" />

        <Block className="flex-1 flex flex-col gap-4 pb-16 my-4 pl-0! pr-0!">
          <Block className="my-0 card-appear" strong inset>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl transition-transform duration-300 hover:scale-110">
              {avatarLetter}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-lg mb-1 truncate">{displayName}</div>
              <div className="text-sm opacity-55 truncate">{displayUsername}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-ios">
            <div className="text-center">
              <div className="text-2xl mb-1">{completedOrders}</div>
              <div className="text-xs opacity-55">Выполнено</div>
            </div>

            <div className="text-center">
              <div className="text-2xl mb-1 flex items-center justify-center gap-1">
                <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                {rating}
              </div>
              <div className="text-xs opacity-55">Рейтинг</div>
            </div>

            <div className="text-center">
              <div className="text-2xl mb-1">{activeOrders}</div>
              <div className="text-xs opacity-55">Активных</div>
            </div>
          </div>
        </Block>

        <Block className="my-0 card-appear-delayed" strong inset>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              <span>Баланс</span>
            </div>
            <div className="text-2xl">{balance} ₽</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm opacity-55">Пополнить баланс</div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              {PACKAGES.map((_package) => (
                <Button
                  key={_package.amount}
                  onClick={() => handleRecharge(_package.amount)}
                  disabled={isPaymentBusy}
                  rounded
                  outline={!_package.popular}
                  className={`relative h-10 overflow-visible transition-all duration-200 hover:scale-105 active:scale-95 ${_package.popular ? "k-color-brand" : "k-color-brand"}`}
                >
                  {_package.popular && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
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

            {paymentState === 'awaiting_payment' && (
              <div className="flex items-center justify-center gap-2 mt-3 text-sm opacity-70">
                <Preloader className="text-primary" />
                <span>Ожидание оплаты...</span>
              </div>
            )}
          </div>
        </Block>

        <div className="card-appear-delayed" style={{ animationDelay: '0.15s' }}>
          <AppList>
            <ListItem title="История заказов" link onClick={() => router.push("/history")} />
            <ListItem title="Заказы в работе" link onClick={() => router.push("/taken")} />
            <ListItem title="Отзывы" link onClick={() => router.push("/reviews")} />
            <ListItem title="Настройки уведомлений" link onClick={() => router.push("/executor")} />
          </AppList>
        </div>

        <div className="card-appear-delayed" style={{ animationDelay: '0.2s' }}>
          <div className="text-sm font-medium opacity-55 px-4 mb-1">Тема</div>
          <ThemeSelector />
        </div>

        <div className="card-appear-delayed" style={{ animationDelay: '0.25s' }}>
          <AppList>
            <ListItem
              title="Помощь"
              link
              onClick={() => openTelegramLink("https://t.me/drygsssss")}
            />
            <ListItem
              title="О сервисе"
              link
              onClick={() => openTelegramLink("https://t.me/drygsssss")}
            />
          </AppList>
        </div>
      </Block>

    </AppPage>
    </PageTransition>
  );
}
