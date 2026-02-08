"use client";

import React, { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { Block, Chip, Link, ListItem, Preloader } from "konsta/react";
import { Clock, Phone, Lock } from "lucide-react";
import { AppPage, InfoBlock, AppNavbar, AppList, PageTransition } from "@/src/components";
import { getTimeBackground, getTimeColor } from "@/src/utils/time";
import { takenCount } from "@/src/utils/order";
import { useOrderTimer } from "@/src/hooks/useOrderTimer";
import { useTelegramBackButton, useTelegramMainButton, useHaptic } from "@/src/hooks/useTelegram";
import { useOrder, useTakeOrder } from "@/hooks/useOrders";
import { useAuth } from "@/src/providers/AuthProvider";
import { ApiRequestError } from "@/lib/api";

export default function OrderDetailPage() {
  useTelegramBackButton('/orders');
  const params = useParams<{ id?: string }>();
  const { notification } = useHaptic();
  const { user, refetchUser } = useAuth();

  const orderId = typeof params?.id === "string" ? params.id : "";
  const balance = user?.balance ?? 0;

  const { data: order, isLoading, isError } = useOrder(orderId || undefined);
  const takeOrderMut = useTakeOrder();

  const [contactUnlocked, setContactUnlocked] = useState(false);
  const [revealedContact, setRevealedContact] = useState<string | null>(null);
  const [takeError, setTakeError] = useState<string | null>(null);

  const timer = useOrderTimer(order);

  const pay = 2;
  const takes = order ? takenCount(order) : 0;
  const canTake = !contactUnlocked && balance >= pay && takes < 3 && !timer.isExpired;

  const handleTakeOrder = useCallback(() => {
    if (!canTake || !orderId || takeOrderMut.isPending) return;

    setTakeError(null);
    takeOrderMut.mutate(orderId, {
      onSuccess: (res) => {
        setContactUnlocked(true);
        setRevealedContact(res.contact);
        notification('success');
        refetchUser();
      },
      onError: (err) => {
        notification('error');
        if (err instanceof ApiRequestError) {
          if (err.status === 409) {
            setTakeError('Максимальное количество откликов уже достигнуто.');
          } else if (err.status === 402) {
            setTakeError('Недостаточно средств на балансе.');
          } else {
            setTakeError(err.detail);
          }
        } else {
          setTakeError('Не удалось взять заказ. Попробуйте позже.');
        }
      },
    });
  }, [canTake, orderId, takeOrderMut, notification, refetchUser]);

  useTelegramMainButton(
    canTake ? `Взять заказ (${pay} ₽)` : 'Недоступно',
    handleTakeOrder,
    { isEnabled: canTake, isLoading: takeOrderMut.isPending },
  );

  if (isLoading || !orderId) {
    return (
      <AppPage className="min-h-dvh flex flex-col">
        <AppNavbar showRight title="Детали заказа" />
        <div className="flex-1 flex items-center justify-center py-20">
          <Preloader className="text-primary" />
        </div>
      </AppPage>
    );
  }

  if (isError || !order) {
    return (
      <AppPage className="min-h-dvh flex flex-col">
        <AppNavbar showRight title="Детали заказа" />
        <InfoBlock
          className={"mx-4 mt-4"}
          variant={"red"}
          message={"Заказ не найден или произошла ошибка загрузки."}
          icon={"⚠️"}
        />
      </AppPage>
    );
  }

  const displayContact = revealedContact ?? order.contact;

  return (
    <PageTransition>
      <AppPage className="min-h-dvh flex flex-col">
        <AppNavbar showRight title="Детали заказа" />

        <Block className="flex-1 flex flex-col gap-4 pb-24 my-4 pl-0! pr-0!">
          <Block className="my-0 card-appear" strong inset>
            <div className={`${getTimeBackground(timer.minutes)} rounded-xl p-4 transition-all duration-300`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className={`w-5 h-5 ${getTimeColor(timer.minutes)} transition-colors duration-300`} />
                  <span className={`${getTimeColor(timer.minutes)} transition-colors duration-300`}>Осталось времени</span>
                </div>
                <div className={`text-2xl ${getTimeColor(timer.minutes)} transition-colors duration-300`}>{timer.display}</div>
              </div>
            </div>
          </Block>

          <div className="card-appear-delayed">
            <AppList>
              <ListItem label title={"Категория"} after={order.category}/>
            </AppList>
          </div>

          <div className="card-appear-delayed" style={{ animationDelay: '0.15s' }}>
            <AppList>
              <ListItem label title={"Город"} after={order.city}/>
            </AppList>
          </div>

          <Block className="my-0 card-appear-delayed" style={{ animationDelay: '0.2s' }} strong inset>
            <div className="text-sm opacity-55 mb-2">Описание</div>
            <p className="whitespace-pre-wrap">{order.description}</p>
          </Block>

          <Block className="my-0 card-appear-delayed" style={{ animationDelay: '0.25s' }} strong inset>
            <div className="text-sm opacity-55 mb-2">Контакт</div>
            {contactUnlocked ? (
              <div className="flex items-center gap-2 scale-in">
                <Phone className="w-5 h-5 text-primary" />
                <Link href={`https://t.me/${displayContact.replace("@", "")}`} className="text-primary">
                  {displayContact}
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 opacity-55">
                  <Lock className="w-5 h-5" />
                  <span>Контакт доступен после оплаты</span>
                </div>
                <div className="text-sm opacity-55">{pay} ₽</div>
              </div>
            )}
          </Block>

          <Block className="my-0 card-appear-delayed" style={{ animationDelay: '0.3s' }} strong inset>
            <div className="flex items-center justify-between">
              <span className="opacity-55">Откликов</span>
              <Chip className={takes >= 3 ? "text-red-500" : ""}>{takes}/3</Chip>
            </div>
          </Block>

          {takeError && (
            <InfoBlock
              className="mx-4 scale-in"
              variant="red"
              icon="⚠️"
              message={takeError}
            />
          )}

          {!contactUnlocked && !canTake && balance < pay && (
            <InfoBlock
              className="mx-4 scale-in"
              variant="yellow"
              icon="💰"
              message="Недостаточно средств. Пополните баланс для взятия заказа."
            />
          )}

          {takes >= 3 && (
            <InfoBlock
              className="mx-4 scale-in"
              variant="red"
              icon="⚠️"
              message="Максимальное количество откликов (3) уже достигнуто."
            />
          )}
        </Block>

      </AppPage>
    </PageTransition>
  );
}
