"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Block, BlockTitle, Checkbox, Chip, ListItem } from "konsta/react";
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

export default function ExecutorPreferencesPage() {
  const router = useRouter();
  const toast = useToast();
  useTelegramBackButton("/profile");

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set());
  const [frequency, setFrequency] = useState("5");
  const [saving, setSaving] = useState(false);
  const { data: cities = [], isLoading: isCitiesLoading } = useCities();

  const availableCities = useMemo(
    () => cities.filter((c) => !selectedCities.has(c)),
    [cities, selectedCities],
  );

  const isDirty = selectedCategories.size > 0 || selectedCities.size > 0;
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

  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);

    try {
      await Promise.all([
        updatePreferences({
          categories: Array.from(selectedCategories),
          cities: Array.from(selectedCities),
        }),
        updateNotificationSettings({
          frequency: Number(frequency),
        }),
      ]);
      router.push("/orders");
    } catch {
      toast.error("Не удалось сохранить настройки. Попробуйте позже.");
    } finally {
      setSaving(false);
    }
  }, [saving, selectedCategories, selectedCities, frequency, router, toast]);

  const canSave = useMemo(
    () => selectedCategories.size > 0 && selectedCities.size > 0,
    [selectedCategories.size, selectedCities.size],
  );

  useTelegramMainButton("Сохранить", handleSave, {
    isEnabled: canSave && !saving,
    isLoading: saving,
  });

  return (
    <PageTransition>
      <AppPage className="min-h-dvh flex flex-col">
        <AppNavbar title="Мои подписки" />

        <Block className="flex-1 flex flex-col gap-4 pb-24 my-4 pl-0! pr-0!">
          <BlockTitle className="card-appear">Категории</BlockTitle>
          <div className="card-appear">
            <AppList>
              {CATEGORIES.map((cat) => (
                <ListItem
                  key={cat}
                  label
                  title={cat}
                  media={
                    <Checkbox
                      checked={selectedCategories.has(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                  }
                />
              ))}
            </AppList>
          </div>

          <BlockTitle className="card-appear-delayed">Города</BlockTitle>
          <div className="card-appear-delayed">
            <Block strong inset className="my-0">
              {/* Selected cities as chips */}
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

              {/* Add city trigger */}
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
        </Block>

      </AppPage>
    </PageTransition>
  );
}
