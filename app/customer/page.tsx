"use client"

import { useCallback } from "react";
import { Block, List, Button, Chip, Preloader } from "konsta/react";
import { Edit2, Trash2, X, MessageCircle, CheckCircle } from 'lucide-react';
import { takenCount } from "@/src/utils/order";
import { useRouter } from "next/navigation";
import { AppPage, EmptyState, InfoBlock, AppNavbar, OrderTimerChip, PageTransition } from "@/src/components";
import { useTelegramBackButton, useTelegramMainButton, useTelegramConfirm } from "@/src/hooks/useTelegram";
import { useMyOrders, useDeleteOrder, useCloseOrder, useRespondToOrder, useCompleteOrder } from "@/hooks/useOrders";

function CustomerPage() {
  const router = useRouter();
  useTelegramBackButton('/');
  const confirm = useTelegramConfirm();

  const { data: orders, isLoading, isError, refetch } = useMyOrders();
  const deleteMut = useDeleteOrder();
  const closeMut = useCloseOrder();
  const respondMut = useRespondToOrder();
  const completeMut = useCompleteOrder();

  const handleCreateOrder = useCallback(() => {
    router.push('/create-order');
  }, [router]);
  useTelegramMainButton('Создать заявку', handleCreateOrder);

  const onEditOrder = useCallback((orderId: string) => {
    router.push(`/create-order?edit=${orderId}`);
  }, [router]);

  const onDeleteOrder = useCallback(async (orderId: string) => {
    const ok = await confirm('Удалить заявку?');
    if (!ok) return;
    deleteMut.mutate(orderId);
  }, [confirm, deleteMut]);

  const onCloseOrder = useCallback(async (orderId: string) => {
    const ok = await confirm('Закрыть заявку?');
    if (!ok) return;
    closeMut.mutate(orderId);
  }, [confirm, closeMut]);

  const onRespondToOrder = useCallback(async (orderId: string) => {
    const ok = await confirm('Подтвердить, что вы ответили исполнителю?');
    if (!ok) return;
    respondMut.mutate(orderId);
  }, [confirm, respondMut]);

  const onCompleteOrder = useCallback(async (orderId: string) => {
    const ok = await confirm('Завершить заявку?');
    if (!ok) return;
    completeMut.mutate(orderId);
  }, [confirm, completeMut]);

  return (
    <PageTransition>
      <AppPage className={"min-h-screen flex flex-col"}>
        <AppNavbar title="Мои заявки" showRight />

        <Block className="flex-1 flex flex-col gap-4 pb-16 my-4 pl-0! pr-0!">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Preloader className="text-primary" />
            </div>
          ) : isError ? (
            <InfoBlock
              className={"mx-4"}
              variant={"red"}
              message={"Не удалось загрузить заявки. Попробуйте позже."}
              icon={"⚠️"}
              onRetry={() => refetch()}
            />
          ) : !orders || orders.length === 0 ? (
            <EmptyState
              title="У вас пока нет заявок"
              description="Создайте первую заявку"
              className="scale-in"
            />
          ) : (
            <List className={"my-0"}>
              {orders.map((order, index) => {
                const canModify = order.status === 'active' && order.takenBy.length === 0;

                return (
                  <div key={order.id} className="stagger-item" style={{ animationDelay: `${index * 0.05}s` }}>
                    <Block
                      className={"my-0 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"}
                      strong inset
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="text-sm opacity-55 mb-1">{order.category}</div>
                          <div className="text-xs opacity-55">{order.city}</div>
                        </div>
                        <OrderTimerChip order={order} />
                      </div>

                      <p className="mb-3 line-clamp-2">
                        {order.description}
                      </p>

                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-ios">
                        <span className="text-sm opacity-55">Откликов</span>
                        <Chip className={takenCount(order) >= 3 ? 'text-green-500' : ''}>
                          {takenCount(order)}/3
                        </Chip>
                      </div>

                      <div className="flex gap-2">
                        {canModify && (
                          <>
                            <Button
                              rounded
                              outline
                              disabled={deleteMut.isPending}
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditOrder(order.id);
                              }}
                              className={"flex-1 justify-center k-color-brand-yellow transition-all duration-200"}
                            >
                              <Edit2 className="w-4 h-4"/>
                              <span className="text-sm">Изменить</span>
                            </Button>
                            <Button
                              rounded
                              outline
                              color="red"
                              disabled={deleteMut.isPending}
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteOrder(order.id);
                              }}
                              className={"flex-1 justify-center k-color-brand-red transition-all duration-200"}
                            >
                              <Trash2 className="w-4 h-4"/>
                              <span className="text-sm">Удалить</span>
                            </Button>
                          </>
                        )}
                        {order.status === 'active' && order.takenBy.length > 0 && (
                          <>
                            {!order.customerResponse ? (
                              <Button
                                rounded
                                outline
                                color="green"
                                disabled={respondMut.isPending}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRespondToOrder(order.id);
                                }}
                                className={"flex-1 justify-center k-color-brand-green transition-all duration-200"}
                              >
                                <MessageCircle className="w-4 h-4"/>
                                <span className="text-sm">Я ответил</span>
                              </Button>
                            ) : (
                              <Button
                                rounded
                                color="green"
                                disabled={completeMut.isPending}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCompleteOrder(order.id);
                                }}
                                className={"flex-1 justify-center transition-all duration-200"}
                              >
                                <CheckCircle className="w-4 h-4"/>
                                <span className="text-sm">Завершить</span>
                              </Button>
                            )}
                            <Button
                              rounded
                              outline
                              disabled={closeMut.isPending}
                              onClick={(e) => {
                                e.stopPropagation();
                                onCloseOrder(order.id);
                              }}
                              className={"flex-1 justify-center k-color-brand-red transition-all duration-200"}
                            >
                              <X className="w-4 h-4"/>
                              <span className="text-sm">Закрыть</span>
                            </Button>
                          </>
                        )}
                      </div>

                      {order.status === 'closed_no_response' && (
                        <div className="mt-2 text-xs text-red-500 text-center">
                          Закрыт автоматически — клиент не ответил
                        </div>
                      )}

                      {!canModify && order.takenBy.length > 0 && order.status !== 'closed_no_response' && (
                        <div className="mt-2 text-xs opacity-55 text-center">
                          Редактирование недоступно после взятия исполнителем
                        </div>
                      )}
                    </Block>
                  </div>
                );
              })}
            </List>
          )}

          <InfoBlock
            className={"mx-4 scale-in"}
            variant={"blue"}
            message={"Заявка активна 60 минут. После этого её можно обновить или удалить."}
            icon={"⏱️"}
          />

        </Block>

      </AppPage>
    </PageTransition>
  )
}

export default CustomerPage
