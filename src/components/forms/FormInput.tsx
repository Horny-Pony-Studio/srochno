'use client';

import { ListInput } from 'konsta/react';
import { UseFormRegisterReturn } from 'react-hook-form';

export interface FormInputProps {
  label: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'password';
  placeholder?: string;
  error?: string;
  register: UseFormRegisterReturn;
  required?: boolean;
  disabled?: boolean;
  info?: string;
}

export default function FormInput({
  label,
  type = 'text',
  placeholder,
  error,
  register,
  required = false,
  disabled = false,
  info,
}: FormInputProps) {
  return (
    <ListInput
      label={label}
      type={type}
      placeholder={placeholder}
      info={error || info}
      error={!!error}
      disabled={disabled}
      floatingLabel
      outline
      {...register}
      className={error ? 'text-red-500' : ''}
    />
  );
}
