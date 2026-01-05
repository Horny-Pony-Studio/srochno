"use client"

import {useState} from "react";
import {Block, List, Button, Chip} from "konsta/react";
import { Plus, Edit2, Trash2 } from 'lucide-react';
import {Order} from "@/src/models/Order";
import {getTimeBackground, getTimeColor} from "@/src/utils/time";
import {useRouter} from "next/navigation";
import {AppPage, InfoBlock} from "@/src/components";

const createdAt = new Date(Date.now() - 8 * 60000);

function CustomerPage() {
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

  const onCreateOrder = () => {
  }
  const onEditOrder = (orderId: string) => {
  }
  const onDeleteOrder = (orderId: string) => {
  }

  return (
    <AppPage title="Мои заявки" className={"min-h-screen bg-[#F2F2F7] flex flex-col"}>
      <Block className="flex-1 flex flex-col gap-4 pb-16 my-4 pl-0! pr-0!">
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
              <Block
                className={"my-0"}
                strong inset
                key={order.id}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-sm text-[#8E8E93] mb-1">{order.category}</div>
                    <div className="text-xs text-[#8E8E93]">{order.city}</div>
                  </div>
                  <Chip
                    colors={{
                      fillBgIos: getTimeBackground(order.timeLeft),
                      fillTextIos: getTimeColor(order.timeLeft),
                    }}
                    className="text-sm"
                  >
                    ⏱️ {order.timeLeft} мин
                  </Chip>
                </div>

                <p className="mb-3 line-clamp-2">
                  {order.description}
                </p>

                <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#C6C6C8]">
                  <span className="text-sm text-[#8E8E93]">Откликов</span>
                  <Chip className={order.takenCount >= 3 ? 'text-[#34C759]' : ''}>
                    {order.takenCount}/3
                  </Chip>
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
                    <Edit2 className="w-4 h-4"/>
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
                    <Trash2 className="w-4 h-4"/>
                    <span className="text-sm">Удалить</span>
                  </Button>
                </div>

                {!order.canEdit && order.takenCount > 0 && (
                  <div className="mt-2 text-xs text-[#8E8E93] text-center">
                    Редактирование недоступно после взятия исполнителем
                  </div>
                )}
              </Block>
            ))}
          </List>
        )}

        <InfoBlock
          className={"mx-4"}
          variant={"blue"}
          message={"Заявка активна 60 минут. После этого её можно обновить или удалить."}
          icon={"⏱️"}
        />

        <div
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#C6C6C8] px-4 py-3 safe-area-bottom z-50 pointer-events-auto">
          <Button
            type="button"
            large
            rounded
            className="w-full flex items-center justify-center gap-2"
            onClick={() => router.push('/create-order')}
          >
            <Plus className="w-5 h-5"/>
            <span>Создать заявку</span>
          </Button>
        </div>
      </Block>

    </AppPage>
  )
}

export default CustomerPage