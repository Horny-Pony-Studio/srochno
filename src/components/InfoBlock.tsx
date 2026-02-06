"use client";

import React from "react";
import { Block } from "konsta/react";

type Variant = "red" | "green" | "yellow" | "blue";

const VARIANT_STYLES: Record<Variant, { icon: string; colorClass: string }> = {
  red: {
    icon: "⏱️",
    colorClass: "k-color-red",
  },
  green: {
    icon: "✅",
    colorClass: "k-color-green",
  },
  yellow: {
    icon: "⚠️",
    colorClass: "k-color-yellow",
  },
  blue: {
    icon: "ℹ️",
    colorClass: "k-color-primary",
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
    <Block
      strong
      inset
      className={`${styles.colorClass} transition-all duration-300 ${className}`}
    >
      <p className="text-sm flex items-start gap-2">
        {resolvedIcon ? <span className="leading-5">{resolvedIcon}</span> : null}
        <span className="opacity-75">{children ?? message ?? <>Плашка</>}</span>
      </p>
    </Block>
  );
}
