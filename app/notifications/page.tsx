"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Block, BlockTitle, Checkbox, ListItem, Toggle } from "konsta/react";
import { AppPage, AppNavbar, AppList, InfoBlock, Select, PageTransition } from "@/src/components";
import { CATEGORIES } from "@/src/data/categories";
import { CITIES } from "@/src/data/cities";
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

  const toggleCity = useCallback((city: string) => {
    setSelectedCities((prev) => {
      const next = new Set(prev);
      if (next.has(city)) next.delete(city);
      else next.add(city);
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
    if (!enabled) return true; // can always save "disabled" state
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
