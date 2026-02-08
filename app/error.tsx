"use client";

import { Block, Button } from "konsta/react";
import { AlertTriangle } from "lucide-react";
import { AppNavbar, AppPage } from "@/src/components";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppPage>
      <AppNavbar title="Ошибка" />
      <Block className="text-center py-16">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-16 h-16 text-red-500" strokeWidth={1.5} />
        </div>
        <h2 className="text-lg font-semibold mb-2">Что-то пошло не так</h2>
        <p className="text-sm opacity-55 mb-6 max-w-sm mx-auto">
          {error.message || "Произошла непредвиденная ошибка. Попробуйте ещё раз."}
        </p>
        <Button onClick={reset} className="mx-auto k-color-brand">
          Попробовать снова
        </Button>
      </Block>
    </AppPage>
  );
}
