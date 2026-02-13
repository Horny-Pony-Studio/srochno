"use client"

import React, { Suspense, useState, useCallback, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Block, Checkbox, ListItem, Preloader } from "konsta/react";
import { AppList, AppListInput, SearchableSelect, InfoBlock, AppPage, AppNavbar, PageTransition } from "@/src/components";
import { CATEGORIES } from "@/src/data";
import { useCities } from "@/hooks/useCities";
import { useTelegramBackButton, useTelegramMainButton, useClosingConfirmation } from "@/src/hooks/useTelegram";
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
  const toast = useToast();

  const editId = searchParams.get('edit');
  const isEditMode = !!editId;

  const { data: existingOrder, isLoading: isLoadingOrder } = useOrder(editId ?? undefined);
  const { data: cities = [], isLoading: isCitiesLoading } = useCities();

  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");

  // Ref for stable handleSubmit — avoids re-creating callback on every keystroke
  const formRef = useRef({ selectedCategory, description, city, contact });
  useEffect(() => {
    formRef.current = { selectedCategory, description, city, contact };
  });

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
    const { selectedCategory, description, city, contact } = formRef.current;
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
          router.push('/customer');
        },
        onError: () => {
          toast.error('Не удалось создать заявку. Попробуйте позже.');
        },
      });
    }
  }, [isEditMode, editId, createMut, updateMut, router, toast]);

  const mainButtonText = isEditMode ? 'Сохранить' : 'Создать';
  useTelegramMainButton(mainButtonText, handleSubmit, {
    isEnabled: !isPending,
    isLoading: isPending,
  });

  const toggleGroupValue = useCallback((value: string) => {
    setSelectedCategory(value);
  }, []);

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setDescription(e.target.value),
    []
  );

  const handleContactChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setContact(e.target.value),
    []
  );

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
                      checked={selectedCategory === category}
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
                onChange={handleDescriptionChange}
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
                onChange={handleContactChange}
              />
            </AppList>
          </div>

          <div className="card-appear-delayed" style={{ animationDelay: '0.2s' }}>
            <AppList>
              <ListItem
                label
                title={<span className={"text-sm"}>Город</span>}
                after={
                  <SearchableSelect
                    value={city}
                    onSelect={setCity}
                    options={cities}
                    placeholder="Выберите город"
                    label="Выберите город"
                    disabled={isEditMode && (existingOrder?.cityLocked ?? true)}
                    isLoading={isCitiesLoading}
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
