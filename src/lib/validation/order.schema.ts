import { z } from 'zod';

// Категорії згідно ТЗ
export const CATEGORIES = [
  'Сантехника',
  'Электрика',
  'Бытовой ремонт',
  'Клининг',
  'Сборка/установка',
  'Бытовая техника',
  'Другое',
] as const;

// Схема для створення замовлення
export const createOrderSchema = z.object({
  category: z.enum(CATEGORIES, {
    message: 'Виберіть категорію',
  }),
  description: z
    .string({
      message: 'Опис обов\'язковий',
    })
    .min(20, 'Опис має містити мінімум 20 символів')
    .max(1000, 'Опис занадто довгий (максимум 1000 символів)'),
  city: z
    .string({
      message: 'Виберіть місто',
    })
    .min(2, 'Назва міста занадто коротка')
    .max(100, 'Назва міста занадто довга'),
  contact: z
    .string({
      message: 'Контакт обов\'язковий',
    })
    .min(3, 'Контакт занадто короткий')
    .max(100, 'Контакт занадто довгий'),
});

// Схема для редагування замовлення
export const updateOrderSchema = createOrderSchema.partial({
  city: true, // Місто не можна змінювати
});

// TypeScript типи з схем
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
