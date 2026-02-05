# Module 3: Orders API - Current Status

## ⚠️ Important Note

The Orders API infrastructure has been **fully implemented** but **NOT integrated into the main UI**. This is intentional to avoid breaking existing functionality.

---

## ✅ What's Completed

### 1. **Full API Infrastructure** (Production Ready)

#### TypeScript Types (`src/types/order.ts`)
- ✅ Complete type definitions matching backend
- ✅ `OrderStatus` enum
- ✅ `Order` interface
- ✅ Request/Response types
- ✅ `OrderWithMetadata` with computed fields
- ✅ Helper function `toOrderWithMetadata()`

#### API Client (`src/lib/api/orders.ts`)
- ✅ `getOrders(params?)` - List orders with pagination/filtering
- ✅ `getOrder(orderId)` - Get single order
- ✅ `createOrder(data)` - Create new order
- ✅ `claimOrder(orderId)` - Claim order
- ✅ `cancelOrder(orderId)` - Cancel order
- ✅ Full error handling
- ✅ JSDoc documentation

#### React Hooks (`src/hooks/`)
- ✅ `useOrders(params?, autoFetch?)` - Orders list hook
- ✅ `useOrder(orderId, autoFetch?)` - Single order hook with actions
- ✅ Loading states
- ✅ Error handling
- ✅ Refetch capabilities

---

## 🎨 Current UI Status

### **UI Uses Mock Data** (Working, Stable)

All user-facing pages currently use `MOCK_ORDERS` from `src/data/mockOrders.ts`:

- ✅ `/orders` - List of orders (uses mock data)
- ✅ `/orders/[id]` - Order details (uses mock data)
- ✅ `/create-order` - Create order form (partially integrated with API)

**Why mock data?**
- Mock orders include rich UI fields: `category`, `description`, `city`, `contact`, `takenBy`
- Backend API only supports: `amount_minor`, `currency`, `status`, basic IDs
- Using mock data keeps the UI feature-complete while backend catches up

---

## 🧪 Testing the Real API

### Test Page: `/api-test`
A dedicated page exists for testing real API functionality:
- Health checks
- Backend availability testing
- Can be extended to test Orders endpoints

### Using the API Functions Directly

```typescript
import { getOrders, createOrder, getOrder, claimOrder, cancelOrder } from '@/src/lib/api';
import { OrderStatus } from '@/src/types/order';

// List orders
const orders = await getOrders({ status: OrderStatus.AVAILABLE });

// Create order
const newOrder = await createOrder({
  amount_minor: 50000, // 500.00 in minor units
  currency: 'RUB'
});

// Get order details
const order = await getOrder(123);

// Claim order
const claimedOrder = await claimOrder(123);

// Cancel order
const canceledOrder = await cancelOrder(123);
```

### Using React Hooks

```typescript
import { useOrders, useOrder } from '@/src/hooks';

function MyComponent() {
  // List orders
  const { orders, loading, error, refetch } = useOrders({
    status: OrderStatus.AVAILABLE
  });

  // Single order with actions
  const {
    order,
    loading,
    error,
    claim,
    cancel,
    claiming,
    canceling
  } = useOrder(123);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {orders.map(order => (
        <div key={order.id}>{order.amount_minor / 100} {order.currency}</div>
      ))}
      <button onClick={claim} disabled={claiming}>Claim Order</button>
    </div>
  );
}
```

---

## 🔄 Hybrid Approach (Current Implementation)

### `/create-order` Page
This page **does integrate** with the real API:
- ✅ Calls `createOrder()` API function
- ✅ Validates input
- ✅ Shows success/error messages
- ⚠️ Also has UI fields (category, description, city) that are NOT sent to API (for future use)

### Why This Approach?
1. **Preserves existing UX** - All pages look and work as expected
2. **Backend-independent** - UI works even if backend is down
3. **Ready for migration** - When backend adds missing fields, easy to switch
4. **Demonstrates API** - `/create-order` and hooks show API works

---

## 📋 Migration Plan (When Ready)

### Phase 1: Backend Enhancement (Backend Team)
Add missing fields to Orders API:
- `category: string`
- `description: string`
- `city: string`
- `contact: string`
- `takenBy: array` (executors who claimed)

### Phase 2: Frontend Integration (Us)
Once backend ready:
1. Update `Order` type in `src/types/order.ts` to include new fields
2. Update API functions to handle new fields
3. Switch `/orders` page from `MOCK_ORDERS` to `useOrders()` hook
4. Switch `/orders/[id]` page from `MOCK_ORDERS` to `useOrder()` hook
5. Update `/create-order` to send all fields

**Estimated time: 30 minutes** (just swapping data sources)

---

## 🚀 What Works Right Now

### Backend API (Port 8888)
```bash
# Health check
curl http://localhost:8888/health

# List orders (requires API key)
curl -H "X-API-Key: YOUR_KEY" http://localhost:8888/orders

# Create order
curl -X POST http://localhost:8888/orders \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_KEY" \
  -d '{"amount_minor": 50000, "currency": "RUB"}'
```

### Frontend
```bash
# Run dev server
npm run dev

# Visit pages
http://localhost:3000/orders - Mock data (works great!)
http://localhost:3000/create-order - Real API (partially)
http://localhost:3000/api-test - API testing page
```

---

## 📦 Files Created

### New Files (API Infrastructure)
```
src/types/order.ts              # Order type definitions
src/lib/api/orders.ts           # Orders API functions
src/hooks/useOrders.ts          # Orders list hook
src/hooks/useOrder.ts           # Single order hook
src/hooks/index.ts              # Hooks exports
```

### Existing Files (Unchanged)
```
app/orders/page.tsx             # Uses MOCK_ORDERS (stable)
app/orders/[id]/page.tsx        # Uses MOCK_ORDERS (stable)
app/create-order/page.tsx       # Partially uses API
src/components/OrderCard.tsx    # Uses mock Order type
src/data/mockOrders.ts          # Mock data source
src/models/Order.ts             # Mock Order type definition
```

---

## ✅ Production Readiness

### API Infrastructure: ✅ READY
- Full TypeScript type safety
- Complete error handling
- JSDoc documentation
- React hooks with best practices
- Build passes with no errors

### UI Integration: ⏳ PENDING
- Waiting for backend to add missing fields
- Can be done in 30 minutes when ready
- No breaking changes to existing UI

---

## 🎯 Recommendations

### For Development
1. **Keep using mock data in UI** - It works, it's stable
2. **Test API with hooks** - They're ready and working
3. **Extend `/api-test`** - Add more comprehensive tests
4. **Add backend fields** - When backend team is ready

### For Testing
1. Backend must be running on port 8888
2. Use `NEXT_PUBLIC_DEV_API_KEY` from `.env.local`
3. Check `/api-test` page for connectivity
4. Use React hooks in custom components for testing

### For Production
1. Update backend API to include all Order fields
2. Switch UI pages from mock to real API
3. Remove mock data files
4. Update documentation

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│           Frontend (Next.js)            │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────┐     │
│  │   UI Pages (Mock Data)        │     │
│  │  /orders, /orders/[id]        │     │
│  │  Uses: MOCK_ORDERS            │     │
│  └───────────────────────────────┘     │
│                                         │
│  ┌───────────────────────────────┐     │
│  │   API Integration Ready       │     │
│  │  • Types (src/types/order.ts) │     │
│  │  • API (src/lib/api/orders.ts)│     │
│  │  • Hooks (src/hooks/)         │     │
│  └────────────┬──────────────────┘     │
│               │                         │
│               │ HTTP                    │
│               ▼                         │
│  ┌───────────────────────────────┐     │
│  │   Axios Client                │     │
│  │   (src/lib/api/client.ts)     │     │
│  └────────────┬──────────────────┘     │
└───────────────┼──────────────────────── │
                │
                │ API Calls
                ▼
┌─────────────────────────────────────────┐
│         Backend (FastAPI:8888)          │
│  Endpoints: /orders, /orders/{id}       │
│  Auth: X-API-Key header                 │
└─────────────────────────────────────────┘
```

---

## 📚 Summary

**What we have:**
- ✅ Complete, production-ready API infrastructure
- ✅ Working UI with mock data
- ✅ React hooks ready to use
- ✅ Type-safe, documented code
- ✅ Error handling throughout

**What we need:**
- ⏳ Backend to add missing Order fields (category, description, city, contact)
- ⏳ 30-minute UI migration when backend ready

**Current state:**
- **Stable** - Nothing is broken
- **Ready** - API infrastructure is complete
- **Waiting** - For backend enhancement

---

**Module 3 Status: ✅ INFRASTRUCTURE COMPLETE | ⏳ UI INTEGRATION PENDING**

Last Updated: 2026-02-05
