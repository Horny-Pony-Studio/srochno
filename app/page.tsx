"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Page,
  Block,
  BlockTitle,
  List,
} from "konsta/react";
import {AppNavbar, PageTransition} from "@/src/components";
import { useHideBackButton, useTelegram } from "@/src/hooks/useTelegram";

/**
 * Parse Telegram startParam for deep linking.
 * Supported formats: "order_<id>" → /orders/<id>
 */
function resolveDeepLink(startParam: string | undefined): string | null {
  if (!startParam) return null;

  const orderMatch = startParam.match(/^order_(.+)$/);
  if (orderMatch) return `/orders/${orderMatch[1]}`;

  return null;
}

export default function Home() {
  const router = useRouter();
  useHideBackButton();
  const { startParam } = useTelegram();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    const target = resolveDeepLink(startParam);
    if (target) {
      handledRef.current = true;
      router.replace(target);
    }
  }, [startParam, router]);

  return (
    <PageTransition>
      <Page>
        <AppNavbar title="Срочные услуги" showRight />

        {process.env.NEXT_PUBLIC_API_URL?.includes('localhost') && (
          <div className="bg-yellow-500 text-black text-center text-xs font-bold py-1">
            DEV
          </div>
        )}

        <Block className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
          <div className="text-center mb-8 card-appear">
            <div className="w-24 h-24 mx-auto bg-primary rounded-3xl flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110">
              <span className="text-5xl">⚡</span>
            </div>
            <h2 className="text-2xl mb-2">60 минут</h2>
            <p className="opacity-55">Закроем ваш заказ за час</p>
          </div>

          <BlockTitle className="mb-4">Выбрать роль</BlockTitle>

          <List className="w-full max-w-md">
            <Block
              onClick={() => router.push('/customer')}
              strong
              inset
              className="my-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] card-appear-delayed"
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg mb-1">Я заказчик</div>
                  <div className="text-sm opacity-55">Создать заявку бесплатно</div>
                </div>
                <div className="text-2xl">📋</div>
              </div>
            </Block>

            <Block
              onClick={() => router.push('/orders')}
              strong
              inset
              className="my-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] card-appear-delayed"
              style={{ animationDelay: '0.15s' }}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg mb-1">Я исполнитель</div>
                  <div className="text-sm opacity-55">Смотреть срочные заказы</div>
                </div>
                <div className="text-2xl">🔧</div>
              </div>
            </Block>
          </List>
        </Block>
      </Page>
    </PageTransition>
  );
}
