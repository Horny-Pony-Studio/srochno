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
    required_error: 'Виберіть категорію',
    invalid_type_error: 'Невірна категорія',
  }),
  description: z
    .string({
      required_error: 'Опис обов\'язковий',
    })
    .min(20, 'Опис має містити мінімум 20 символів')
    .max(1000, 'Опис занадто довгий (максимум 1000 символів)'),
  city: z
    .string({
      required_error: 'Виберіть місто',
    })
    .min(2, 'Назва міста занадто коротка')
    .max(100, 'Назва міста занадто довга'),
  contact: z
    .string({
      required_error: 'Контакт обов\'язковий',
    })
    .min(3, 'Контакт занадто короткий')
    .max(100, 'Контакт занадто довгий')
    .refine(
      (value) => {
        // Telegram username (@username) або телефон
        const telegramRegex = /^@[a-zA-Z0-9_]{5,32}$/;
        const phoneRegex = /^(\+7|8)?[\s\-]?\(?[489]\d{2}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
        return telegramRegex.test(value) || phoneRegex.test(value);
      },
      {
        message: 'Введіть Telegram username (@username) або номер телефону',
      }
    ),
});

// Схема для редагування замовлення
export const updateOrderSchema = createOrderSchema.partial({
  city: true, // Місто не можна змінювати
});

// TypeScript типи з схем
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
