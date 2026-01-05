"use client"

import React, { useState } from "react";
import {Block, Button, Checkbox, ListItem} from "konsta/react";
import {AppList, AppListInput, Select, InfoBlock, AppPage} from "@/src/components";
import {CATEGORIES, CITIES} from "@/src/data";
import {Plus} from "lucide-react";

export default function CreateOrderPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState<string>("");
  const [city, setCity] = useState<string>("");

  const toggleGroupValue = (value: string) => {
    setSelectedCategory(value);
  };

  return (
    <AppPage title="Создать заявку"  className={"min-h-screen bg-[#F2F2F7] flex flex-col"}>

      <Block className="flex-1 flex flex-col gap-4 pb-16 my-4 pl-0! pr-0!">
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

        <AppList>
          <AppListInput
            type={"text"}
            labelText={"Контакт"}
            placeholder={"Telegram или телефон или MAX для связи"}
          />
        </AppList>

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

        <InfoBlock
          className={"mx-4"}
          variant={"blue"}
          message={"Заявка будет активна 60 минут. После этого её можно обновить или удалить."}
          icon={"⏱️"}
        />

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#C6C6C8] px-4 py-3 safe-area-bottom z-50 pointer-events-auto">
          <Button
            type="button"
            large
            rounded
            className="w-full flex items-center justify-center gap-2"
            onClick={() => {}}
          >
            <Plus className="w-5 h-5" />
            <span>Создать</span>
          </Button>
        </div>
      </Block>
    </AppPage>
  );
}