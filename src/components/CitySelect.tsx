"use client";

import React from "react";

type Props = {
  value: string;
  onChangeAction: (value: string) => void;
  options: string[];
  className?: string;
  placeholder?: string;
  name?: string;
};

export default function CitySelect({
  value,
  onChangeAction,
  options,
  className = "",
  placeholder = "Выберите город",
  name,
}: Props) {
  return (
    <select
      name={name}
      value={value}
      onChange={(e) => onChangeAction(e.target.value)}
      className={`bg-transparent text-sm focus:outline-none ${className}`}
      aria-label="Город"
    >
      <option value="">{placeholder}</option>
      {options.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}
