"use client"

import React, { useState, useCallback } from "react";
import {Block, Checkbox, ListItem} from "konsta/react";
import {AppList, AppListInput, Select, InfoBlock, AppPage, AppNavbar, PageTransition} from "@/src/components";
import {CATEGORIES, CITIES} from "@/src/data";
import { useTelegramBackButton, useTelegramMainButton, useClosingConfirmation } from "@/src/hooks/useTelegram";

export default function CreateOrderPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState<string>("");
  const [city, setCity] = useState<string>("");

  useTelegramBackButton('/customer');

  const hasUnsavedData = description.length > 0 || city.length > 0;
  useClosingConfirmation(hasUnsavedData);

  const handleCreate = useCallback(() => {
    // TODO: submit order
  }, []);
  useTelegramMainButton('Создать', handleCreate);

  const toggleGroupValue = (value: string) => {
    setSelectedCategory(value);
  };

  return (
    <PageTransition>
      <AppPage className={"min-h-screen flex flex-col"}>
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

        </Block>
      </AppPage>
    </PageTransition>
  );
}