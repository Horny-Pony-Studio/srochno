/**
 * Common API Types
 *
 * Shared types used across all API modules
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
}

/**
 * API Error response structure
 */
export interface ApiErrorResponse {
  detail: string | ApiValidationError[];
  status?: number;
}

/**
 * Validation error from FastAPI
 */
export interface ApiValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  skip?: number;
  limit?: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

/**
 * Health check response
 */
export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    database: ServiceHealth;
    redis: ServiceHealth;
  };
}

/**
 * Service health status
 */
export interface ServiceHealth {
  status: 'up' | 'down';
  response_time_ms: number;
}
