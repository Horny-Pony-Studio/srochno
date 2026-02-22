import { describe, it, expect } from 'vitest';
import { clientReviewSchema } from '../review.schema';

// ─── clientReviewSchema ─────────────────────────────────

describe('clientReviewSchema', () => {
  const validReview = {
    orderId: 'order-123',
    rating: 5,
  };

  it('passes with valid rating and no comment', () => {
    const result = clientReviewSchema.safeParse(validReview);
    expect(result.success).toBe(true);
  });

  it('passes with valid rating and comment', () => {
    const result = clientReviewSchema.safeParse({
      ...validReview,
      comment: 'Отличная работа!',
    });
    expect(result.success).toBe(true);
  });

  // Rating boundaries
  describe('rating', () => {
    it('accepts rating 1 (minimum)', () => {
      const result = clientReviewSchema.safeParse({ ...validReview, rating: 1 });
      expect(result.success).toBe(true);
    });

    it('accepts rating 5 (maximum)', () => {
      const result = clientReviewSchema.safeParse({ ...validReview, rating: 5 });
      expect(result.success).toBe(true);
    });

    it('accepts rating 3 (middle)', () => {
      const result = clientReviewSchema.safeParse({ ...validReview, rating: 3 });
      expect(result.success).toBe(true);
    });

    it('rejects rating 0', () => {
      const result = clientReviewSchema.safeParse({ ...validReview, rating: 0 });
      expect(result.success).toBe(false);
    });

    it('rejects rating 6', () => {
      const result = clientReviewSchema.safeParse({ ...validReview, rating: 6 });
      expect(result.success).toBe(false);
    });

    it('rejects negative rating', () => {
      const result = clientReviewSchema.safeParse({ ...validReview, rating: -1 });
      expect(result.success).toBe(false);
    });

    it('rejects fractional rating', () => {
      const result = clientReviewSchema.safeParse({ ...validReview, rating: 3.5 });
      expect(result.success).toBe(false);
    });
  });

  // Comment
  describe('comment', () => {
    it('accepts undefined comment', () => {
      const result = clientReviewSchema.safeParse({ orderId: 'x', rating: 4 });
      expect(result.success).toBe(true);
    });

    it('accepts empty string comment', () => {
      const result = clientReviewSchema.safeParse({ ...validReview, comment: '' });
      expect(result.success).toBe(true);
    });

    it('rejects comment > 500 chars', () => {
      const result = clientReviewSchema.safeParse({
        ...validReview,
        comment: 'a'.repeat(501),
      });
      expect(result.success).toBe(false);
    });

    it('accepts comment exactly 500 chars', () => {
      const result = clientReviewSchema.safeParse({
        ...validReview,
        comment: 'a'.repeat(500),
      });
      expect(result.success).toBe(true);
    });
  });

  // orderId
  it('requires orderId', () => {
    const result = clientReviewSchema.safeParse({ rating: 4 });
    expect(result.success).toBe(false);
  });
});

