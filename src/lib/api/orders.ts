/**
 * Orders API
 *
 * API functions for managing orders (CRUD operations)
 */

import { get, post } from './client';
import { API_ENDPOINTS } from './config';
import type {
  Order,
  ListOrdersParams,
  ListOrdersResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  ClaimOrderResponse,
  CancelOrderResponse,
} from '@/src/types/order';

/**
 * Get list of orders
 *
 * @param params - Query parameters (pagination, filters)
 * @returns Array of orders
 * @throws {ApiError} If request fails
 *
 * @example
 * ```ts
 * // Get all orders
 * const orders = await getOrders();
 *
 * // Get orders with pagination
 * const orders = await getOrders({ skip: 0, limit: 20 });
 *
 * // Get orders by status
 * const availableOrders = await getOrders({ status: OrderStatus.AVAILABLE });
 * ```
 */
export async function getOrders(params?: ListOrdersParams): Promise<ListOrdersResponse> {
  return get<ListOrdersResponse>(API_ENDPOINTS.orders, { params });
}

/**
 * Get single order by ID
 *
 * @param orderId - Order ID
 * @returns Order details
 * @throws {ApiError} If order not found or request fails
 *
 * @example
 * ```ts
 * const order = await getOrder(123);
 * console.log(order.status); // 'AVAILABLE'
 * ```
 */
export async function getOrder(orderId: number): Promise<Order> {
  return get<Order>(API_ENDPOINTS.order(String(orderId)));
}

/**
 * Create a new order
 *
 * @param data - Order creation data (amount, currency)
 * @returns Created order
 * @throws {ApiError} If validation fails or request fails
 *
 * @example
 * ```ts
 * const order = await createOrder({
 *   amount_minor: 50000, // 500.00 RUB
 *   currency: 'RUB'
 * });
 * ```
 */
export async function createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
  return post<CreateOrderResponse, CreateOrderRequest>(API_ENDPOINTS.orders, data);
}

/**
 * Claim an order (for traders/executors)
 *
 * @param orderId - Order ID to claim
 * @returns Updated order with claimed status
 * @throws {ApiError} If order already claimed, not available, or request fails
 *
 * @example
 * ```ts
 * try {
 *   const order = await claimOrder(123);
 *   console.log('Order claimed!', order.status); // 'CLAIMED'
 * } catch (error) {
 *   if (error instanceof ApiError && error.status === 409) {
 *     console.error('Order already claimed');
 *   }
 * }
 * ```
 */
export async function claimOrder(orderId: number): Promise<ClaimOrderResponse> {
  return post<ClaimOrderResponse>(API_ENDPOINTS.claimOrder(String(orderId)));
}

/**
 * Cancel an order (for customers)
 *
 * @param orderId - Order ID to cancel
 * @returns Updated order with canceled status
 * @throws {ApiError} If order cannot be canceled or request fails
 *
 * @example
 * ```ts
 * const order = await cancelOrder(123);
 * console.log('Order canceled:', order.status); // 'CANCELED'
 * ```
 */
export async function cancelOrder(orderId: number): Promise<CancelOrderResponse> {
  return post<CancelOrderResponse>(API_ENDPOINTS.cancelOrder(String(orderId)));
}
