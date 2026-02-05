"use client"

import React, { useState } from "react";
import {Block, Button, Checkbox, ListItem} from "konsta/react";
import {AppList, AppListInput, Select, InfoBlock, AppPage, AppNavbar, PageTransition} from "@/src/components";
import {CATEGORIES, CITIES} from "@/src/data";
import {Plus} from "lucide-react";
import { createOrder } from "@/src/lib/api";

export default function CreateOrderPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [amount, setAmount] = useState<string>("500");
  const [currency, setCurrency] = useState<string>("RUB");
  const [creating, setCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const toggleGroupValue = (value: string) => {
    setSelectedCategory(value);
  };

  const handleCreateOrder = async () => {
    setCreating(true);
    setError(null);
    setSuccess(false);

    try {
      const amountMinor = Math.round(parseFloat(amount) * 100);

      if (isNaN(amountMinor) || amountMinor <= 0) {
        setError("Введіть коректну суму");
        return;
      }

      await createOrder({ amount_minor: amountMinor, currency });

      setSuccess(true);
      setAmount("500");

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка при створенні замовлення");
    } finally {
      setCreating(false);
    }
  };

  return (
    <PageTransition>
      <AppPage className={"min-h-screen bg-[#F2F2F7] flex flex-col"}>
        <AppNavbar showRight title="Создать заявку" />

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
                placeholder={"Telegram или телефон или MAX для связи"}
              />
            </AppList>
          </div>

          <div className="card-appear-delayed" style={{ animationDelay: '0.2s' }}>
            <AppList>
              <AppListInput
                type={"number"}
                labelText={"Сума"}
                placeholder={"500"}
                value={amount}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                  setAmount(e.target.value)
                }
              />
            </AppList>
          </div>

          <div className="card-appear-delayed" style={{ animationDelay: '0.25s' }}>
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
                  />
                }
              />
            </AppList>
          </div>

          <InfoBlock
            className={"mx-4 scale-in"}
            variant={"blue"}
            message={"Заявка будет активна 60 минут. После этого её можно обновить или удалить."}
            icon={"⏱️"}
          />

          {error && (
            <InfoBlock
              className={"mx-4 scale-in"}
              variant={"red"}
              message={error}
              icon={"❌"}
            />
          )}

          {success && (
            <InfoBlock
              className={"mx-4 scale-in"}
              variant={"green"}
              message={"Замовлення успішно створено!"}
              icon={"✅"}
            />
          )}

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#C6C6C8] px-4 py-3 safe-area-bottom z-50 pointer-events-auto transition-transform duration-300">
            <Button
              type="button"
              large
              rounded
              disabled={creating}
              className="w-full flex items-center justify-center gap-2 transition-all duration-200"
              onClick={handleCreateOrder}
            >
              <Plus className="w-5 h-5" />
              <span>{creating ? "Создание..." : "Создать"}</span>
            </Button>
          </div>
        </Block>
      </AppPage>
    </PageTransition>
  );
}