"use client";

import React from "react";
import { Navbar, Link } from "konsta/react";
import { User } from "lucide-react";

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
  titleFontSizeIos = "text-[20px]",
  className = "bg-white border-b border-[#C6C6C8] px-0 py-3",
  showRight,
}: Props) {

  const right =
    showRight || navRight ? (
      <Link href={"/profile"} className="px-0 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 px-3 max-w-[55vw]">

          <div className="text-[14px] font-medium text-black whitespace-nowrap">
            {10_000} P
          </div>

          <User className="w-6 h-6 text-[#007AFF]" />

          {navRight ? <div className="shrink-0">{navRight}</div> : null}
        </div>
      </Link>
    ) : undefined;

  const safeTitle =
    typeof title === "string" || typeof title === "number" ? (
      <div className="min-w-0 max-w-full truncate">{title}</div>
    ) : (
      title
    );

  return (
    <Navbar
      titleFontSizeIos={titleFontSizeIos}
      className={className}
      title={safeTitle}
      titleClassName={showRight ? "left-4! translate-x-0!" : ""}
      right={right}
    />
  );
}
