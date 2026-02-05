# Module 1: API Client Infrastructure ⚙️

Professional API client setup for Srochno frontend-backend integration.

## 📦 What's Included

**Core Infrastructure:**
- ✅ Axios-based HTTP client with request/response interceptors
- ✅ Comprehensive error handling (ApiError, NetworkError, TimeoutError)
- ✅ Automatic retry logic (3 attempts, configurable delay)
- ✅ Environment-based configuration (.env.local)
- ✅ Request/response logging in development mode

**TypeScript Support:**
- ✅ Full TypeScript types for all API calls
- ✅ Type-safe error handling
- ✅ Interfaces matching backend OpenAPI schema

**Health Check API:**
- ✅ `checkHealth()` - Full system health check
- ✅ `checkLiveness()` - Simple ping endpoint
- ✅ `isBackendAvailable()` - Connection validator

**Documentation:**
- ✅ Complete API client README
- ✅ Development plan for all modules
- ✅ Team Lead review guidelines

## 🧪 Testing

```bash
# Node.js test (automated)
node test-api-client.mjs
# Results: ✅ All tests passed

# Browser test
# Visit http://91.211.251.126:10002/api-test
# Results: ✅ Health check successful
```

## 📁 Files Added

```
src/lib/api/
├── client.ts       # Axios instance + HTTP methods
├── config.ts       # API_CONFIG + API_ENDPOINTS
├── types.ts        # TypeScript interfaces
├── errors.ts       # Error classes + handlers
├── health.ts       # Health check functions
├── index.ts        # Main exports
└── README.md       # Documentation

app/api-test/page.tsx     # Test UI page
test-api-client.mjs       # Automated test script
.env.example              # Environment configuration template
DEVELOPMENT_PLAN.md       # Full roadmap
.claude/commands/teamlead-review.md  # Review checklist
```

## 🔧 Configuration

**Ports:**
- Frontend (Next.js): `10002`
- Backend (FastAPI): `10001`

**.env.example:**
```env
NEXT_PUBLIC_API_URL=http://localhost:10001
```

**package.json:**
```json
"scripts": {
  "dev": "next dev -p 10002"
}
```

## 📖 Usage Example

```typescript
import { checkHealth, ApiError } from '@/src/lib/api';

try {
  const health = await checkHealth();
  console.log(health.status); // 'healthy'
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`Error ${error.status}: ${error.getUserMessage()}`);
  }
}
```

## ✅ Acceptance Criteria

- [x] Axios configured with proper base URL
- [x] Error handling working (network errors, 4xx, 5xx)
- [x] TypeScript types for all API responses
- [x] Can make test request to `/health` endpoint
- [x] Retry logic implemented
- [x] CORS working correctly
- [x] Build passes without errors
- [x] Documentation complete
- [x] Tested in browser - working ✅

## 🎯 Next Steps

After this PR is merged:

**Priority: Module 3 - Orders API** (core feature)
- GET /orders - List orders
- POST /orders - Create order
- GET /orders/:id - Get order details
- POST /orders/:id/claim - Claim order
- POST /orders/:id/cancel - Cancel order

## 📊 Test Results

```
✅ Health endpoint: PASSED
✅ CORS configuration: PASSED
✅ Error handling: VERIFIED
✅ TypeScript build: PASSED
✅ Browser test (/api-test): PASSED
```

## 🤖 Team Lead Review

Use `/teamlead-review` command or check manually:
- [x] Code quality (no `any`, proper types)
- [x] Error handling comprehensive
- [x] Follows project structure
- [x] Documentation clear
- [x] Tests passing

---

**Ready for review and merge!** 🚀

**Branch:** `feature/api-client-setup`
**Target:** `main`
