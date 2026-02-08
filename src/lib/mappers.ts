import type { OrderResponse, OrderDetailResponse, ExecutorTakeSchema } from '@/types/api';
import type { Order, ExecutorTake, CustomerResponse } from '@/src/models/Order';

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

export function mapOrder(raw: OrderResponse | OrderDetailResponse): Order {
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
  };
}

export function mapOrders(raw: OrderResponse[]): Order[] {
  return raw.map(mapOrder);
}
