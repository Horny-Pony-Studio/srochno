'use client';

import { Block, Button } from "konsta/react";
import { Search } from "lucide-react";
import { AppNavbar, AppPage } from "@/src/components";
import Link from "next/link";

export default function NotFound() {
  return (
    <AppPage>
      <AppNavbar title="Не найдено" />
      <Block className="text-center py-16">
        <div className="flex justify-center mb-4">
          <Search className="w-16 h-16 text-gray-400" strokeWidth={1.5} />
        </div>
        <h2 className="text-lg font-semibold mb-2">Страница не найдена</h2>
        <p className="text-sm opacity-55 mb-6 max-w-sm mx-auto">
          Возможно, она была удалена или вы перешли по неверной ссылке.
        </p>
        <Link href="/">
          <Button className="mx-auto k-color-brand">На главную</Button>
        </Link>
      </Block>
    </AppPage>
  );
}
