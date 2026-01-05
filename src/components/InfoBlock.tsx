"use client"

import React from "react";

type Variant = "red" | "green" | "yellow" | "blue";

const VARIANT_STYLES: Record<Variant, { bg: string; border: string; text: string; }> = {
  red: {
    bg: "bg-[#FFE5E5]",
    border: "border-[#FF3B30]",
    text: "text-[#FF3B30]",
  },
  green: {
    bg: "bg-[#E6F9F0]",
    border: "border-[#34C759]",
    text: "text-[#107F4A]",
  },
  yellow: {
    bg: "bg-[#FFF7E6]",
    border: "border-[#FFCC00]",
    text: "text-[#A66E00]",
  },
  blue: {
    bg: "bg-[#E8F0FF]",
    border: "border-[#007AFF]",
    text: "text-[#003C7A]",
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
  icon?: string;
}) {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.red;

  return (
    <div className={`${styles.bg} p-4 border ${styles.border} rounded-3xl ${className}`}>
      <p className={`text-sm ${styles.text} flex items-start gap-2`}>
        <span className="leading-5">{icon}</span>
        <span>
          {children ?? message ?? (
            <>Плашка</>
          )}
        </span>
      </p>
    </div>
  );
}
