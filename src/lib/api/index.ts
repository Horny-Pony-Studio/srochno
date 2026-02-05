/**
 * API Client - Main Export
 *
 * Central export point for all API modules
 */

// Client
export { apiClient, get, post, put, del, patch, setAuthToken } from './client';

// Config
export { API_CONFIG, API_ENDPOINTS } from './config';

// Types
export type {
  ApiResponse,
  ApiErrorResponse,
  ApiValidationError,
  PaginationParams,
  PaginatedResponse,
  HealthResponse,
  ServiceHealth,
} from './types';

// Errors
export {
  ApiError,
  NetworkError,
  TimeoutError,
  handleApiError,
  getErrorMessage,
  ERROR_MESSAGES,
} from './errors';

// Health API
export * from './health';

// Orders API
export * from './orders';
