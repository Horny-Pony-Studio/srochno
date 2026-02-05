'use client';

/**
 * API Test Page
 *
 * Test page to verify API client is working correctly
 * Can be removed after testing
 */

import { useState, useEffect } from 'react';
import { checkHealth, isBackendAvailable, ApiError } from '@/src/lib/api';
import type { HealthResponse } from '@/src/lib/api';

export default function ApiTestPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckHealth = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Making request to:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888');
      const result = await checkHealth();
      console.log('Health check result:', result);
      setHealth(result);
    } catch (err) {
      console.error('Health check error:', err);
      if (err instanceof ApiError) {
        setError(`Error ${err.status}: ${err.getUserMessage()}`);
        console.error('ApiError details:', {
          status: err.status,
          detail: err.detail,
          validationErrors: err.validationErrors
        });
      } else if (err instanceof Error) {
        setError(`Error: ${err.message}`);
        console.error('Error details:', err);
      } else {
        setError('Unknown error occurred');
        console.error('Unknown error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAvailability = async () => {
    setLoading(true);
    const available = await isBackendAvailable();
    setIsAvailable(available);
    setLoading(false);
  };

  if (!mounted) {
    return <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
      <p>Loading...</p>
    </div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Client Test</h1>

        {/* Backend URL */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Configuration</h2>
          <p className="text-gray-600">
            Backend URL: <code className="bg-gray-100 px-2 py-1 rounded">{process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888'}</code>
          </p>
        </div>

        {/* Test Buttons */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Tests</h2>
          <div className="flex gap-4">
            <button
              onClick={handleCheckHealth}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
              {loading ? 'Loading...' : 'Check Health'}
            </button>
            <button
              onClick={handleCheckAvailability}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
            >
              Check Availability
            </button>
          </div>
        </div>

        {/* Availability Result */}
        {isAvailable !== null && (
          <div className={`p-6 rounded-lg shadow mb-6 ${isAvailable ? 'bg-green-50' : 'bg-red-50'}`}>
            <h2 className="text-xl font-semibold mb-2">Availability</h2>
            <p className={isAvailable ? 'text-green-700' : 'text-red-700'}>
              {isAvailable ? '✅ Backend is available' : '❌ Backend is unavailable'}
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-2 text-red-700">Error</h2>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Health Response */}
        {health && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Health Check Response</h2>
            <div className="space-y-4">
              <div>
                <span className="font-medium">Status:</span>{' '}
                <span className={health.status === 'healthy' ? 'text-green-600' : 'text-red-600'}>
                  {health.status}
                </span>
              </div>
              <div>
                <span className="font-medium">Timestamp:</span> {health.timestamp}
              </div>
              <div>
                <h3 className="font-medium mb-2">Services:</h3>
                <div className="pl-4 space-y-2">
                  <div>
                    <span className="font-medium">Database:</span>{' '}
                    <span className={health.services.database.status === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {health.services.database.status}
                    </span>
                    {' '}({health.services.database.response_time_ms}ms)
                  </div>
                  <div>
                    <span className="font-medium">Redis:</span>{' '}
                    <span className={health.services.redis.status === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {health.services.redis.status}
                    </span>
                    {' '}({health.services.redis.response_time_ms}ms)
                  </div>
                </div>
              </div>
            </div>

            {/* Raw JSON */}
            <details className="mt-6">
              <summary className="cursor-pointer font-medium">Raw Response</summary>
              <pre className="mt-2 bg-gray-50 p-4 rounded overflow-auto">
                {JSON.stringify(health, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
