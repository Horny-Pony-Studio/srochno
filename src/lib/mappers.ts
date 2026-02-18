import type { OrderResponse, OrderDetailResponse, ExecutorTakeSchema, ReviewResponse, OrderFeedback } from '@/types/api';
import type { Order, ExecutorTake, CustomerResponse, OrderFeedbackData } from '@/src/models/Order';
import type { Review } from '@/src/models/Review';

function mapExecutorTake(raw: ExecutorTakeSchema): ExecutorTake {
  return {
    executorId: String(raw.executor_id),
    takenAt: raw.taken_at,
  };
}

function mapCustomerResponse(
  respondedAt: string | null,
): CustomerResponse | undefined {
  if (!respondedAt) return undefined;
  return { respondedAt };
}

function mapOrderFeedback(raw: OrderFeedback | null | undefined): OrderFeedbackData | undefined {
  if (raw == null) return undefined;
  return {
    clientReview: raw.client_review
      ? {
          id: raw.client_review.id,
          rating: raw.client_review.rating,
          comment: raw.client_review.comment,
          createdAt: raw.client_review.created_at,
        }
      : null,
  };
}

export function mapOrder(raw: OrderResponse | OrderDetailResponse): Order {
  const feedback = 'feedback' in raw ? mapOrderFeedback(raw.feedback) : undefined;

  return {
    id: raw.id,
    category: raw.category,
    description: raw.description,
    city: raw.city,
    contact: raw.contact ?? '',
    createdAt: raw.created_at,
    expiresInMinutes: raw.expires_in_minutes,
    status: raw.status,
    takenBy: raw.taken_by.map(mapExecutorTake),
    customerResponse: mapCustomerResponse(raw.customer_responded_at),
    cityLocked: raw.city_locked,
    ...(raw.rating != null ? { rating: raw.rating } : {}),
    ...(feedback !== undefined ? { feedback } : {}),
  };
}

export function mapOrders(raw: OrderResponse[]): Order[] {
  return raw.map(mapOrder);
}

export function mapReview(raw: ReviewResponse): Review {
  return {
    id: raw.id,
    rating: raw.rating,
    comment: raw.comment,
    category: raw.category,
    authorName: raw.author_name,
    createdAt: raw.created_at,
  };
}

export function mapReviews(raw: ReviewResponse[]): Review[] {
  return raw.map(mapReview);
}
