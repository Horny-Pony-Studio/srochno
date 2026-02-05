# API Client Module

Professional API client infrastructure for Srochno frontend.

## Features

✅ **Axios-based HTTP client** with interceptors
✅ **Comprehensive error handling** with custom error classes
✅ **Retry logic** for failed requests
✅ **TypeScript types** for all requests/responses
✅ **Environment-based configuration**
✅ **Request/response logging** in development
✅ **Auth token management** (placeholder for future auth module)

## Usage

### Basic Example

```typescript
import { checkHealth } from '@/lib/api';

// Simple API call
const health = await checkHealth();
console.log(health.status); // 'healthy'
```

### Error Handling

```typescript
import { checkHealth, ApiError } from '@/lib/api';

try {
  const health = await checkHealth();
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`Error ${error.status}: ${error.getUserMessage()}`);

    if (error.isServerError()) {
      // Handle server error
    }

    if (error.isValidationError()) {
      // Handle validation errors
      console.log(error.validationErrors);
    }
  }
}
```

### Direct HTTP Methods

```typescript
import { get, post, put, del } from '@/lib/api';

// GET request
const data = await get<MyType>('/endpoint');

// POST request
const result = await post<ResponseType, RequestType>(
  '/endpoint',
  { key: 'value' }
);

// PUT request
await put('/endpoint', updateData);

// DELETE request
await del('/endpoint');
```

## Configuration

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8888
```

### Retry Configuration

Edit `src/lib/api/config.ts`:

```typescript
export const API_CONFIG = {
  retry: {
    attempts: 3,
    delay: 1000,
    statusCodes: [408, 429, 500, 502, 503, 504],
  },
};
```

## Files Structure

```
src/lib/api/
├── client.ts       # Axios instance and HTTP methods
├── config.ts       # Configuration and endpoints
├── types.ts        # TypeScript types
├── errors.ts       # Error classes and handling
├── health.ts       # Health check API
├── index.ts        # Main export
└── README.md       # This file
```

## Testing

Visit `/api-test` page to test the API client:

```bash
npm run dev
# Open http://localhost:3000/api-test
```

## Next Steps

This module provides the foundation. Next modules will add:

- Auth API (login, register)
- Orders API (CRUD operations)
- Stats API (analytics)

## Error Types

### `ApiError`
Base error class for all API errors.

### `NetworkError`
Thrown when there's no response from server.

### `TimeoutError`
Thrown when request times out.

## Best Practices

1. **Always handle errors**: Use try-catch or .catch()
2. **Use TypeScript types**: Define interfaces for request/response
3. **Check error types**: Use `instanceof` to handle different errors
4. **Log errors**: Errors are auto-logged in development
5. **Don't catch and ignore**: Always provide user feedback

## Support

For issues or questions, check:
- Backend API docs: http://localhost:8888/docs
- Development plan: `/DEVELOPMENT_PLAN.md`
