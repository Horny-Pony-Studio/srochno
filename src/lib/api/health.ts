/**
 * Health API
 *
 * API functions for health check endpoints
 */

import { get } from './client';
import { API_ENDPOINTS } from './config';
import { HealthResponse } from './types';

/**
 * Check full system health
 *
 * @returns Health status of all services
 * @throws {ApiError} If health check fails
 *
 * @example
 * ```ts
 * const health = await checkHealth();
 * if (health.status === 'healthy') {
 *   console.log('All systems operational');
 * }
 * ```
 */
export async function checkHealth(): Promise<HealthResponse> {
  return get<HealthResponse>(API_ENDPOINTS.health);
}

/**
 * Check liveness (simple ping)
 *
 * @returns Basic liveness status
 * @throws {ApiError} If service is down
 *
 * @example
 * ```ts
 * const isAlive = await checkLiveness();
 * console.log('Service is alive:', isAlive);
 * ```
 */
export async function checkLiveness(): Promise<{ status: string }> {
  return get<{ status: string }>(API_ENDPOINTS.healthLiveness);
}

/**
 * Check if backend is available
 *
 * @returns true if backend is reachable and healthy
 *
 * @example
 * ```ts
 * if (await isBackendAvailable()) {
 *   // Proceed with API calls
 * } else {
 *   // Show offline mode
 * }
 * ```
 */
export async function isBackendAvailable(): Promise<boolean> {
  try {
    const health = await checkHealth();
    return health.status === 'healthy';
  } catch {
    return false;
  }
}
