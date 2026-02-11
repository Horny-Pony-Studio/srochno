'use client';

import { Block } from "konsta/react";
import { AppNavbar, AppPage } from "@/src/components";

function SkeletonCard() {
  return (
    <Block className="my-2 animate-pulse" strong inset>
      <div className="flex justify-between items-start mb-3">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="flex justify-between items-center">
        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </Block>
  );
}

export default function TakenLoading() {
  return (
    <AppPage>
      <AppNavbar title="Заказы в работе" />
      <Block className="my-4 pl-0! pr-0!">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </Block>
    </AppPage>
  );
}
