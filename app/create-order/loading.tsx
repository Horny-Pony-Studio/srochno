'use client';

import { Block } from "konsta/react";
import { AppNavbar, AppPage } from "@/src/components";

export default function CreateOrderLoading() {
  return (
    <AppPage>
      <AppNavbar title="Создать заявку" />
      <Block className="my-4 pl-0! pr-0! animate-pulse">
        <Block className="my-2" strong inset>
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        </Block>
        <Block className="my-2" strong inset>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
          <div className="h-28 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        </Block>
        <Block className="my-2" strong inset>
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        </Block>
      </Block>
    </AppPage>
  );
}
