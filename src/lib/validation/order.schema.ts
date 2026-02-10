import { z } from 'zod';

// Категории согласно ТЗ
export const CATEGORIES = [
  'Сантехника',
  'Электрика',
  'Бытовой ремонт',
  'Клининг',
  'Сборка/установка',
  'Бытовая техника',
  'Другое',
] as const;

// Схема для создания заказа
export const createOrderSchema = z.object({
  category: z.enum(CATEGORIES, {
    message: 'Выберите категорию',
  }),
  description: z
    .string({
      message: 'Описание обязательно',
    })
    .min(20, 'Описание должно содержать минимум 20 символов')
    .max(1000, 'Описание слишком длинное (максимум 1000 символов)'),
  city: z
    .string({
      message: 'Выберите город',
    })
    .min(2, 'Название города слишком короткое')
    .max(100, 'Название города слишком длинное'),
  contact: z
    .string({
      message: 'Контакт обязателен',
    })
    .min(3, 'Контакт слишком короткий')
    .max(100, 'Контакт слишком длинный')
    .refine(
      (value) => {
        // Telegram username (@username) или телефон
        const telegramRegex = /^@[a-zA-Z0-9_]{5,32}$/;
        const phoneRegex = /^(\+7|8)?[\s\-]?\(?[489]\d{2}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
        return telegramRegex.test(value) || phoneRegex.test(value);
      },
      {
        message: 'Введите Telegram username (@username) или номер телефона',
      }
    ),
});

// Схема для редактирования заказа
export const updateOrderSchema = createOrderSchema.partial({
  city: true, // Город нельзя менять
});

// TypeScript типы из схем
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
