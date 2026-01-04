"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Page,
  Navbar,
  Block,
  BlockTitle,
  List,
} from "konsta/react";

export default function Home() {
  const router = useRouter();

  return (
    <Page className="min-h-screen bg-[#F2F2F7] flex flex-col">
      <Navbar className="bg-white border-b border-[#C6C6C8] px-4 py-3" title="Срочные услуги" />

      <Block className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto bg-[#007AFF] rounded-3xl flex items-center justify-center mb-4">
            <span className="text-5xl">⚡</span>
          </div>
          <h2 className="text-2xl mb-2">60 минут</h2>
          <p className="text-[#8E8E93]">Закроем ваш заказ за час</p>
        </div>

        <BlockTitle>Выбрать роль</BlockTitle>

        <List className="w-full max-w-md space-y-4">
          <Block
            onClick={() => router.push("/customer")}
            className="w-full bg-white border border-[#C6C6C8] rounded-xl p-4 my-4 text-left active:bg-[#E5E5EA] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg mb-1">Я заказчик</div>
                <div className="text-sm text-[#8E8E93]">Создать заявку бесплатно</div>
              </div>
              <div className="text-2xl">📋</div>
            </div>
          </Block>

          <Block
            onClick={() => router.push('/executor')}
            className="w-full bg-white border border-[#C6C6C8] rounded-xl p-4 my-4 text-left active:bg-[#E5E5EA] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg mb-1">Я исполнитель</div>
                <div className="text-sm text-[#8E8E93]">Смотреть срочные заказы</div>
              </div>
              <div className="text-2xl">🔧</div>
            </div>
          </Block>
        </List>
      </Block>
    </Page>
  );
}