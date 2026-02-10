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

// Причины жалоб от исполнителя
export const COMPLAINT_REASONS = [
  'Не отвечал',
  'Отменил заказ',
  'Неадекватное поведение',
  'Ложная информация',
  'Другое',
] as const;

// Схема для жалобы исполнителя на клиента
export const executorComplaintSchema = z.object({
  orderId: z.string(),
  complaint: z.enum(COMPLAINT_REASONS, {
    message: 'Выберите причину жалобы',
  }),
  comment: z
    .string()
    .max(500, 'Комментарий слишком длинный (максимум 500 символов)')
    .optional(),
});

export type ClientReviewInput = z.infer<typeof clientReviewSchema>;
export type ExecutorComplaintInput = z.infer<typeof executorComplaintSchema>;
