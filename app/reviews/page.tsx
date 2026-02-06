"use client";

import React, { useMemo, useState } from "react";
import {Block, ListItem} from "konsta/react";
import { Star } from "lucide-react";
import {AppList, AppNavbar, AppPage, InfoBlock, PageTransition} from "@/src/components";

type Review = {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  category: string;
  createdAt: string;
};

const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    authorName: "Мария К.",
    rating: 5,
    comment: "Отличная работа! Быстро приехал, всё починил за 20 минут. Рекомендую.",
    category: "Сантехника",
    createdAt: new Date(Date.now() - 2 * 86400_000).toISOString(),
  },
  {
    id: "r2",
    authorName: "Андрей В.",
    rating: 4,
    comment: "Хороший специалист, но немного задержался. В целом доволен результатом.",
    category: "Электрика",
    createdAt: new Date(Date.now() - 5 * 86400_000).toISOString(),
  },
  {
    id: "r3",
    authorName: "Светлана Д.",
    rating: 5,
    comment: "Профессионал! Собрал шкаф аккуратно, без царапин. Спасибо!",
    category: "Сборка/установка",
    createdAt: new Date(Date.now() - 7 * 86400_000).toISOString(),
  },
  {
    id: "r4",
    authorName: "Игорь М.",
    rating: 3,
    comment: "Работу выполнил, но качество среднее. Пришлось доделывать самому.",
    category: "Бытовой ремонт",
    createdAt: new Date(Date.now() - 10 * 86400_000).toISOString(),
  },
  {
    id: "r5",
    authorName: "Елена П.",
    rating: 5,
    comment: "Супер! Очень довольна уборкой, всё блестит. Буду обращаться ещё.",
    category: "Клининг",
    createdAt: new Date(Date.now() - 12 * 86400_000).toISOString(),
  },
];

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

export default function ReviewsPage() {
  const [tab, setTab] = useState<FilterTab>("all");

  const items = useMemo(() => {
    if (tab === "all") return MOCK_REVIEWS;
    return MOCK_REVIEWS.filter((r) => r.rating === tab);
  }, [tab]);

  return (
    <PageTransition>
      <AppPage className="min-h-dvh flex flex-col">
        <AppNavbar title="Отзывы" showRight />

        <Block className="flex-1 pb-20 my-4 pl-0! pr-0! flex flex-col gap-4">
          {items.length === 0 ? (
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
                  <ListItem title={"Всего"} after={items.length}/>
                </AppList>
              </div>

              {items.map((r, index) => (
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

                        <p className="text-sm leading-relaxed">{r.comment}</p>
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
