"use client";

import React from "react";
import { Button } from "konsta/react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  text?: React.ReactNode;
  className?: string;
  onClick?: (e?: React.MouseEvent) => void;
  rounded?: boolean;
  outline?: boolean;
  color?: string;
};

export default function BackButton({
  text = "Назад",
  className = "",
  onClick,
  rounded = true,
  outline = true,
  color,
}: Props) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
      return;
    }
    router.back();
  };

  return (
    <Button
      type="button"
      rounded={rounded}
      outline={outline}
      className={`flex items-center gap-2 ${className}`}
      onClick={handleClick}
      color={color as any}
    >
      <ChevronLeft className="w-4 h-4" />
      <span className="text-sm">{text}</span>
    </Button>
  );
}

