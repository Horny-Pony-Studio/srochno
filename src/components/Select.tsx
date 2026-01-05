"use client";

import React from "react";

export type SelectOption = string | { value: string; label: React.ReactNode };

type Props = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "value" | "onChange"
> & {
  value: string;
  onChangeAction: (value: string) => void; // serializable prop name per Next.js
  options: SelectOption[];
  placeholder?: string;
  name?: string;
  className?: string;
};

export default function Select({
  value,
  onChangeAction,
  options,
  placeholder = "Select",
  name,
  className = "",
  disabled,
  ...rest
}: Props) {
  const normalized = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  return (
    <select
      name={name}
      value={value}
      onChange={(e) => onChangeAction(e.target.value)}
      className={`bg-transparent text-sm focus:outline-none ${className}`}
      aria-label={name || "select"}
      disabled={disabled}
      {...rest}
    >
      <option value="">{placeholder}</option>
      {normalized.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

