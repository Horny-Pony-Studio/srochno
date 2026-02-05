"use client";

import React from "react";

type Variant = "red" | "green" | "yellow" | "blue";

const VARIANT_STYLES: Record<
  Variant,
  { bg: string; border: string; text: string; icon: string }
> = {
  red: {
    bg: "bg-[#FFE5E5]",
    border: "border-[#FF3B30]",
    text: "text-[#FF3B30]",
    icon: "⏱️",
  },
  green: {
    bg: "bg-[#E6F9F0]",
    border: "border-[#34C759]",
    text: "text-[#107F4A]",
    icon: "✅",
  },
  yellow: {
    bg: "bg-[#FFF7E6]",
    border: "border-[#FFCC00]",
    text: "text-[#A66E00]",
    icon: "⚠️",
  },
  blue: {
    bg: "bg-[#E8F0FF]",
    border: "border-[#007AFF]",
    text: "text-[#003C7A]",
    icon: "ℹ️",
  },
};

export default function InfoBlock({
  className = "",
  variant = "red",
  children,
  message,
  icon,
}: {
  className?: string;
  variant?: Variant;
  children?: React.ReactNode;
  message?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.red;
  const resolvedIcon = icon ?? styles.icon;

  return (
    <div
      className={`${styles.bg} p-4 border ${styles.border} rounded-3xl transition-all duration-300 ${className}`}
    >
      <p className={`text-sm ${styles.text} flex items-start gap-2`}>
        {resolvedIcon ? <span className="leading-5">{resolvedIcon}</span> : null}
        <span>{children ?? message ?? <>Плашка</>}</span>
      </p>
    </div>
  );
}
