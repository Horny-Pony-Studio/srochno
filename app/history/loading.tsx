'use client';

import { Block } from "konsta/react";
import { AppNavbar, AppPage } from "@/src/components";

function SkeletonCard() {
  return (
    <Block className="my-2 animate-pulse" strong inset>
      <div className="flex justify-between items-start mb-3">
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
      <div className="flex gap-2">
        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </Block>
  );
}

export default function HistoryLoading() {
  return (
    <AppPage>
      <AppNavbar title="История" />
      <Block className="my-4 pl-0! pr-0!">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </Block>
    </AppPage>
  );
}
