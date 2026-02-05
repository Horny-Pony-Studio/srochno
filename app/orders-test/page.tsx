'use client';

/**
 * Orders Test Page
 *
 * Test page to verify Orders API functionality
 * Full CRUD operations with real backend
 */

import { useState } from 'react';
import { useOrders, useOrder } from '@/src/hooks';
import { createOrder, OrderStatus } from '@/src/lib/api';
import type { Order } from '@/src/types/order';

export default function OrdersTestPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [createAmount, setCreateAmount] = useState<string>('500');
  const [currency, setCurrency] = useState<string>('RUB');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // List orders
  const { orders, loading: ordersLoading, error: ordersError, refetch } = useOrders();

  // Single order (if selected)
  const {
    order: selectedOrder,
    loading: orderLoading,
    error: orderError,
    claim,
    cancel,
    claiming,
    canceling,
    refetch: refetchOrder,
  } = useOrder(selectedOrderId || 0, !!selectedOrderId);

  const handleCreateOrder = async () => {
    setCreating(true);
    setCreateError(null);

    try {
      const amountMinor = Math.round(parseFloat(createAmount) * 100);
      await createOrder({ amount_minor: amountMinor, currency });
      setCreateAmount('500');
      await refetch(); // Refresh list
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setCreating(false);
    }
  };

  const handleSelectOrder = (order: Order) => {
    setSelectedOrderId(order.id);
  };

  const handleClaim = async () => {
    await claim();
    await refetch(); // Refresh list after claim
  };

  const handleCancel = async () => {
    await cancel();
    await refetch(); // Refresh list after cancel
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Orders API Test</h1>

        {/* Create Order Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Order</h2>
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                value={createAmount}
                onChange={(e) => setCreateAmount(e.target.value)}
                className="border rounded px-3 py-2 w-32"
                placeholder="500.00"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="RUB">RUB</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <button
              onClick={handleCreateOrder}
              disabled={creating}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
              {creating ? 'Creating...' : 'Create Order'}
            </button>
          </div>
          {createError && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
              {createError}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Orders List */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Orders List</h2>
              <button
                onClick={refetch}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              >
                Refresh
              </button>
            </div>

            {ordersLoading && <div className="text-gray-500">Loading orders...</div>}

            {ordersError && (
              <div className="p-3 bg-red-50 text-red-700 rounded">
                Error: {ordersError}
              </div>
            )}

            {!ordersLoading && !ordersError && orders.length === 0 && (
              <div className="text-gray-500 text-center py-8">
                No orders yet. Create one above!
              </div>
            )}

            {!ordersLoading && !ordersError && orders.length > 0 && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => handleSelectOrder(order)}
                    className={`p-3 border rounded cursor-pointer hover:bg-gray-50 transition ${
                      selectedOrderId === order.id ? 'bg-blue-50 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">Order #{order.id}</div>
                        <div className="text-sm text-gray-600">
                          {order.amount_minor / 100} {order.currency}
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        order.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                        order.status === 'CLAIMED' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'CANCELED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Created: {new Date(order.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>

            {!selectedOrderId && (
              <div className="text-gray-500 text-center py-8">
                Select an order from the list
              </div>
            )}

            {selectedOrderId && orderLoading && (
              <div className="text-gray-500">Loading order...</div>
            )}

            {selectedOrderId && orderError && (
              <div className="p-3 bg-red-50 text-red-700 rounded">
                Error: {orderError}
              </div>
            )}

            {selectedOrderId && selectedOrder && !orderLoading && (
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Order ID</div>
                  <div className="text-lg">#{selectedOrder.id}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500">Amount</div>
                  <div className="text-lg font-semibold">
                    {selectedOrder.amount_minor / 100} {selectedOrder.currency}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500">Status</div>
                  <div className={`inline-block px-3 py-1 rounded text-sm ${
                    selectedOrder.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                    selectedOrder.status === 'CLAIMED' ? 'bg-yellow-100 text-yellow-800' :
                    selectedOrder.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                    selectedOrder.status === 'CANCELED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedOrder.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-500">Customer ID</div>
                    <div>{selectedOrder.customer_id}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-500">Trader ID</div>
                    <div>{selectedOrder.trader_id || 'N/A'}</div>
                  </div>
                </div>

                <div className="text-sm">
                  <div className="font-medium text-gray-500">Created At</div>
                  <div>{new Date(selectedOrder.created_at).toLocaleString()}</div>
                </div>

                {selectedOrder.claimed_at && (
                  <div className="text-sm">
                    <div className="font-medium text-gray-500">Claimed At</div>
                    <div>{new Date(selectedOrder.claimed_at).toLocaleString()}</div>
                  </div>
                )}

                {selectedOrder.expires_at && (
                  <div className="text-sm">
                    <div className="font-medium text-gray-500">Expires At</div>
                    <div>{new Date(selectedOrder.expires_at).toLocaleString()}</div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t space-y-2">
                  <h3 className="font-medium mb-2">Actions</h3>

                  {selectedOrder.status === OrderStatus.AVAILABLE && (
                    <button
                      onClick={handleClaim}
                      disabled={claiming}
                      className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
                    >
                      {claiming ? 'Claiming...' : 'Claim Order'}
                    </button>
                  )}

                  <button
                    onClick={handleCancel}
                    disabled={canceling || selectedOrder.status === 'CANCELED'}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300"
                  >
                    {canceling ? 'Canceling...' : 'Cancel Order'}
                  </button>

                  <button
                    onClick={refetchOrder}
                    className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Refresh Details
                  </button>
                </div>

                {/* Raw JSON */}
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-sm">
                    Raw JSON
                  </summary>
                  <pre className="mt-2 bg-gray-50 p-4 rounded overflow-auto text-xs">
                    {JSON.stringify(selectedOrder, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
