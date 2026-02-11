// Backend API types — matches OpenAPI schemas from scan-back.snek.systems exactly

export type OrderStatus =
  | 'active'
  | 'expired'
  | 'deleted'
  | 'closed_no_response'
  | 'completed';

export type ComplaintReason =
  | 'Не отвечал'
  | 'Отменил заказ'
  | 'Неадекватное поведение'
  | 'Ложная информация'
  | 'Другое';

// ─── Users ───────────────────────────────────────────────

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string | null;
  username: string | null;
  completed_orders: number;
  active_orders: number;
  rating: number;
  balance: number;
}

export interface UpdatePreferencesRequest {
  categories?: string[];
  cities?: string[];
}

export interface UpdateNotificationSettingsRequest {
  frequency: number;
}

// ─── Balance ─────────────────────────────────────────────

export interface BalanceResponse {
  balance: number;
}

export interface RechargeRequest {
  amount: number;
  method?: string;
}

export interface RechargeResponse {
  success: boolean;
  new_balance: number;
  transaction_id: number;
}

// ─── Crypto Bot Payments ─────────────────────────────────

export interface CreateInvoiceRequest {
  amount: number;
}

export interface CreateInvoiceResponse {
  payment_id: number;
  pay_url: string;
  mini_app_invoice_url: string | null;
}

export interface PaymentStatusResponse {
  payment_id: number;
  status: 'pending' | 'paid' | 'expired';
  amount: number;
  new_balance: number | null;
}

// ─── Orders ──────────────────────────────────────────────

export interface CreateOrderRequest {
  category: string;
  description: string;
  city: string;
  contact: string;
}

export interface UpdateOrderRequest {
  category?: string | null;
  description?: string | null;
  contact?: string | null;
}

export interface ExecutorTakeSchema {
  executor_id: number;
  taken_at: string;
}

export interface OrderResponse {
  id: string;
  category: string;
  description: string;
  city: string;
  contact: string | null;
  created_at: string;
  expires_in_minutes: number;
  status: OrderStatus;
  taken_by: ExecutorTakeSchema[];
  customer_responded_at: string | null;
  city_locked: boolean;
}

export interface OrderDetailResponse {
  id: string;
  category: string;
  description: string;
  city: string;
  contact: string;
  created_at: string;
  expires_in_minutes: number;
  status: OrderStatus;
  taken_by: ExecutorTakeSchema[];
  customer_responded_at: string | null;
  city_locked: boolean;
}

export interface OrderListResponse {
  orders: OrderResponse[];
  total: number;
}

export interface ExecutorTakeResponse {
  success: boolean;
  contact: string;
  executor_count: number;
  new_balance: number;
}

// ─── Reviews ─────────────────────────────────────────────

export interface ClientReviewRequest {
  order_id: string;
  rating: number;
  comment?: string | null;
}

export interface ClientReviewResponse {
  success: boolean;
  review_id: number;
}

export interface ExecutorComplaintRequest {
  order_id: string;
  complaint: ComplaintReason;
  comment?: string | null;
}

export interface ReviewResponse {
  id: number;
  author_name: string;
  rating: number;
  comment: string | null;
  category: string;
  created_at: string;
}
