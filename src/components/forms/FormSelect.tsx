'use client';

import { ListInput } from 'konsta/react';
import { UseFormRegisterReturn } from 'react-hook-form';

export interface FormSelectOption {
  value: string;
  label: string;
}

export interface FormSelectProps {
  label: string;
  options: FormSelectOption[] | readonly string[];
  placeholder?: string;
  error?: string;
  register: UseFormRegisterReturn;
  required?: boolean;
  disabled?: boolean;
  info?: string;
}

export default function FormSelect({
  label,
  options,
  placeholder = 'Выберите...',
  error,
  register,
  disabled = false,
  info,
}: FormSelectProps) {
  // Нормализуем опции к единому формату
  const normalizedOptions: FormSelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  return (
    <ListInput
      label={label}
      type="select"
      dropdown
      info={error || info}
      error={!!error}
      disabled={disabled}
      floatingLabel
      outline
      {...register}
      className={error ? 'text-red-500' : ''}
    >
      <option value="" disabled selected>
        {placeholder}
      </option>
      {normalizedOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </ListInput>
  );
}
