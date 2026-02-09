"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Block, BlockTitle, Checkbox, ListItem } from "konsta/react";
import { AppPage, AppNavbar, AppList, InfoBlock, Select, PageTransition } from "@/src/components";
import { CATEGORIES } from "@/src/data/categories";
import { CITIES } from "@/src/data/cities";
import { updatePreferences, updateNotificationSettings } from "@/lib/api";
import {
  useTelegramBackButton,
  useTelegramMainButton,
  useHaptic,
  useClosingConfirmation,
} from "@/src/hooks/useTelegram";
import { useToast } from "@/hooks/useToast";

const FREQUENCY_OPTIONS = [
  { value: "5", label: "Каждые 5 мин" },
  { value: "10", label: "Каждые 10 мин" },
];

export default function ExecutorPreferencesPage() {
  const router = useRouter();
  const { notification, selection } = useHaptic();
  const toast = useToast();
  useTelegramBackButton("/profile");

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set());
  const [frequency, setFrequency] = useState("5");
  const [saving, setSaving] = useState(false);

  const isDirty = selectedCategories.size > 0 || selectedCities.size > 0;
  useClosingConfirmation(isDirty);

  const toggleCategory = useCallback((cat: string) => {
    selection();
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, [selection]);

  const toggleCity = useCallback((city: string) => {
    selection();
    setSelectedCities((prev) => {
      const next = new Set(prev);
      if (next.has(city)) next.delete(city);
      else next.add(city);
      return next;
    });
  }, [selection]);

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
      notification("success");
      router.push("/orders");
    } catch {
      toast.error("Не удалось сохранить настройки. Попробуйте позже.");
    } finally {
      setSaving(false);
    }
  }, [saving, selectedCategories, selectedCities, frequency, notification, router, toast]);

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
            <AppList>
              {CITIES.map((city) => (
                <ListItem
                  key={city}
                  label
                  title={city}
                  media={
                    <Checkbox
                      checked={selectedCities.has(city)}
                      onChange={() => toggleCity(city)}
                    />
                  }
                />
              ))}
            </AppList>
          </div>

          <BlockTitle className="card-appear-delayed" style={{ animationDelay: "0.1s" }}>
            Частота уведомлений
          </BlockTitle>
          <Block className="my-0 card-appear-delayed" style={{ animationDelay: "0.1s" }} strong inset>
            <Select
              value={frequency}
              onChangeAction={setFrequency}
              options={FREQUENCY_OPTIONS}
              placeholder="Выберите частоту"
              name="frequency"
              className="w-full"
            />
          </Block>

          <InfoBlock
            className="mx-4 card-appear-delayed"
            variant="blue"
            icon="💡"
            message="Выберите категории и города, чтобы получать уведомления о новых заказах."
          />
        </Block>

        <toast.Toast />
      </AppPage>
    </PageTransition>
  );
}
