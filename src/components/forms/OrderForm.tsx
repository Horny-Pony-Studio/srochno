'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { List, Button } from 'konsta/react';
import { createOrderSchema, type CreateOrderInput, CATEGORIES } from '@/lib/validation/order.schema';
import FormInput from './FormInput';
import FormTextarea from './FormTextarea';
import FormSelect from './FormSelect';
import { useState } from 'react';

export interface OrderFormProps {
  onSubmit: (data: CreateOrderInput) => Promise<void> | void;
  defaultValues?: Partial<CreateOrderInput>;
  isLoading?: boolean;
  submitLabel?: string;
}

export default function OrderForm({
  onSubmit,
  defaultValues,
  isLoading = false,
  submitLabel = 'Создать заявку',
}: OrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    mode: 'onChange',
    defaultValues,
  });

  const description = watch('description', '');

  const onSubmitHandler = async (data: CreateOrderInput) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch {
      // Error handling is delegated to the caller via onSubmit
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
      <List strongIos insetIos>
        <FormSelect
          label="Категория"
          options={CATEGORIES.map((cat) => cat)}
          placeholder="Выберите категорию услуги"
          register={register('category')}
          error={errors.category?.message}
          required
        />

        <FormTextarea
          label="Описание"
          placeholder="Опишите проблему, укажите район, ориентиры, степень срочности..."
          register={register('description')}
          error={errors.description?.message}
          rows={6}
          maxLength={1000}
          currentLength={description.length}
          required
        />

        <FormInput
          label="Город"
          type="text"
          placeholder="Например: Москва"
          register={register('city')}
          error={errors.city?.message}
          required
        />

        <FormInput
          label="Контакт"
          type="text"
          placeholder="Telegram, телефон, Viber и т.д."
          register={register('contact')}
          error={errors.contact?.message}
          info="Любой удобный способ связи"
          required
        />
      </List>

      <div className="px-4">
        <Button
          type="submit"
          large
          disabled={!isValid || isSubmitting || isLoading}
          className="w-full"
        >
          {isSubmitting || isLoading ? 'Создание...' : submitLabel}
        </Button>

        <p className="text-xs text-gray-500 text-center mt-3">
          ⏱️ Заявка будет активна в течение 60 минут
        </p>
      </div>
    </form>
  );
}
