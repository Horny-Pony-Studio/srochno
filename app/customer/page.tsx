"use client"

import { useCallback } from "react";
import { Block, List, Button, Chip, Preloader } from "konsta/react";
import { Edit2, Trash2 } from 'lucide-react';
import { takenCount } from "@/src/utils/order";
import { useRouter } from "next/navigation";
import { AppPage, InfoBlock, AppNavbar, OrderTimerChip, PageTransition } from "@/src/components";
import { useTelegramBackButton, useTelegramMainButton, useTelegramConfirm, useHaptic } from "@/src/hooks/useTelegram";
import { useMyOrders, useDeleteOrder } from "@/hooks/useOrders";

function CustomerPage() {
  const router = useRouter();
  useTelegramBackButton('/');
  const { notification } = useHaptic();
  const confirm = useTelegramConfirm();

  const { data: orders, isLoading, isError } = useMyOrders();
  const deleteMut = useDeleteOrder();

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

    deleteMut.mutate(orderId, {
      onSuccess: () => {
        notification('success');
      },
      onError: () => {
        notification('error');
      },
    });
  }, [confirm, deleteMut, notification]);

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
            />
          ) : !orders || orders.length === 0 ? (
            <div className="text-center py-20 scale-in">
              <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110">
                <span className="text-4xl">📋</span>
              </div>
              <p className="opacity-55 mb-1">У вас пока нет заявок</p>
              <p className="text-sm opacity-55">Создайте первую заявку</p>
            </div>
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
                        <Button
                          rounded
                          outline
                          disabled={!canModify || deleteMut.isPending}
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
                          disabled={!canModify || deleteMut.isPending}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteOrder(order.id);
                          }}
                          className={"flex-1 justify-center k-color-brand-red transition-all duration-200"}
                        >
                          <Trash2 className="w-4 h-4"/>
                          <span className="text-sm">Удалить</span>
                        </Button>
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
