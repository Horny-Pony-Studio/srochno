import { z } from 'zod';

// Схема для отзыва клиента об исполнителе (звёзды)
export const clientReviewSchema = z.object({
  orderId: z.string(),
  rating: z
    .number({
      message: 'Оценка обязательна',
    })
    .int('Оценка должна быть целым числом')
    .min(1, 'Минимальная оценка — 1 звезда')
    .max(5, 'Максимальная оценка — 5 звёзд'),
  comment: z
    .string()
    .max(500, 'Комментарий слишком длинный (максимум 500 символов)')
    .optional(),
});

export type ClientReviewInput = z.infer<typeof clientReviewSchema>;
