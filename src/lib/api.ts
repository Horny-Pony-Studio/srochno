import type {
  UserProfile,
  BalanceResponse,
  RechargeRequest,
  RechargeResponse,
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  PaymentStatusResponse,
  OrderResponse,
  OrderListResponse,
  OrderDetailResponse,
  CreateOrderRequest,
  UpdateOrderRequest,
  ExecutorTakeResponse,
  ClientReviewRequest,
  ClientReviewResponse,
  ExecutorComplaintRequest,
  ReviewResponse,
  UpdatePreferencesRequest,
  PreferencesResponse,
  UpdateNotificationSettingsRequest,
  NotificationSettingsResponse,
  OrderStatus,
} from '@/types/api';

// ─── Auth token management ───────────────────────────────

let authToken: string | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

// ─── Base request helper ─────────────────────────────────

// Empty — requests go to same origin, Next.js rewrites proxy to backend
const BASE_URL = '';

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly detail: string,
  ) {
    super(detail);
    this.name = 'ApiRequestError';
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? JSON.stringify(body);
    } catch {
      // keep statusText
    }
    throw new ApiRequestError(res.status, detail);
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

// ─── Users ───────────────────────────────────────────────

export function getMe(): Promise<UserProfile> {
  return request<UserProfile>('/api/users/me');
}

export function getPreferences(): Promise<PreferencesResponse> {
  return request<PreferencesResponse>('/api/users/me/preferences');
}

export function updatePreferences(
  data: UpdatePreferencesRequest,
): Promise<Record<string, boolean>> {
  return request<Record<string, boolean>>('/api/users/me/preferences', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function getNotificationSettings(): Promise<NotificationSettingsResponse> {
  return request<NotificationSettingsResponse>('/api/users/me/notification-settings');
}

export function updateNotificationSettings(
  data: UpdateNotificationSettingsRequest,
): Promise<Record<string, boolean>> {
  return request<Record<string, boolean>>(
    '/api/users/me/notification-settings',
    { method: 'PUT', body: JSON.stringify(data) },
  );
}

// ─── Balance ─────────────────────────────────────────────

export function getBalance(): Promise<BalanceResponse> {
  return request<BalanceResponse>('/api/balance');
}

export function rechargeBalance(
  data: RechargeRequest,
): Promise<RechargeResponse> {
  return request<RechargeResponse>('/api/balance/recharge', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── Crypto Bot Payments ─────────────────────────────────

export function createInvoice(
  data: CreateInvoiceRequest,
): Promise<CreateInvoiceResponse> {
  return request<CreateInvoiceResponse>('/api/balance/create-invoice', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getPaymentStatus(
  paymentId: number,
): Promise<PaymentStatusResponse> {
  return request<PaymentStatusResponse>(
    `/api/balance/payment/${paymentId}/status`,
  );
}

// ─── Cities ─────────────────────────────────────────────

export function getCities(search?: string): Promise<string[]> {
  const qs = new URLSearchParams();
  if (search) qs.set('search', search);
  const query = qs.toString();
  return request<string[]>(`/api/cities${query ? `?${query}` : ''}`);
}

// ─── Orders ──────────────────────────────────────────────

export interface OrderListParams {
  category?: string;
  city?: string;
  status?: OrderStatus;
  limit?: number;
  offset?: number;
  mine?: boolean;
}

export function getOrders(
  params?: OrderListParams,
): Promise<OrderListResponse> {
  const qs = new URLSearchParams();
  if (params?.category) qs.set('category', params.category);
  if (params?.city) qs.set('city', params.city);
  if (params?.status) qs.set('status', params.status);
  if (params?.limit != null) qs.set('limit', String(params.limit));
  if (params?.offset != null) qs.set('offset', String(params.offset));
  if (params?.mine) qs.set('mine', 'true');
  const query = qs.toString();
  return request<OrderListResponse>(
    `/api/orders${query ? `?${query}` : ''}`,
  );
}

export function getOrder(orderId: string): Promise<OrderDetailResponse> {
  return request<OrderDetailResponse>(`/api/orders/${orderId}`);
}

export function createOrder(
  data: CreateOrderRequest,
): Promise<OrderResponse> {
  return request<OrderResponse>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateOrder(
  orderId: string,
  data: UpdateOrderRequest,
): Promise<OrderResponse> {
  return request<OrderResponse>(`/api/orders/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteOrder(orderId: string): Promise<void> {
  return request<void>(`/api/orders/${orderId}`, { method: 'DELETE' });
}

export function takeOrder(orderId: string): Promise<ExecutorTakeResponse> {
  return request<ExecutorTakeResponse>(`/api/orders/${orderId}/take`, {
    method: 'POST',
  });
}

export function closeOrder(orderId: string): Promise<void> {
  return request<void>(`/api/orders/${orderId}/close`, {
    method: 'POST',
  });
}

export function respondToOrder(orderId: string): Promise<OrderResponse> {
  return request<OrderResponse>(`/api/orders/${orderId}/respond`, {
    method: 'POST',
  });
}

export function completeOrder(orderId: string): Promise<OrderResponse> {
  return request<OrderResponse>(`/api/orders/${orderId}/complete`, {
    method: 'POST',
  });
}

// ─── Reviews ─────────────────────────────────────────────

export function submitClientReview(
  data: ClientReviewRequest,
): Promise<ClientReviewResponse> {
  return request<ClientReviewResponse>('/api/reviews/client', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function submitExecutorComplaint(
  data: ExecutorComplaintRequest,
): Promise<Record<string, boolean | number>> {
  return request<Record<string, boolean | number>>('/api/reviews/executor', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface ReviewListParams {
  rating?: number;
  limit?: number;
  mine?: boolean;
}

export function getReviews(
  params?: ReviewListParams,
): Promise<ReviewResponse[]> {
  const qs = new URLSearchParams();
  if (params?.rating != null) qs.set('rating', String(params.rating));
  if (params?.limit != null) qs.set('limit', String(params.limit));
  if (params?.mine) qs.set('mine', 'true');
  const query = qs.toString();
  return request<ReviewResponse[]>(
    `/api/reviews${query ? `?${query}` : ''}`,
  );
}
