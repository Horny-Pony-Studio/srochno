/**
 * Order Types
 *
 * TypeScript types for Orders API matching backend schema
 */

/**
 * Order status enum
 */
export enum OrderStatus {
  AVAILABLE = 'AVAILABLE',
  CLAIMED = 'CLAIMED',
  QR_PROVIDED = 'QR_PROVIDED',
  CLIENT_MARKED_PAID = 'CLIENT_MARKED_PAID',
  CONFIRM_PENDING = 'CONFIRM_PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  CANCELED = 'CANCELED',
  DISPUTED = 'DISPUTED',
}

/**
 * Order from backend
 */
export interface Order {
  id: number;
  customer_id: number;
  trader_id: number | null;
  amount_minor: number; // Amount in minor units (e.g., cents)
  currency: string; // Currency code (e.g., 'RUB', 'USD')
  status: OrderStatus;
  created_at: string; // ISO datetime
  claimed_at: string | null; // ISO datetime
  completed_at: string | null; // ISO datetime
  expires_at: string | null; // ISO datetime
}

/**
 * Request to create a new order
 */
export interface CreateOrderRequest {
  amount_minor: number; // Amount in minor units (required)
  currency: string; // Currency code (required, e.g., 'RUB')
}

/**
 * Response after creating an order
 */
export interface CreateOrderResponse extends Order {}

/**
 * Request to claim an order (empty body)
 */
export interface ClaimOrderRequest {}

/**
 * Response after claiming an order
 */
export interface ClaimOrderResponse extends Order {}

/**
 * Request to cancel an order (empty body)
 */
export interface CancelOrderRequest {}

/**
 * Response after canceling an order
 */
export interface CancelOrderResponse extends Order {}

/**
 * Query parameters for listing orders
 */
export interface ListOrdersParams {
  skip?: number; // Pagination offset
  limit?: number; // Pagination limit
  status?: OrderStatus; // Filter by status
  currency?: string; // Filter by currency
}

/**
 * Response for listing orders
 */
export type ListOrdersResponse = Order[];

/**
 * Order with additional computed fields (for frontend display)
 */
export interface OrderWithMetadata extends Order {
  // Amount in major units (e.g., dollars)
  amount: number;
  // Is order expired
  isExpired: boolean;
  // Is order available for claiming
  isAvailable: boolean;
  // Time remaining in minutes (if not expired)
  timeRemainingMinutes: number | null;
}

/**
 * Helper to convert order to display format
 */
export function toOrderWithMetadata(order: Order): OrderWithMetadata {
  const amount = order.amount_minor / 100; // Convert cents to dollars
  const now = new Date();
  const expiresAt = order.expires_at ? new Date(order.expires_at) : null;
  const isExpired = expiresAt ? expiresAt < now : false;
  const isAvailable = order.status === OrderStatus.AVAILABLE && !isExpired;

  let timeRemainingMinutes: number | null = null;
  if (expiresAt && !isExpired) {
    timeRemainingMinutes = Math.floor((expiresAt.getTime() - now.getTime()) / 1000 / 60);
  }

  return {
    ...order,
    amount,
    isExpired,
    isAvailable,
    timeRemainingMinutes,
  };
}
