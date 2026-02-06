'use client';

import { ListInput } from 'konsta/react';
import { UseFormRegisterReturn } from 'react-hook-form';

export interface FormTextareaProps {
  label: string;
  placeholder?: string;
  error?: string;
  register: UseFormRegisterReturn;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  info?: string;
  maxLength?: number;
  currentLength?: number;
}

export default function FormTextarea({
  label,
  placeholder,
  error,
  register,
  required = false,
  disabled = false,
  rows = 4,
  info,
  maxLength,
  currentLength,
}: FormTextareaProps) {
  const infoText = error || (maxLength && currentLength !== undefined
    ? `${currentLength}/${maxLength}`
    : info);

  return (
    <div className="space-y-1">
      <ListInput
        label={label}
        type="textarea"
        placeholder={placeholder}
        info={infoText}
        error={!!error}
        disabled={disabled}
        floatingLabel
        outline
        inputClassName={`resize-none ${error ? 'text-red-500' : ''}`}
        {...register}
        style={{ minHeight: `${rows * 24}px` }}
      />
    </div>
  );
}
