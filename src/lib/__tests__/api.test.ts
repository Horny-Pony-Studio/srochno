import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  setAuthToken,
  getAuthToken,
  ApiRequestError,
  getMe,
  getBalance,
  rechargeBalance,
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  takeOrder,
  submitClientReview,
  submitExecutorComplaint,
  getReviews,
} from '../api';

// ─── Mock fetch ─────────────────────────────────────────

function mockFetch(body: unknown, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: 'OK',
    json: () => Promise.resolve(body),
  });
}

function mockFetchError(detail: string, status = 400) {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    statusText: 'Bad Request',
    json: () => Promise.resolve({ detail }),
  });
}

beforeEach(() => {
  setAuthToken(null);
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── Token management ───────────────────────────────────

describe('auth token management', () => {
  it('getAuthToken returns null by default', () => {
    expect(getAuthToken()).toBeNull();
  });

  it('setAuthToken stores token', () => {
    setAuthToken('my-token');
    expect(getAuthToken()).toBe('my-token');
  });

  it('setAuthToken(null) clears token', () => {
    setAuthToken('my-token');
    setAuthToken(null);
    expect(getAuthToken()).toBeNull();
  });
});

// ─── ApiRequestError ────────────────────────────────────

describe('ApiRequestError', () => {
  it('has name, status, and detail', () => {
    const err = new ApiRequestError(404, 'Not found');
    expect(err.name).toBe('ApiRequestError');
    expect(err.status).toBe(404);
    expect(err.detail).toBe('Not found');
    expect(err.message).toBe('Not found');
  });

  it('is instanceof Error', () => {
    const err = new ApiRequestError(500, 'Internal');
    expect(err).toBeInstanceOf(Error);
  });
});

// ─── Request behavior ───────────────────────────────────

describe('request — auth header', () => {
  it('adds Authorization header when token is set', async () => {
    const spy = mockFetch({ id: 1 });
    vi.stubGlobal('fetch', spy);

    setAuthToken('test-token');
    await getMe();

    const [, init] = spy.mock.calls[0];
    expect(init.headers['Authorization']).toBe('Bearer test-token');
  });

  it('does not add Authorization header without token', async () => {
    const spy = mockFetch({ id: 1 });
    vi.stubGlobal('fetch', spy);

    await getMe();

    const [, init] = spy.mock.calls[0];
    expect(init.headers['Authorization']).toBeUndefined();
  });
});

describe('request — error handling', () => {
  it('throws ApiRequestError with detail from JSON body', async () => {
    vi.stubGlobal('fetch', mockFetchError('Insufficient balance', 402));

    await expect(getMe()).rejects.toThrow(ApiRequestError);
    await expect(getMe()).rejects.toMatchObject({
      status: 402,
      detail: 'Insufficient balance',
    });
  });

  it('falls back to statusText when JSON parsing fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: () => Promise.reject(new Error('not json')),
    }));

    await expect(getMe()).rejects.toMatchObject({
      status: 500,
      detail: 'Internal Server Error',
    });
  });

  it('handles 204 No Content', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      statusText: 'No Content',
      json: () => Promise.reject(new Error('no body')),
    }));

    const result = await deleteOrder('order-1');
    expect(result).toBeUndefined();
  });
});

// ─── Endpoint functions ─────────────────────────────────

describe('getMe', () => {
  it('calls GET /api/users/me', async () => {
    const spy = mockFetch({ id: 1, first_name: 'Test' });
    vi.stubGlobal('fetch', spy);

    const result = await getMe();
    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0]).toBe('/api/users/me');
    expect(result).toEqual({ id: 1, first_name: 'Test' });
  });
});

describe('getBalance', () => {
  it('calls GET /api/balance', async () => {
    const spy = mockFetch({ balance: 500 });
    vi.stubGlobal('fetch', spy);

    const result = await getBalance();
    expect(spy.mock.calls[0][0]).toBe('/api/balance');
    expect(result.balance).toBe(500);
  });
});

describe('rechargeBalance', () => {
  it('calls POST /api/balance/recharge with body', async () => {
    const spy = mockFetch({ success: true, new_balance: 600, transaction_id: 1 });
    vi.stubGlobal('fetch', spy);

    await rechargeBalance({ amount: 100 });
    const [url, init] = spy.mock.calls[0];
    expect(url).toBe('/api/balance/recharge');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({ amount: 100 });
  });
});

describe('getOrders', () => {
  it('calls GET /api/orders without params', async () => {
    const spy = mockFetch({ orders: [], total: 0 });
    vi.stubGlobal('fetch', spy);

    await getOrders();
    expect(spy.mock.calls[0][0]).toBe('/api/orders');
  });

  it('appends query params', async () => {
    const spy = mockFetch({ orders: [], total: 0 });
    vi.stubGlobal('fetch', spy);

    await getOrders({ category: 'Сантехника', city: 'Москва', limit: 10 });
    const url = spy.mock.calls[0][0] as string;
    expect(url).toContain('category=');
    expect(url).toContain('city=');
    expect(url).toContain('limit=10');
  });

  it('omits undefined params', async () => {
    const spy = mockFetch({ orders: [], total: 0 });
    vi.stubGlobal('fetch', spy);

    await getOrders({ category: 'Электрика' });
    const url = spy.mock.calls[0][0] as string;
    expect(url).toContain('category=');
    expect(url).not.toContain('city=');
    expect(url).not.toContain('limit=');
  });
});

describe('getOrder', () => {
  it('calls GET /api/orders/:id', async () => {
    const spy = mockFetch({ id: 'abc', category: 'Электрика' });
    vi.stubGlobal('fetch', spy);

    await getOrder('abc');
    expect(spy.mock.calls[0][0]).toBe('/api/orders/abc');
  });
});

describe('createOrder', () => {
  it('calls POST /api/orders with body', async () => {
    const spy = mockFetch({ id: 'new-1' });
    vi.stubGlobal('fetch', spy);

    const data = {
      category: 'Клининг',
      description: 'Нужна уборка квартиры',
      city: 'Москва',
      contact: '@cleaner',
    };
    await createOrder(data);

    const [url, init] = spy.mock.calls[0];
    expect(url).toBe('/api/orders');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual(data);
  });
});

describe('updateOrder', () => {
  it('calls PUT /api/orders/:id', async () => {
    const spy = mockFetch({ id: 'order-1' });
    vi.stubGlobal('fetch', spy);

    await updateOrder('order-1', { description: 'Updated' });

    const [url, init] = spy.mock.calls[0];
    expect(url).toBe('/api/orders/order-1');
    expect(init.method).toBe('PUT');
  });
});

describe('deleteOrder', () => {
  it('calls DELETE /api/orders/:id', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      statusText: 'No Content',
      json: () => Promise.reject(new Error('no body')),
    }));

    await deleteOrder('order-1');
    expect(fetch).toHaveBeenCalledOnce();
    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe('/api/orders/order-1');
    expect(init?.method).toBe('DELETE');
  });
});

describe('takeOrder', () => {
  it('calls POST /api/orders/:id/take', async () => {
    const spy = mockFetch({ success: true, contact: '@user', executor_count: 1, new_balance: 98 });
    vi.stubGlobal('fetch', spy);

    const result = await takeOrder('order-1');
    expect(spy.mock.calls[0][0]).toBe('/api/orders/order-1/take');
    expect(result.success).toBe(true);
  });
});

describe('submitClientReview', () => {
  it('calls POST /api/reviews/client', async () => {
    const spy = mockFetch({ success: true, review_id: 1 });
    vi.stubGlobal('fetch', spy);

    await submitClientReview({ order_id: 'o1', rating: 5, comment: 'Great' });
    const [url, init] = spy.mock.calls[0];
    expect(url).toBe('/api/reviews/client');
    expect(init.method).toBe('POST');
  });
});

describe('submitExecutorComplaint', () => {
  it('calls POST /api/reviews/executor', async () => {
    const spy = mockFetch({ success: true });
    vi.stubGlobal('fetch', spy);

    await submitExecutorComplaint({ order_id: 'o1', complaint: 'Не отвечал' as 'Не отвечал' });
    expect(vi.mocked(fetch).mock.calls[0][0]).toBe('/api/reviews/executor');
  });
});

describe('getReviews', () => {
  it('calls GET /api/reviews without params', async () => {
    const spy = mockFetch([]);
    vi.stubGlobal('fetch', spy);

    await getReviews();
    expect(spy.mock.calls[0][0]).toBe('/api/reviews');
  });

  it('appends rating and limit params', async () => {
    const spy = mockFetch([]);
    vi.stubGlobal('fetch', spy);

    await getReviews({ rating: 5, limit: 10 });
    const url = spy.mock.calls[0][0] as string;
    expect(url).toContain('rating=5');
    expect(url).toContain('limit=10');
  });
});
