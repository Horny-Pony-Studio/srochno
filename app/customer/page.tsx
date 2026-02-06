"use client"

import {useState} from "react";
import {Block, List, Button, Chip} from "konsta/react";
import { Plus, Edit2, Trash2 } from 'lucide-react';
import {Order} from "@/src/models/Order";
import { minutesLeft, takenCount } from "@/src/utils/order";
import {getTimeBackground, getTimeColor} from "@/src/utils/time";
import {useRouter} from "next/navigation";
import {AppPage, InfoBlock, AppNavbar, PageTransition} from "@/src/components";

const createdAt = new Date(Date.now() - 8 * 60000).toISOString();

function CustomerPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      category: 'Сантехника',
      description: 'Течет кран на кухне. Район Центральный, ул. Ленина 45.',
      city: 'Москва',
      contact: '@ivan_petrov',
      createdAt: createdAt,
      expiresInMinutes: 60,
      status: 'active',
      takenBy: [{ executorId: 'exec_1', takenAt: createdAt }],
      cityLocked: true,
    }
  ]);

  const onCreateOrder = () => {
  }
  const onEditOrder = (orderId: string) => {
  }
  const onDeleteOrder = (orderId: string) => {
  }

  return (
    <PageTransition>
      <AppPage className={"min-h-screen flex flex-col"}>
        <AppNavbar title="Мои заявки" showRight />

        <Block className="flex-1 flex flex-col gap-4 pb-16 my-4 pl-0! pr-0!">
          {orders.length === 0 ? (
            <div className="text-center py-20 scale-in">
              <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110">
                <span className="text-4xl">📋</span>
              </div>
              <p className="opacity-55 mb-1">У вас пока нет заявок</p>
              <p className="text-sm opacity-55">Создайте первую заявку</p>
            </div>
          ) : (
            <List className={"my-0"}>
              {orders.map((order, index) => (
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
                  <Chip
                    colors={{
                      fillBgIos: getTimeBackground(minutesLeft(order)),
                      fillTextIos: getTimeColor(minutesLeft(order)),
                    }}
                    className="text-sm"
                  >
                    ⏱️ {minutesLeft(order)} мин
                  </Chip>
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
                    disabled={!(order.status === 'active' && order.takenBy.length === 0)}
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
                    disabled={!(order.status === 'active' && order.takenBy.length === 0)}
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

                {!(order.status === 'active' && order.takenBy.length === 0) && order.takenBy.length > 0 && (
                  <div className="mt-2 text-xs opacity-55 text-center">
                    Редактирование недоступно после взятия исполнителем
                  </div>
                )}
              </Block>
            </div>
            ))}
          </List>
        )}

        <InfoBlock
          className={"mx-4 scale-in"}
          variant={"blue"}
          message={"Заявка активна 60 минут. После этого её можно обновить или удалить."}
          icon={"⏱️"}
        />

        <div
          className="fixed bottom-0 left-0 right-0 bg-[--k-color-surface-1] border-t border-ios px-4 py-3 safe-area-bottom z-50 pointer-events-auto transition-transform duration-300">
          <Button
            type="button"
            large
            rounded
            className="w-full flex items-center justify-center gap-2 transition-all duration-200"
            onClick={() => router.push('/create-order')}
          >
            <Plus className="w-5 h-5"/>
            <span>Создать заявку</span>
          </Button>
        </div>
      </Block>

    </AppPage>
    </PageTransition>
  )
}

export default CustomerPage