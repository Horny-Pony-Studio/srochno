"use client";

import React from "react";
import { Button } from "konsta/react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type KonstaColor = "primary" | "red" | "green" | "blue" | "yellow" | "gray";

type Props = {
  text?: React.ReactNode;
  className?: string;
  onClickAction?: () => void;
  rounded?: boolean;
  outline?: boolean;
  color?: KonstaColor;
};

export default function BackButton({
  text = "Назад",
  className = "",
  onClickAction,
  rounded = true,
  outline = true,
  color,
}: Props) {
  const router = useRouter();

  const handleClick = () => {
    if (onClickAction) {
      onClickAction();
      return;
    }
    router.back();
  };

  return (
    <Button
      type="button"
      rounded={rounded}
      outline={outline}
      className={`flex items-center gap-2 transition-all duration-200 ${className}`}
      onClick={handleClick}
      color={color}
    >
      <ChevronLeft className="w-4 h-4" />
      <span className="text-sm">{text}</span>
    </Button>
  );
}
