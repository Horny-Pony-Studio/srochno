"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Block, Button, Chip, Link, ListItem, Preloader } from "konsta/react";
import { Clock, Phone, Lock, ArrowLeft } from "lucide-react";
import { AppPage, InfoBlock, AppNavbar, AppList } from "@/src/components";
import { getTimeBackground, getTimeColor } from "@/src/utils/time";
import { MOCK_ORDERS } from "@/src/data/mockOrders";
import { minutesLeft, takenCount } from "@/src/utils/order";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();

  const orderId = typeof params?.id === "string" ? params.id : "";
  const isParamsReady = orderId.length > 0;

  const balance = 128;

  const [contactUnlocked, setContactUnlocked] = useState<boolean>(false);

  const order = useMemo(() => {
    if (!isParamsReady) return undefined;

    const base = MOCK_ORDERS.find((o) => o.id === orderId);
    if (!base) return null;

    return {
      ...base,
      price: 2,
      description:
        base.description +
        "\n\nАдрес: ул. Ленина 45, подъезд 2, квартира 15. Вода капает постоянно, нужно заменить прокладку или сам кран.",
    };
  }, [isParamsReady, orderId]);

  const [minuteTick, setMinuteTick] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMinuteTick((x) => x + 1);
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const timeLeft = useMemo(() => {
    void minuteTick;
    return order ? minutesLeft(order) : 0;
  }, [order, minuteTick]);

  if (!isParamsReady || order === undefined) {
    return (
      <AppPage className="min-h-dvh bg-[#F2F2F7] flex flex-col">
        <AppNavbar showRight title="Детали заказа" />
        <div className="flex-1 flex items-center justify-center py-20">
          <Preloader className="text-[#007AFF]" />
        </div>
      </AppPage>
    );
  }

  if (order === null) {
    return (
      <AppPage className="min-h-dvh bg-[#F2F2F7] flex flex-col">
        <AppNavbar showRight title="Детали заказа" />

        <InfoBlock
          className={"mx-4 mt-4"}
          variant={"red"}
          message={"Заказ не найден или взят в исполнение."}
          icon={"⚠️"}
        />

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#C6C6C8] px-4 py-3 safe-area-bottom z-50 pointer-events-auto">
          <Button
            type="button"
            large
            rounded
            className="w-full flex items-center justify-center gap-2"
            onClick={() => router.push("/orders")}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>К списку заказов</span>
          </Button>
        </div>
      </AppPage>
    );
  }

  const pay = order.price;
  const left = timeLeft;
  const takes = takenCount(order);
  const canTake = balance >= pay && takes < 3 && left > 0;

  return (
    <AppPage className="min-h-dvh bg-[#F2F2F7] flex flex-col">
      <AppNavbar showRight title="Детали заказа" />

      <Block className="flex-1 flex flex-col gap-4 pb-24 my-4 pl-0! pr-0!">
        <Block className="my-0" strong inset>
          <div className={`${getTimeBackground(timeLeft)} rounded-xl p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${getTimeColor(timeLeft)}`} />
                <span className={`${getTimeColor(timeLeft)}`}>Осталось времени</span>
              </div>
              <div className={`text-2xl ${getTimeColor(timeLeft)}`}>{timeLeft} мин</div>
            </div>
          </div>
        </Block>

        <AppList>
          <ListItem label title={"Категория"} after={order.category}/>
        </AppList>

        <AppList>
          <ListItem label title={"Город"} after={order.city}/>
        </AppList>

        <Block className="my-0" strong inset>
          <div className="text-sm text-[#8E8E93] mb-2">Описание</div>
          <p className="whitespace-pre-wrap">{order.description}</p>
        </Block>

        <Block className="my-0" strong inset>
          <div className="text-sm text-[#8E8E93] mb-2">Контакт</div>
          {contactUnlocked ? (
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#007AFF]" />
              <Link href={`https://t.me/${order.contact.replace("@", "")}`} className="text-[#007AFF]">
                {order.contact}
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[#8E8E93]">
                <Lock className="w-5 h-5" />
                <span>Контакт доступен после оплаты</span>
              </div>
              <div className="text-sm text-[#8E8E93]">{pay} ₽</div>
            </div>
          )}
        </Block>

        <Block className="my-0" strong inset>
          <div className="flex items-center justify-between">
            <span className="text-[#8E8E93]">Откликов</span>
            <Chip className={takenCount(order) >= 3 ? "text-[#FF3B30]" : ""}>{takenCount(order)}/3</Chip>
          </div>
        </Block>

        {!contactUnlocked && !canTake && balance < pay && (
          <InfoBlock
            className="mx-4"
            variant="yellow"
            icon="💰"
            message="Недостаточно средств. Пополните баланс для взятия заказа."
          />
        )}

        {takenCount(order) >= 3 && (
          <InfoBlock
            className="mx-4"
            variant="red"
            icon="⚠️"
            message="Максимальное количество откликов (3) уже достигнуто."
          />
        )}
      </Block>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#C6C6C8] px-4 py-3 safe-area-bottom z-50">
        <Button
          large
          rounded
          disabled={!canTake}
          onClick={() => {
            if (!canTake) return;
            setContactUnlocked(true);
          }}
        >
          {canTake ? `Взять заказ (${pay} ₽)` : "Недоступно"}
        </Button>
      </div>

    </AppPage>
  );
}
