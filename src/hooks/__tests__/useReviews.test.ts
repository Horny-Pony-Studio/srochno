import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const mockGetReviews = vi.fn();
const mockSubmitReview = vi.fn();
const mockSubmitComplaint = vi.fn();

vi.mock('@/lib/api', () => ({
  getReviews: (...args: unknown[]) => mockGetReviews(...args),
  submitClientReview: (...args: unknown[]) => mockSubmitReview(...args),
  submitExecutorComplaint: (...args: unknown[]) => mockSubmitComplaint(...args),
}));

vi.mock('@/lib/mappers', () => ({
  mapReviews: (reviews: Record<string, unknown>[]) =>
    reviews.map((r) => ({ ...r, mapped: true })),
}));

import {
  useReviews,
  useSubmitReview,
  useSubmitComplaint,
  reviewKeys,
} from '../useReviews';

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: qc }, children);
  }
  return Wrapper;
}

describe('reviewKeys', () => {
  it('generates correct key hierarchy', () => {
    expect(reviewKeys.all).toEqual(['reviews']);
    expect(reviewKeys.lists()).toEqual(['reviews', 'list']);
    expect(reviewKeys.list({ rating: 5 })).toEqual([
      'reviews',
      'list',
      { rating: 5 },
    ]);
  });
});

describe('useReviews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and maps reviews', async () => {
    const raw = [
      { id: 1, rating: 5, comment: 'Great' },
      { id: 2, rating: 3, comment: null },
    ];
    mockGetReviews.mockResolvedValue(raw);

    const { result } = renderHook(() => useReviews(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockGetReviews).toHaveBeenCalledWith(undefined);
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data![0]).toHaveProperty('mapped', true);
  });

  it('passes filters to API', async () => {
    mockGetReviews.mockResolvedValue([]);

    const { result } = renderHook(
      () => useReviews({ rating: 5 }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGetReviews).toHaveBeenCalledWith({ rating: 5 });
  });
});

describe('useSubmitReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls submitClientReview API', async () => {
    mockSubmitReview.mockResolvedValue({ success: true });

    const { result } = renderHook(() => useSubmitReview(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      order_id: 'order-1',
      rating: 5,
      comment: 'Excellent',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockSubmitReview).toHaveBeenCalledWith({
      order_id: 'order-1',
      rating: 5,
      comment: 'Excellent',
    });
  });
});

describe('useSubmitComplaint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls submitExecutorComplaint API', async () => {
    mockSubmitComplaint.mockResolvedValue({ success: true });

    const { result } = renderHook(() => useSubmitComplaint(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      order_id: 'order-2',
      complaint: 'Не отвечал',
      comment: null,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockSubmitComplaint).toHaveBeenCalledWith({
      order_id: 'order-2',
      complaint: 'Не отвечал',
      comment: null,
    });
  });
});
