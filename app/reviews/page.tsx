"use client";

import React, { useState } from "react";
import { Block, Chip, ListItem, Preloader } from "konsta/react";
import { Star } from "lucide-react";
import { AppList, AppNavbar, AppPage, InfoBlock, PageTransition } from "@/src/components";
import { useTelegramBackButton } from "@/src/hooks/useTelegram";
import { useReviews } from "@/src/hooks/useReviews";

function formatDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function getInitials(name: string) {
  const parts = name.split(" ");
  return parts.map((p) => p[0] ?? "").join("").toUpperCase().slice(0, 2);
}

type FilterTab = "all" | 5 | 4 | 3;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "Все" },
  { key: 5, label: "5★" },
  { key: 4, label: "4★" },
  { key: 3, label: "3★" },
];

export default function ReviewsPage() {
  useTelegramBackButton('/profile');
  const [tab, setTab] = useState<FilterTab>("all");

  const ratingFilter = tab === "all" ? undefined : tab;
  const { data: reviews, isLoading, isError } = useReviews(
    ratingFilter != null ? { rating: ratingFilter } : undefined,
  );

  return (
    <PageTransition>
      <AppPage className="min-h-dvh flex flex-col">
        <AppNavbar title="Отзывы" showRight />

        <Block className="my-4 pl-0! pr-0!">
          <div className="px-4 overflow-x-auto hide-scrollbar scroll-hint-right">
            <div className="flex gap-2 w-max pr-4">
              {FILTER_TABS.map((f) => (
                <Chip
                  key={String(f.key)}
                  component="button"
                  onClick={() => setTab(f.key)}
                  className={
                    `text-base p-3 transition-all duration-200
                    ${tab === f.key
                      ? "bg-primary text-white"
                      : "bg-transparent text-primary border border-primary"}`
                  }
                >
                  {f.label}
                </Chip>
              ))}
            </div>
          </div>
        </Block>

        <Block className="flex-1 pb-20 my-0 pl-0! pr-0! flex flex-col gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Preloader className="text-primary" />
            </div>
          ) : isError ? (
            <InfoBlock
              className="mx-4"
              variant="red"
              icon="⚠️"
              message="Не удалось загрузить отзывы. Попробуйте позже."
            />
          ) : !reviews || reviews.length === 0 ? (
            <InfoBlock
              className="mx-4 scale-in"
              variant="blue"
              icon="⭐"
              message="Пока нет отзывов с таким рейтингом."
            />
          ) : (
            <>
              <div className="card-appear">
                <AppList>
                  <ListItem title="Всего" after={reviews.length} />
                </AppList>
              </div>

              {reviews.map((r, index) => (
                <div key={r.id} className="stagger-item" style={{ animationDelay: `${index * 0.05}s` }}>
                  <Block className="my-0 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]" strong inset>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm shrink-0 transition-transform duration-300 hover:scale-110">
                        {getInitials(r.authorName)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="font-medium truncate">{r.authorName}</div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Star className="w-4 h-4 text-[#FF9500] fill-[#FF9500]" />
                            <span className="text-sm">{r.rating}</span>
                          </div>
                        </div>

                        <div className="text-sm opacity-55 mb-2">
                          {r.category} • {formatDate(r.createdAt)}
                        </div>

                        {r.comment && (
                          <p className="text-sm leading-relaxed">{r.comment}</p>
                        )}
                      </div>
                    </div>
                  </Block>
                </div>
              ))}
            </>
          )}
        </Block>
      </AppPage>
    </PageTransition>
  );
}
