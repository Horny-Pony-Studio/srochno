"use client"

import {useState} from "react";
import {Block, List, Page, Button } from "konsta/react";
import { Plus, Edit2, Trash2 } from 'lucide-react';
import {Order} from "@/src/models/Order";
import {getTimeBackground, getTimeColor} from "@/src/utils/time";
import {useRouter} from "next/navigation";
import {AppNavbar} from "@/src/components";

const createdAt = new Date(Date.now() - 8 * 60000);

export default function CustomerPage () {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      category: 'Сантехника',
      description: 'Течет кран на кухне. Район Центральный, ул. Ленина 45.',
      city: 'Москва',
      contact: '@ivan_petrov',
      timeLeft: 52,
      takenCount: 1,
      createdAt: createdAt,
      canEdit: false
    }
  ]);

  const onCreateOrder = () => {}
  const onEditOrder = (orderId: string) => {}
  const onDeleteOrder = (orderId: string) => {}

  return (
    <Page className={"min-h-screen bg-[#F2F2F7] flex flex-col"}>
      <AppNavbar title="Мои заявки" />

      <Block className="flex-1 overflow-auto px-4 py-4 flex flex-col gap-y-4 my-0">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto bg-[#E5E5EA] rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">📋</span>
            </div>
            <p className="text-[#8E8E93] mb-1">У вас пока нет заявок</p>
            <p className="text-sm text-[#8E8E93]">Создайте первую заявку</p>
          </div>
        ) : (
          <List className={"my-0"}>
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl p-4 border border-[#C6C6C8]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-sm text-[#8E8E93] mb-1">{order.category}</div>
                    <div className="text-xs text-[#8E8E93]">{order.city}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${getTimeBackground(order.timeLeft)}`}>
                    <span className={`text-sm ${getTimeColor(order.timeLeft)}`}>
                      ⏱️ {order.timeLeft} мин
                    </span>
                  </div>
                </div>

                <p className="mb-3 line-clamp-2">
                  {order.description}
                </p>

                <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#C6C6C8]">
                  <span className="text-sm text-[#8E8E93]">Откликов</span>
                  <span className={order.takenCount >= 3 ? 'text-[#34C759]' : ''}>
                    {order.takenCount}/3
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    rounded
                    outline
                    disabled={!order.canEdit}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditOrder(order.id);
                    }}
                    className={"flex-1 justify-center k-color-brand-yellow"}
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="text-sm">Изменить</span>
                  </Button>
                  <Button
                    rounded
                    outline
                    color="red"
                    disabled={!order.canEdit}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteOrder(order.id);
                    }}
                    className={"flex-1 justify-center k-color-brand-red"}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">Удалить</span>
                  </Button>
                </div>

                {!order.canEdit && order.takenCount > 0 && (
                  <div className="mt-2 text-xs text-[#8E8E93] text-center">
                    Редактирование недоступно после взятия исполнителем
                  </div>
                )}
              </div>
            ))}
          </List>
        )}

        <div className="bg-[#E5F8ED] rounded-xl p-4 border border-[#34C759]">
          <p className="text-sm text-[#34C759]">
            💡 Заявка активна 60 минут. После этого её можно обновить или удалить.
          </p>
        </div>
      </Block>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#C6C6C8] px-4 py-3 safe-area-bottom z-50 pointer-events-auto">
        <Button
          type="button"
          large
          rounded
          className="w-full flex items-center justify-center gap-2"
          onClick={() => router.push('/create-order')}
        >
          <Plus className="w-5 h-5" />
          <span>Создать</span>
        </Button>
      </div>
    </Page>
  )
}