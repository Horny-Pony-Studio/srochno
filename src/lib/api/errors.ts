/**
 * API Error Handling
 *
 * Custom error classes and error handling utilities
 */

import { AxiosError } from 'axios';
import { ApiErrorResponse, ApiValidationError } from './types';

/**
 * Base API Error class
 */
export class ApiError extends Error {
  public status: number;
  public detail: string;
  public validationErrors?: ApiValidationError[];

  constructor(
    message: string,
    status: number = 500,
    detail?: string,
    validationErrors?: ApiValidationError[]
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail || message;
    this.validationErrors = validationErrors;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Get user-friendly error message
   */
  public getUserMessage(): string {
    if (this.validationErrors && this.validationErrors.length > 0) {
      return this.validationErrors.map((e) => e.msg).join(', ');
    }
    return this.detail;
  }

  /**
   * Check if error is a validation error
   */
  public isValidationError(): boolean {
    return this.status === 422 && !!this.validationErrors;
  }

  /**
   * Check if error is a server error
   */
  public isServerError(): boolean {
    return this.status >= 500;
  }

  /**
   * Check if error is a client error
   */
  public isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }
}

/**
 * Network error (no response from server)
 */
export class NetworkError extends ApiError {
  constructor(message: string = 'Network error. Please check your connection.') {
    super(message, 0, message);
    this.name = 'NetworkError';
  }
}

/**
 * Timeout error
 */
export class TimeoutError extends ApiError {
  constructor(message: string = 'Request timeout. Please try again.') {
    super(message, 408, message);
    this.name = 'TimeoutError';
  }
}

/**
 * Handle axios errors and convert to ApiError
 */
export function handleApiError(error: unknown): ApiError {
  // Already an ApiError
  if (error instanceof ApiError) {
    return error;
  }

  // Axios error
  if (error instanceof AxiosError) {
    // No response (network error, timeout, etc.)
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return new TimeoutError();
      }
      return new NetworkError();
    }

    const { status, data } = error.response;
    const errorData = data as ApiErrorResponse;

    // FastAPI validation error (422)
    if (status === 422 && Array.isArray(errorData.detail)) {
      return new ApiError(
        'Validation error',
        status,
        'Please check your input',
        errorData.detail
      );
    }

    // Standard error response
    const detail = typeof errorData.detail === 'string'
      ? errorData.detail
      : 'An error occurred';

    return new ApiError(
      detail,
      status,
      detail
    );
  }

  // Unknown error
  if (error instanceof Error) {
    return new ApiError(error.message, 500, error.message);
  }

  // Completely unknown error
  return new ApiError('An unexpected error occurred', 500, String(error));
}

/**
 * Error codes mapping
 */
export const ERROR_MESSAGES: Record<number, string> = {
  400: 'Bad request',
  401: 'Unauthorized. Please log in.',
  403: 'Forbidden. You don\'t have permission.',
  404: 'Not found',
  408: 'Request timeout',
  422: 'Validation error',
  429: 'Too many requests. Please try again later.',
  500: 'Server error. Please try again.',
  502: 'Bad gateway',
  503: 'Service unavailable',
  504: 'Gateway timeout',
} as const;

/**
 * Get user-friendly error message for status code
 */
export function getErrorMessage(status: number, defaultMessage?: string): string {
  return ERROR_MESSAGES[status] || defaultMessage || 'An error occurred';
}
