"use client";

import React from "react";
import {User} from "lucide-react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/providers/AuthProvider";

type Props = {
  title?: React.ReactNode;
  onBackAction?: () => void;
  navRight?: React.ReactNode;
  titleFontSizeIos?: string;
  className?: string;
  showRight?: boolean;
};

export default function AppNavbar({
  title,
  navRight,
  showRight,
}: Props) {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="text-[20px] font-bold min-w-0 truncate">
        {title}
      </div>

      {(showRight || navRight) && (
        <button
          type="button"
          onClick={() => router.push("/profile")}
          className="flex items-center gap-2 shrink-0 ml-3 transition-opacity duration-200 active:opacity-50"
          aria-label="Профиль"
        >
          <span className="text-[14px] font-medium whitespace-nowrap">
            {user?.balance ?? 0} ₽
          </span>
          <User className="w-6 h-6 text-primary" />
          {navRight ? <span className="shrink-0">{navRight}</span> : null}
        </button>
      )}
    </div>
  );
}
