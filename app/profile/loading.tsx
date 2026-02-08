'use client';

import { Block } from "konsta/react";
import { AppNavbar, AppPage } from "@/src/components";

export default function ProfileLoading() {
  return (
    <AppPage className="min-h-dvh flex flex-col">
      <AppNavbar title="Профиль" />
      <Block className="flex-1 flex flex-col gap-4 pb-16 my-4 pl-0! pr-0!">
        {/* Avatar + stats */}
        <Block className="my-0 animate-pulse" strong inset>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="flex-1">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-ios">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="h-7 w-8 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-1" />
                <div className="h-3 w-14 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
              </div>
            ))}
          </div>
        </Block>

        {/* Balance */}
        <Block className="my-0 animate-pulse" strong inset>
          <div className="flex justify-between mb-4">
            <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
            ))}
          </div>
        </Block>
      </Block>
    </AppPage>
  );
}
