/**
 * API Client
 *
 * Configured axios instance with interceptors for:
 * - Request/response logging
 * - Error handling
 * - Authentication (if needed)
 * - Retry logic
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { API_CONFIG } from './config';
import { handleApiError, ApiError } from './errors';

/**
 * Create axios instance with default configuration
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: API_CONFIG.headers,
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add auth token if available (will be implemented in auth module)
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log request in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
          params: config.params,
          data: config.data,
        });
      }

      return config;
    },
    (error) => {
      return Promise.reject(handleApiError(error));
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      // Log response in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API] Response ${response.status}`, response.data);
      }

      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      // Handle specific error cases
      if (error.response?.status === 401) {
        // Unauthorized - clear auth and redirect to login
        clearAuthToken();
        // TODO: Redirect to login page (will be implemented in auth module)
      }

      // Retry logic for specific status codes
      if (
        originalRequest &&
        !originalRequest._retry &&
        error.response?.status &&
        API_CONFIG.retry.statusCodes.includes(error.response.status)
      ) {
        originalRequest._retry = true;

        // Wait before retry
        await new Promise((resolve) =>
          setTimeout(resolve, API_CONFIG.retry.delay)
        );

        return instance(originalRequest);
      }

      return Promise.reject(handleApiError(error));
    }
  );

  return instance;
};

/**
 * API client instance
 */
export const apiClient = createAxiosInstance();

/**
 * Helper functions for common HTTP methods
 */

/**
 * GET request
 */
export async function get<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * POST request
 */
export async function post<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * PUT request
 */
export async function put<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * DELETE request
 */
export async function del<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * PATCH request
 */
export async function patch<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Auth token management (placeholder - will be implemented in auth module)
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
}

/**
 * Set auth token
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

/**
 * Export for direct use if needed
 */
export default apiClient;
