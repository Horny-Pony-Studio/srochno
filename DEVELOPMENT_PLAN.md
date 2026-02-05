# Srochno Frontend - Backend Integration Plan

## Project Overview
Integrating Next.js frontend with FastAPI backend (running on port 8888)

## Module Breakdown

### Module 1: API Client Infrastructure ⚙️
**Branch**: `feature/api-client-setup`
**Files to create**:
- `src/lib/api/client.ts` - Axios instance with interceptors
- `src/lib/api/config.ts` - API configuration (base URL, timeout)
- `src/lib/api/types.ts` - Common API types (ApiResponse, ApiError)
- `src/lib/api/errors.ts` - Error handling utilities
- `.env.local` - Environment variables (NEXT_PUBLIC_API_URL)

**Tasks**:
- [ ] Install axios: `npm install axios`
- [ ] Create axios instance with base URL (http://localhost:8888)
- [ ] Add request/response interceptors
- [ ] Implement error handling
- [ ] Create ApiError class
- [ ] Add retry logic for failed requests
- [ ] Setup TypeScript types for responses

**Acceptance Criteria**:
- Axios configured with proper base URL
- Error handling working (network errors, 4xx, 5xx)
- TypeScript types for all API responses
- Can make test request to `/health` endpoint

---

### Module 2: Auth & User API 🔐
**Branch**: `feature/auth-api`
**Files to create**:
- `src/lib/api/auth.ts` - Auth API functions
- `src/lib/api/user.ts` - User API functions
- `src/types/user.ts` - User types matching backend
- `src/hooks/useAuth.ts` - Auth React hook
- `src/contexts/AuthContext.tsx` - Auth context provider

**Backend Endpoints**:
- Currently no auth endpoints in backend (needs to be checked)
- May need to implement JWT token handling

**Tasks**:
- [ ] Define User interface matching backend
- [ ] Create auth functions (login, logout, register if available)
- [ ] Create AuthContext for global auth state
- [ ] Store auth token in localStorage/cookies
- [ ] Add token to axios interceptor
- [ ] Create useAuth hook for components

**Acceptance Criteria**:
- User can authenticate (if auth exists)
- Token stored securely
- Auth state managed globally
- Protected routes working

---

### Module 3: Orders API 📦
**Branch**: `feature/orders-api`
**Files to create**:
- `src/lib/api/orders.ts` - Orders API functions
- `src/types/order.ts` - Order types (update existing)
- `src/hooks/useOrders.ts` - Orders React hook
- `src/hooks/useOrder.ts` - Single order hook

**Backend Endpoints**:
- `GET /orders` - List orders
- `POST /orders` - Create order
- `GET /orders/{order_id}` - Get order details
- `POST /orders/{order_id}/claim` - Claim order
- `POST /orders/{order_id}/cancel` - Cancel order

**Tasks**:
- [ ] Update Order type to match backend schema
- [ ] Create getOrders() function
- [ ] Create createOrder(data) function
- [ ] Create getOrder(id) function
- [ ] Create claimOrder(id) function
- [ ] Create cancelOrder(id) function
- [ ] Create useOrders hook with loading/error states
- [ ] Create useOrder hook for single order

**Acceptance Criteria**:
- Can fetch list of orders
- Can create new order
- Can claim order
- Can cancel order
- Loading and error states handled
- Types match backend exactly

---

### Module 4: Stats & Analytics API 📊
**Branch**: `feature/stats-api`
**Files to create**:
- `src/lib/api/stats.ts` - Stats API functions
- `src/types/stats.ts` - Stats types
- `src/hooks/useStats.ts` - Stats React hook

**Backend Endpoints**:
- `GET /stats/customer/{user_id}` - Customer stats
- `GET /stats/trader/{user_id}` - Trader/Executor stats

**Tasks**:
- [ ] Define Stats interface matching backend
- [ ] Create getCustomerStats(userId) function
- [ ] Create getTraderStats(userId) function
- [ ] Create useStats hook
- [ ] Handle loading/error states

**Acceptance Criteria**:
- Can fetch customer statistics
- Can fetch executor statistics
- Data displayed correctly in UI
- Loading states handled

---

### Module 5: Health & Monitoring API 🏥
**Branch**: `feature/health-api`
**Files to create**:
- `src/lib/api/health.ts` - Health check functions
- `src/types/health.ts` - Health types

**Backend Endpoints**:
- `GET /health` - Full health check
- `GET /health/liveness` - Liveness probe

**Tasks**:
- [ ] Create checkHealth() function
- [ ] Create checkLiveness() function
- [ ] Add health check on app startup
- [ ] Display backend status in UI (optional)

**Acceptance Criteria**:
- Health check working
- Can detect backend unavailability
- User sees error if backend down

---

## Development Workflow

### For Each Module:

1. **Create Feature Branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/<module-name>
   ```

2. **Implement Module**
   - Follow the tasks list
   - Write clean, typed code
   - Handle errors properly
   - Test with backend

3. **Create Pull Request**
   ```bash
   git add .
   git commit -m "feat: implement <module-name>"
   git push origin feature/<module-name>
   ```

4. **Team Lead Review**
   - Code review by Team Lead agent
   - Address feedback
   - Update PR

5. **User Approval**
   - Wait for user to test
   - Address any issues
   - Get approval

6. **Merge** (only after approval)
   ```bash
   git checkout main
   git merge feature/<module-name>
   git push origin main
   ```

---

## Technical Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **HTTP Client**: Axios
- **Backend**: FastAPI on http://localhost:8888
- **State Management**: React Context + Hooks
- **Styling**: Tailwind CSS, Konsta UI

---

## API Base URL

Development: `http://localhost:8888`
Production: TBD (будет настроено позже)

---

## Priority Order

1. Module 1 (Infrastructure) - **MUST GO FIRST**
2. Module 3 (Orders) - **HIGH PRIORITY** (core feature)
3. Module 2 (Auth) - Medium priority
4. Module 4 (Stats) - Medium priority
5. Module 5 (Health) - Low priority

---

## Success Metrics

- ✅ All API calls working with backend
- ✅ Proper error handling throughout
- ✅ TypeScript types match backend 100%
- ✅ No mock data used (all data from backend)
- ✅ Loading states on all async operations
- ✅ User feedback on errors

---

**Let's build something great! 🚀**
