"use client"

import React, { Suspense, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Block, Checkbox, ListItem, Preloader } from "konsta/react";
import { AppList, AppListInput, Select, InfoBlock, AppPage, AppNavbar, PageTransition } from "@/src/components";
import { CATEGORIES, CITIES } from "@/src/data";
import { useTelegramBackButton, useTelegramMainButton, useClosingConfirmation, useHaptic } from "@/src/hooks/useTelegram";
import { useOrder, useCreateOrder, useUpdateOrder } from "@/hooks/useOrders";
import { createOrderSchema } from "@/src/lib/validation/order.schema";
import { useToast } from "@/hooks/useToast";

export default function CreateOrderPage() {
  return (
    <Suspense fallback={
      <AppPage className="min-h-screen flex flex-col">
        <AppNavbar showRight title="Загрузка..." />
        <div className="flex-1 flex items-center justify-center py-20">
          <Preloader className="text-primary" />
        </div>
      </AppPage>
    }>
      <CreateOrderContent />
    </Suspense>
  );
}

function CreateOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { notification } = useHaptic();
  const toast = useToast();

  const editId = searchParams.get('edit');
  const isEditMode = !!editId;

  const { data: existingOrder, isLoading: isLoadingOrder } = useOrder(editId ?? undefined);

  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");

  // Sync form state when existing order loads (React "adjust state during render" pattern)
  const [syncedOrderId, setSyncedOrderId] = useState<string | null>(null);
  if (isEditMode && existingOrder && existingOrder.id !== syncedOrderId) {
    setSyncedOrderId(existingOrder.id);
    setSelectedCategory(existingOrder.category);
    setDescription(existingOrder.description);
    setCity(existingOrder.city);
    setContact(existingOrder.contact);
  }

  useTelegramBackButton('/customer');

  const hasUnsavedData = description.length > 0 || city.length > 0 || contact.length > 0;
  useClosingConfirmation(hasUnsavedData);

  const createMut = useCreateOrder();
  const updateMut = useUpdateOrder();
  const isPending = createMut.isPending || updateMut.isPending;

  const handleSubmit = useCallback(() => {
    const data = {
      category: selectedCategory,
      description,
      city,
      contact,
    };

    const result = createOrderSchema.safeParse(data);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message ?? 'Проверьте данные формы';
      toast.error(firstError);
      return;
    }

    if (isEditMode && editId) {
      updateMut.mutate(
        {
          id: editId,
          data: {
            category: selectedCategory,
            description,
            contact,
          },
        },
        {
          onSuccess: () => {
            notification('success');
            router.push('/customer');
          },
          onError: () => {
            toast.error('Не удалось сохранить изменения. Попробуйте позже.');
          },
        },
      );
    } else {
      createMut.mutate(data, {
        onSuccess: () => {
          notification('success');
          router.push('/customer');
        },
        onError: () => {
          toast.error('Не удалось создать заявку. Попробуйте позже.');
        },
      });
    }
  }, [selectedCategory, description, city, contact, isEditMode, editId, createMut, updateMut, notification, router, toast]);

  const mainButtonText = isEditMode ? 'Сохранить' : 'Создать';
  useTelegramMainButton(mainButtonText, handleSubmit, {
    isEnabled: !isPending,
    isLoading: isPending,
  });

  const toggleGroupValue = (value: string) => {
    setSelectedCategory(value);
  };

  if (isEditMode && isLoadingOrder) {
    return (
      <AppPage className="min-h-screen flex flex-col">
        <AppNavbar showRight title="Редактирование" />
        <div className="flex-1 flex items-center justify-center py-20">
          <Preloader className="text-primary" />
        </div>
      </AppPage>
    );
  }

  const navTitle = isEditMode ? 'Редактировать заявку' : 'Создать заявку';

  return (
    <PageTransition>
      <AppPage className={"min-h-screen flex flex-col"}>
        <AppNavbar showRight title={navTitle} />

        <Block className="flex-1 flex flex-col gap-4 pb-16 my-4 pl-0! pr-0!">
          <div className="card-appear">
            <AppList>
              {CATEGORIES.map((category: string) => (
                <ListItem
                  label
                  title={category}
                  key={category}
                  media={
                    <Checkbox
                      component="div"
                      name="categories-Checkbox"
                      checked={selectedCategory.includes(category)}
                      onChange={() => toggleGroupValue(category)}
                    />
                  }
                />
              ))}
            </AppList>
          </div>

          <div className="card-appear-delayed">
            <AppList>
              <AppListInput
                inputClassName={"h-28"}
                type={"textarea"}
                labelText={"Описание"}
                placeholder={"Укажите район, ориентиры, что нужно сделать, степень срочности..."}
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                  setDescription(e.target.value)
                }
              />
            </AppList>
          </div>

          <div className="card-appear-delayed" style={{ animationDelay: '0.15s' }}>
            <AppList>
              <AppListInput
                type={"text"}
                labelText={"Контакт"}
                placeholder={"Telegram (@username) или телефон"}
                value={contact}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                  setContact(e.target.value)
                }
              />
            </AppList>
          </div>

          <div className="card-appear-delayed" style={{ animationDelay: '0.2s' }}>
            <AppList>
              <ListItem
                label
                title={<span className={"text-sm"}>Город</span>}
                after={
                  <Select
                    value={city}
                    onChangeAction={setCity}
                    options={CITIES}
                    placeholder="Выберите город"
                    className="w-40"
                    disabled={isEditMode}
                  />
                }
              />
            </AppList>
          </div>

          <InfoBlock
            className={"mx-4 scale-in"}
            variant={"blue"}
            message={isEditMode
              ? "При редактировании город изменить нельзя. Таймер не сбрасывается."
              : "Заявка будет активна 60 минут. После этого её можно обновить или удалить."
            }
            icon={"⏱️"}
          />

        </Block>

      </AppPage>
    </PageTransition>
  );
}
