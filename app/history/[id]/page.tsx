"use client";

import React, { useCallback } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { Block, Chip, ListItem, Preloader } from "konsta/react";
import { AppList, AppNavbar, AppPage, InfoBlock, PageTransition } from "@/src/components";

const ReviewForm = dynamic(() => import("@/src/components/ReviewForm"));
const ComplaintForm = dynamic(() => import("@/src/components/ComplaintForm"));
import { minutesLeft, takenCount } from "@/src/utils/order";
import { useTelegramBackButton } from "@/src/hooks/useTelegram";
import { useOrder } from "@/hooks/useOrders";
import { useAuth } from "@/providers/AuthProvider";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
}

export default function HistoryDetailPage() {
  const router = useRouter();
  useTelegramBackButton('/history');
  const { user } = useAuth();
  const params = useParams<{ id?: string }>();
  const id = typeof params?.id === "string" ? params.id : "";

  const handleFeedbackSuccess = useCallback(() => {
    setTimeout(() => router.push('/history'), 1500);
  }, [router]);

  const { data: order, isLoading, isError } = useOrder(id || undefined);

  if (isLoading || !id) {
    return (
      <AppPage className="min-h-dvh flex flex-col">
        <AppNavbar title="История" showRight />
        <div className="flex-1 flex items-center justify-center py-20">
          <Preloader className="text-primary" />
        </div>
      </AppPage>
    );
  }

  if (isError || !order) {
    return (
      <AppPage className="min-h-dvh flex flex-col">
        <AppNavbar title="История" showRight />
        <InfoBlock className="mx-4 mt-4" variant="red" icon="⚠️" message="Запись не найдена" />
      </AppPage>
    );
  }

  const left = minutesLeft(order);
  const takes = takenCount(order);
  const isFinished = order.status === 'completed'
    || order.status === 'expired'
    || order.status === 'closed_no_response'
    || order.status === 'deleted'
    || left <= 0;
  const status = order.status === 'completed'
    ? "Выполнен"
    : order.status === 'closed_no_response'
    ? "Закрыт (нет ответа)"
    : order.status === 'deleted'
    ? "Отменён"
    : isFinished
    ? (takes > 0 ? "Выполнен" : "Отменён")
    : "В работе";
  const canLeaveFeedback = isFinished && takes > 0;

  return (
    <PageTransition>
      <AppPage className="min-h-dvh flex flex-col">
        <AppNavbar title="История заказа" showRight />

        <Block className="flex-1 flex flex-col gap-4 pb-20 my-4 pl-0! pr-0!">
          <Block className="my-0 card-appear transition-all duration-200" strong inset>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm opacity-55 mb-1">{order.category} • {order.city}</div>
                <p className="whitespace-pre-wrap">{order.description}</p>
              </div>
              <Chip
                className={
                  status === "Выполнен"
                    ? "bg-green-100 text-green-600"
                    : status === "Отменён" || status === "Закрыт (нет ответа)"
                    ? "bg-red-100 text-red-600"
                    : "bg-orange-100 text-orange-600"
                }
              >
                {status}
              </Chip>
            </div>

            <div className="mt-3 text-xs opacity-55">Создано: {formatDateTime(order.createdAt)}</div>
          </Block>

          <div className="card-appear-delayed">
            <AppList>
              <ListItem label title="Откликов" after={`${takes}/3`} />
              <ListItem label title="Таймер" after={isFinished ? "Истек" : `${left} мин`} />
            </AppList>
          </div>

          {canLeaveFeedback ? (
            <div className="scale-in">
              {user?.id != null && order.takenBy.some(t => t.executorId === String(user.id)) ? (
                <ComplaintForm orderId={id} onSuccess={handleFeedbackSuccess} />
              ) : (
                <ReviewForm orderId={id} onSuccess={handleFeedbackSuccess} />
              )}
            </div>
          ) : null}
        </Block>
      </AppPage>
    </PageTransition>
  );
}
