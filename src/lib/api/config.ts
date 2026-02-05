/**
 * API Configuration
 *
 * Centralized configuration for API client.
 * Uses environment variables for different environments.
 */

export const API_CONFIG = {
  /**
   * Base URL for the API
   * Default: http://localhost:8888 (development)
   */
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888',

  /**
   * Request timeout in milliseconds
   * Default: 30 seconds
   */
  timeout: 30000,

  /**
   * Retry configuration for failed requests
   */
  retry: {
    attempts: 3,
    delay: 1000, // ms
    statusCodes: [408, 429, 500, 502, 503, 504] as number[], // Retry on these status codes
  },

  /**
   * Headers to include in all requests
   */
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  // Health
  health: '/health',
  healthLiveness: '/health/liveness',

  // Orders
  orders: '/orders',
  order: (id: string) => `/orders/${id}`,
  claimOrder: (id: string) => `/orders/${id}/claim`,
  cancelOrder: (id: string) => `/orders/${id}/cancel`,

  // Stats
  customerStats: (userId: string) => `/stats/customer/${userId}`,
  traderStats: (userId: string) => `/stats/trader/${userId}`,

  // Webhooks (if needed)
  webhookEventTypes: '/webhooks/event-types',
  webhookSubscriptions: '/webhooks/subscriptions',
} as const;
