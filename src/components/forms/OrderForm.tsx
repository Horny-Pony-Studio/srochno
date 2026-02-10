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
  submitLabel = 'Створити заявку',
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
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
      <List strongIos insetIos>
        <FormSelect
          label="Категорія"
          options={CATEGORIES.map((cat) => cat)}
          placeholder="Оберіть категорію послуги"
          register={register('category')}
          error={errors.category?.message}
          required
        />

        <FormTextarea
          label="Опис"
          placeholder="Опишіть проблему, вкажіть район, орієнтири, рівень терміновості..."
          register={register('description')}
          error={errors.description?.message}
          rows={6}
          maxLength={1000}
          currentLength={description.length}
          required
        />

        <FormInput
          label="Місто"
          type="text"
          placeholder="Наприклад: Київ"
          register={register('city')}
          error={errors.city?.message}
          required
        />

        <FormInput
          label="Контакт"
          type="text"
          placeholder="Telegram, телефон, Viber тощо"
          register={register('contact')}
          error={errors.contact?.message}
          info="Будь-який зручний спосіб зв'язку"
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
          {isSubmitting || isLoading ? 'Створення...' : submitLabel}
        </Button>

        <p className="text-xs text-gray-500 text-center mt-3">
          ⏱️ Заявка буде активна протягом 60 хвилин
        </p>
      </div>
    </form>
  );
}
