'use client';

import { Block } from "konsta/react";
import { AppNavbar, AppPage } from "@/src/components";

function SkeletonCard() {
  return (
    <Block className="my-2 animate-pulse" strong inset>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between mb-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </Block>
  );
}

export default function ReviewsLoading() {
  return (
    <AppPage>
      <AppNavbar title="Отзывы" />
      <Block className="my-4 pl-0! pr-0!">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </Block>
    </AppPage>
  );
}
