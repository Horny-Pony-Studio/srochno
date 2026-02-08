import { describe, it, expect } from 'vitest';
import { mapOrder, mapOrders, mapReview, mapReviews } from '../mappers';
import type { OrderResponse, OrderDetailResponse, ReviewResponse } from '@/types/api';

// ─── Fixtures ───────────────────────────────────────────

const rawOrder: OrderResponse = {
  id: 'order-1',
  category: 'Сантехника',
  description: 'Тестовый заказ',
  city: 'Москва',
  contact: '@testuser',
  created_at: '2025-01-01T12:00:00Z',
  expires_in_minutes: 60,
  status: 'active',
  taken_by: [
    { executor_id: 42, taken_at: '2025-01-01T12:05:00Z' },
  ],
  customer_responded_at: '2025-01-01T12:10:00Z',
  city_locked: true,
};

const rawOrderDetail: OrderDetailResponse = {
  id: 'order-2',
  category: 'Электрика',
  description: 'Детальный заказ',
  city: 'Санкт-Петербург',
  contact: '+79001234567',
  created_at: '2025-01-02T09:00:00Z',
  expires_in_minutes: 45,
  status: 'completed',
  taken_by: [],
  customer_responded_at: null,
  city_locked: false,
};

const rawReview: ReviewResponse = {
  id: 1,
  author_name: 'Иван Иванов',
  rating: 5,
  comment: 'Отлично!',
  category: 'Сантехника',
  created_at: '2025-01-01T14:00:00Z',
};

// ─── mapOrder ───────────────────────────────────────────

describe('mapOrder', () => {
  it('maps snake_case to camelCase', () => {
    const order = mapOrder(rawOrder);
    expect(order.createdAt).toBe('2025-01-01T12:00:00Z');
    expect(order.expiresInMinutes).toBe(60);
    expect(order.cityLocked).toBe(true);
  });

  it('preserves direct fields', () => {
    const order = mapOrder(rawOrder);
    expect(order.id).toBe('order-1');
    expect(order.category).toBe('Сантехника');
    expect(order.description).toBe('Тестовый заказ');
    expect(order.city).toBe('Москва');
    expect(order.status).toBe('active');
  });

  it('maps contact from OrderResponse (nullable → empty string)', () => {
    const noContact: OrderResponse = { ...rawOrder, contact: null };
    const order = mapOrder(noContact);
    expect(order.contact).toBe('');
  });

  it('maps contact from OrderResponse (present)', () => {
    const order = mapOrder(rawOrder);
    expect(order.contact).toBe('@testuser');
  });

  it('maps taken_by → takenBy with executor mapping', () => {
    const order = mapOrder(rawOrder);
    expect(order.takenBy).toHaveLength(1);
    expect(order.takenBy[0]).toEqual({
      executorId: '42',
      takenAt: '2025-01-01T12:05:00Z',
    });
  });

  it('converts executor_id to string', () => {
    const order = mapOrder(rawOrder);
    expect(typeof order.takenBy[0].executorId).toBe('string');
  });

  it('maps customer_responded_at → customerResponse', () => {
    const order = mapOrder(rawOrder);
    expect(order.customerResponse).toEqual({
      respondedAt: '2025-01-01T12:10:00Z',
    });
  });

  it('maps null customer_responded_at → undefined', () => {
    const order = mapOrder(rawOrderDetail);
    expect(order.customerResponse).toBeUndefined();
  });

  it('handles empty taken_by array', () => {
    const order = mapOrder(rawOrderDetail);
    expect(order.takenBy).toEqual([]);
  });

  it('handles OrderDetailResponse (contact always string)', () => {
    const order = mapOrder(rawOrderDetail);
    expect(order.contact).toBe('+79001234567');
  });

  it('maps multiple executors', () => {
    const multi: OrderResponse = {
      ...rawOrder,
      taken_by: [
        { executor_id: 1, taken_at: '2025-01-01T12:05:00Z' },
        { executor_id: 2, taken_at: '2025-01-01T12:06:00Z' },
        { executor_id: 3, taken_at: '2025-01-01T12:07:00Z' },
      ],
    };
    const order = mapOrder(multi);
    expect(order.takenBy).toHaveLength(3);
    expect(order.takenBy.map((t) => t.executorId)).toEqual(['1', '2', '3']);
  });
});

// ─── mapOrders ──────────────────────────────────────────

describe('mapOrders', () => {
  it('maps empty array', () => {
    expect(mapOrders([])).toEqual([]);
  });

  it('maps array of orders', () => {
    const orders = mapOrders([rawOrder, { ...rawOrder, id: 'order-99' }]);
    expect(orders).toHaveLength(2);
    expect(orders[0].id).toBe('order-1');
    expect(orders[1].id).toBe('order-99');
  });
});

// ─── mapReview ──────────────────────────────────────────

describe('mapReview', () => {
  it('maps snake_case to camelCase', () => {
    const review = mapReview(rawReview);
    expect(review.authorName).toBe('Иван Иванов');
    expect(review.createdAt).toBe('2025-01-01T14:00:00Z');
  });

  it('preserves direct fields', () => {
    const review = mapReview(rawReview);
    expect(review.id).toBe(1);
    expect(review.rating).toBe(5);
    expect(review.comment).toBe('Отлично!');
    expect(review.category).toBe('Сантехника');
  });

  it('handles null comment', () => {
    const review = mapReview({ ...rawReview, comment: null });
    expect(review.comment).toBeNull();
  });
});

// ─── mapReviews ─────────────────────────────────────────

describe('mapReviews', () => {
  it('maps empty array', () => {
    expect(mapReviews([])).toEqual([]);
  });

  it('maps array of reviews', () => {
    const reviews = mapReviews([rawReview, { ...rawReview, id: 2 }]);
    expect(reviews).toHaveLength(2);
    expect(reviews[0].id).toBe(1);
    expect(reviews[1].id).toBe(2);
  });
});
