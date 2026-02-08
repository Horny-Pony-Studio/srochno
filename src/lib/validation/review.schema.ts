import { z } from 'zod';

// Схема для відгуку від клієнта до виконавця (зірки)
export const clientReviewSchema = z.object({
  orderId: z.string(),
  rating: z
    .number({
      message: 'Оцінка обов\'язкова',
    })
    .int('Оцінка має бути цілим числом')
    .min(1, 'Мінімальна оцінка - 1 зірка')
    .max(5, 'Максимальна оцінка - 5 зірок'),
  comment: z
    .string()
    .max(500, 'Коментар занадто довгий (максимум 500 символів)')
    .optional(),
});

// Причини скарг від виконавця
export const COMPLAINT_REASONS = [
  'Не відповідав',
  'Відмінив замовлення',
  'Неадекватна поведінка',
  'Неправдива інформація',
  'Інше',
] as const;

// Схема для скарги від виконавця до клієнта
export const executorComplaintSchema = z.object({
  orderId: z.string(),
  complaint: z.enum(COMPLAINT_REASONS, {
    message: 'Виберіть причину скарги',
  }),
  comment: z
    .string()
    .max(500, 'Коментар занадто довгий (максимум 500 символів)')
    .optional(),
});

export type ClientReviewInput = z.infer<typeof clientReviewSchema>;
export type ExecutorComplaintInput = z.infer<typeof executorComplaintSchema>;
