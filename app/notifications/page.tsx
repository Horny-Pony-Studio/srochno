"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Block, BlockTitle, Chip, ListItem, Toggle } from "konsta/react";
import { AppPage, AppNavbar, AppList, InfoBlock, SearchableSelect, Select, PageTransition } from "@/src/components";
import { CATEGORIES } from "@/src/data/categories";
import { useCities } from "@/hooks/useCities";
import { updatePreferences, updateNotificationSettings } from "@/lib/api";
import {
  useTelegramBackButton,
  useTelegramMainButton,
  useClosingConfirmation,
} from "@/src/hooks/useTelegram";
import { useToast } from "@/hooks/useToast";

const FREQUENCY_OPTIONS = [
  { value: "5", label: "Каждые 5 мин" },
  { value: "10", label: "Каждые 10 мин" },
];

export default function NotificationSettingsPage() {
  const router = useRouter();
  const toast = useToast();
  useTelegramBackButton("/profile");

  const [enabled, setEnabled] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set());
  const [frequency, setFrequency] = useState("5");
  const [saving, setSaving] = useState(false);
  const { data: cities = [], isLoading: isCitiesLoading } = useCities();

  const availableCities = useMemo(
    () => cities.filter((c) => !selectedCities.has(c)),
    [cities, selectedCities],
  );

  const isDirty = enabled || selectedCategories.size > 0 || selectedCities.size > 0;
  useClosingConfirmation(isDirty);

  const toggleCategory = useCallback((cat: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  const addCity = useCallback((city: string) => {
    if (!city) return;
    setSelectedCities((prev) => new Set(prev).add(city));
  }, []);

  const removeCity = useCallback((city: string) => {
    setSelectedCities((prev) => {
      const next = new Set(prev);
      next.delete(city);
      return next;
    });
  }, []);

  // Ref for stable handleSave — avoids re-creating on every toggle/selection change
  const formRef = useRef({ enabled, selectedCategories, selectedCities, frequency });
  useEffect(() => {
    formRef.current = { enabled, selectedCategories, selectedCities, frequency };
  });

  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);

    const { enabled, selectedCategories, selectedCities, frequency } = formRef.current;

    try {
      const promises: Promise<unknown>[] = [
        updateNotificationSettings({
          enabled,
          frequency: Number(frequency),
        }),
      ];

      if (enabled) {
        promises.push(
          updatePreferences({
            categories: Array.from(selectedCategories),
            cities: Array.from(selectedCities),
          }),
        );
      }

      await Promise.all(promises);
      toast.success("Настройки сохранены");
      router.push("/profile");
    } catch {
      toast.error("Не удалось сохранить настройки. Попробуйте позже.");
    } finally {
      setSaving(false);
    }
  }, [saving, router, toast]);

  const canSave = useMemo(() => {
    if (!enabled) return true;
    return selectedCategories.size > 0 && selectedCities.size > 0;
  }, [enabled, selectedCategories.size, selectedCities.size]);

  useTelegramMainButton("Сохранить", handleSave, {
    isEnabled: canSave && !saving,
    isLoading: saving,
  });

  return (
    <PageTransition>
      <AppPage className="min-h-dvh flex flex-col">
        <AppNavbar title="Уведомления" />

        <Block className="flex-1 flex flex-col gap-4 pb-24 my-4 pl-0! pr-0!">
          {/* Master toggle */}
          <div className="card-appear">
            <AppList>
              <ListItem
                title="Получать уведомления"
                after={
                  <Toggle
                    checked={enabled}
                    onChange={() => setEnabled((prev) => !prev)}
                  />
                }
              />
            </AppList>
          </div>

          {!enabled && (
            <InfoBlock
              className="mx-4 card-appear"
              variant="blue"
              icon="🔕"
              message="Уведомления отключены. Включите, чтобы настроить категории, города и частоту."
            />
          )}

          {enabled && (
            <>
              <BlockTitle className="card-appear">Категории</BlockTitle>
              <div className="card-appear">
                <Block strong inset className="my-0">
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => {
                      const isSelected = selectedCategories.has(cat);
                      return (
                        <Chip
                          key={cat}
                          outline={!isSelected}
                          onClick={() => toggleCategory(cat)}
                          className={`transition-all duration-200 active:scale-95 ${
                            isSelected ? 'bg-primary text-white' : ''
                          }`}
                          colors={isSelected ? {
                            fillBgIos: 'bg-primary',
                            fillTextIos: 'text-white',
                          } : undefined}
                        >
                          {cat}
                        </Chip>
                      );
                    })}
                  </div>
                </Block>
              </div>

              <BlockTitle className="card-appear-delayed">Города</BlockTitle>
              <div className="card-appear-delayed">
                <Block strong inset className="my-0">
                  {selectedCities.size > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {Array.from(selectedCities).map((city) => (
                        <Chip
                          key={city}
                          deleteButton
                          onDelete={() => removeCity(city)}
                          className="scale-in"
                        >
                          {city}
                        </Chip>
                      ))}
                    </div>
                  )}

                  <SearchableSelect
                    value=""
                    onSelect={addCity}
                    options={availableCities}
                    placeholder="Добавить город"
                    label="Добавить город"
                    isLoading={isCitiesLoading}
                    className="w-full justify-center gap-2 py-2 rounded-xl bg-black/5 dark:bg-white/10 active:opacity-60 opacity-100!"
                  />
                </Block>
              </div>

              <BlockTitle className="card-appear-delayed" style={{ animationDelay: "0.1s" }}>
                Частота уведомлений
              </BlockTitle>
              <div className="card-appear-delayed" style={{ animationDelay: "0.1s" }}>
                <Block strong inset className={"my-0"}>
                  <Select
                    value={frequency}
                    onChangeAction={setFrequency}
                    options={FREQUENCY_OPTIONS}
                    placeholder="Выберите частоту"
                    name="frequency"
                    className="w-full"
                  />
                </Block>
              </div>

              <InfoBlock
                className="mx-4 card-appear-delayed"
                variant="blue"
                icon="💡"
                message="Выберите категории и города, чтобы получать уведомления о новых заказах."
              />
            </>
          )}
        </Block>

      </AppPage>
    </PageTransition>
  );
}
