# Module 3: Orders API 📦

Complete Orders API implementation with TypeScript types, API functions, and React hooks.

## 📦 What's Included

**TypeScript Types:**
- ✅ `OrderStatus` enum matching backend
- ✅ `Order` interface with all fields
- ✅ Request/Response types for all operations
- ✅ `OrderWithMetadata` for frontend display
- ✅ Helper function `toOrderWithMetadata()`

**API Functions:**
- ✅ `getOrders(params?)` - List orders with pagination/filters
- ✅ `getOrder(orderId)` - Get single order by ID
- ✅ `createOrder(data)` - Create new order
- ✅ `claimOrder(orderId)` - Claim order (for executors)
- ✅ `cancelOrder(orderId)` - Cancel order (for customers)

**React Hooks:**
- ✅ `useOrders(params?, autoFetch?)` - Hook for orders list
  - Returns: `{ orders, loading, error, refetch }`
- ✅ `useOrder(orderId, autoFetch?)` - Hook for single order
  - Returns: `{ order, loading, error, refetch, claim, cancel, claiming, canceling }`

## 📁 Files Added

```
src/types/
└── order.ts              # Complete Order types

src/lib/api/
├── orders.ts             # Orders API functions
└── index.ts              # Updated exports

src/hooks/
├── useOrders.ts          # Orders list hook
├── useOrder.ts           # Single order hook
└── index.ts              # Hooks exports
```

## 📖 Usage Examples

### Using API Functions

```typescript
import { getOrders, createOrder, OrderStatus } from '@/src/lib/api';

// Get all available orders
const orders = await getOrders({ status: OrderStatus.AVAILABLE });

// Create new order
const order = await createOrder({
  amount_minor: 50000, // 500.00 RUB
  currency: 'RUB'
});
```

### Using Hooks

```tsx
import { useOrders, useOrder } from '@/src/hooks';

// List orders
function OrdersList() {
  const { orders, loading, error, refetch } = useOrders();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {orders.map(order => (
        <div key={order.id}>
          Order #{order.id}: {order.amount_minor / 100} {order.currency}
        </div>
      ))}
    </div>
  );
}

// Single order with actions
function OrderDetails({ orderId }: { orderId: number }) {
  const { order, loading, claim, cancel, claiming } = useOrder(orderId);

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Not found</div>;

  return (
    <div>
      <h2>Order #{order.id}</h2>
      <p>Status: {order.status}</p>
      {order.status === 'AVAILABLE' && (
        <button onClick={claim} disabled={claiming}>
          {claiming ? 'Claiming...' : 'Claim Order'}
        </button>
      )}
      <button onClick={cancel}>Cancel</button>
    </div>
  );
}
```

## 🔧 Type Safety

All types match backend schema exactly:

```typescript
interface Order {
  id: number;
  customer_id: number;
  trader_id: number | null;
  amount_minor: number; // Cents
  currency: string;
  status: OrderStatus;
  created_at: string;
  claimed_at: string | null;
  completed_at: string | null;
  expires_at: string | null;
}
```

## ✅ Testing

```bash
# TypeScript build
npm run build
# Result: ✅ PASSED

# Type checking
# All types match backend schema
# No `any` types used
# Proper error handling
```

## 🎯 Backend Endpoints Coverage

- ✅ `POST /orders` → `createOrder()`
- ✅ `GET /orders` → `getOrders()`
- ✅ `GET /orders/{id}` → `getOrder()`
- ✅ `POST /orders/{id}/claim` → `claimOrder()`
- ✅ `POST /orders/{id}/cancel` → `cancelOrder()`

## 🚀 Features

**Error Handling:**
- API errors handled via `ApiError` class
- User-friendly error messages
- Loading states for all operations

**React Best Practices:**
- Proper hook dependency arrays
- Cleanup and error handling
- TypeScript strict mode
- Client-side only hooks ('use client')

**Pagination & Filtering:**
- Support for skip/limit pagination
- Filter by status, currency
- Type-safe query params

## 📊 Code Quality

- [x] No `any` types
- [x] Full TypeScript coverage
- [x] JSDoc documentation
- [x] Error handling complete
- [x] React hooks best practices
- [x] Build passes ✅

## 🎯 Next Steps

After merge:
- Module 4: Stats API
- Module 5: Health & Monitoring
- Integration with existing UI components

---

**Ready for review!** 🚀

**Branch:** `feature/orders-api`
**Base:** `main`
