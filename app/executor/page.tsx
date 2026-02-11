"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Block, BlockTitle, Checkbox, ListItem } from "konsta/react";
import { Search, X, MapPin } from "lucide-react";
import { AppPage, AppNavbar, AppList, InfoBlock, Select, PageTransition } from "@/src/components";
import { CATEGORIES } from "@/src/data/categories";
import { useCities } from "@/hooks/useCities";
import { updatePreferences, updateNotificationSettings } from "@/lib/api";
import {
  useTelegramBackButton,
  useTelegramMainButton,
  useClosingConfirmation,
} from "@/src/hooks/useTelegram";
import { useToast } from "@/hooks/useToast";

const TOP_CITIES = new Set([
  'Москва',
  'Санкт-Петербург',
  'Новосибирск',
  'Екатеринбург',
  'Казань',
  'Нижний Новгород',
  'Челябинск',
  'Самара',
  'Омск',
  'Ростов-на-Дону',
]);

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
  const [citySearch, setCitySearch] = useState("");
  const [frequency, setFrequency] = useState("5");
  const [saving, setSaving] = useState(false);
  const { data: cities = [] } = useCities();

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) {
      return cities.filter((c) => TOP_CITIES.has(c) || selectedCities.has(c));
    }
    const q = citySearch.trim().toLowerCase();
    return cities.filter((c) => c.toLowerCase().includes(q));
  }, [cities, citySearch, selectedCities]);

  const visibleCities = useMemo(() => filteredCities.slice(0, 50), [filteredCities]);

  const isCitySearching = citySearch.trim().length > 0;

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

  const toggleCity = useCallback((city: string) => {
    setSelectedCities((prev) => {
      const next = new Set(prev);
      if (next.has(city)) next.delete(city);
      else next.add(city);
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

          <BlockTitle className="card-appear-delayed">
            Города {selectedCities.size > 0 && `(${selectedCities.size})`}
          </BlockTitle>
          <div className="card-appear-delayed">
            {/* Search input */}
            <div className="px-4 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  placeholder="Поиск города..."
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-black/5 dark:bg-white/10 text-sm placeholder:opacity-40"
                />
                {isCitySearching && (
                  <button
                    type="button"
                    onClick={() => setCitySearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-black/10 dark:bg-white/20 active:opacity-60"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {!isCitySearching && (
              <div className="px-4 pb-1">
                <span className="text-xs uppercase tracking-wide opacity-40">
                  Популярные города
                </span>
              </div>
            )}

            <AppList>
              {visibleCities.length === 0 ? (
                <li className="flex flex-col items-center justify-center py-8 gap-2">
                  <MapPin className="w-8 h-8 opacity-20" />
                  <p className="text-sm opacity-40">Город не найден</p>
                </li>
              ) : (
                <>
                  {visibleCities.map((city) => (
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
                  {filteredCities.length > 50 && (
                    <ListItem
                      title={`Ещё ${filteredCities.length - 50} — уточните поиск`}
                      className="opacity-40 italic"
                    />
                  )}
                </>
              )}
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
        </Block>

      </AppPage>
    </PageTransition>
  );
}
