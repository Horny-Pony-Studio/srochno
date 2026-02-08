import { describe, it, expect } from 'vitest';
import { createOrderSchema, updateOrderSchema, CATEGORIES } from '../order.schema';

// ─── Valid inputs ───────────────────────────────────────

const validOrder = {
  category: 'Сантехника' as const,
  description: 'Нужен сантехник срочно, район Центральный, рядом с ТЦ',
  city: 'Москва',
  contact: '@username123',
};

// ─── CATEGORIES ─────────────────────────────────────────

describe('CATEGORIES', () => {
  it('has 7 categories', () => {
    expect(CATEGORIES).toHaveLength(7);
  });

  it('includes all expected categories', () => {
    expect(CATEGORIES).toContain('Сантехника');
    expect(CATEGORIES).toContain('Электрика');
    expect(CATEGORIES).toContain('Другое');
  });
});

// ─── createOrderSchema ─────────────────────────────────

describe('createOrderSchema', () => {
  it('passes with valid data', () => {
    const result = createOrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  // Category
  describe('category', () => {
    it('rejects empty category', () => {
      const result = createOrderSchema.safeParse({ ...validOrder, category: '' });
      expect(result.success).toBe(false);
    });

    it('rejects invalid category', () => {
      const result = createOrderSchema.safeParse({ ...validOrder, category: 'Несуществующая' });
      expect(result.success).toBe(false);
    });

    it('accepts all valid categories', () => {
      for (const cat of CATEGORIES) {
        const result = createOrderSchema.safeParse({ ...validOrder, category: cat });
        expect(result.success).toBe(true);
      }
    });
  });

  // Description
  describe('description', () => {
    it('rejects description < 20 chars', () => {
      const result = createOrderSchema.safeParse({ ...validOrder, description: 'Короткий' });
      expect(result.success).toBe(false);
    });

    it('accepts description exactly 20 chars', () => {
      const result = createOrderSchema.safeParse({
        ...validOrder,
        description: 'a'.repeat(20),
      });
      expect(result.success).toBe(true);
    });

    it('rejects description > 1000 chars', () => {
      const result = createOrderSchema.safeParse({
        ...validOrder,
        description: 'a'.repeat(1001),
      });
      expect(result.success).toBe(false);
    });

    it('accepts description exactly 1000 chars', () => {
      const result = createOrderSchema.safeParse({
        ...validOrder,
        description: 'a'.repeat(1000),
      });
      expect(result.success).toBe(true);
    });
  });

  // City
  describe('city', () => {
    it('rejects city < 2 chars', () => {
      const result = createOrderSchema.safeParse({ ...validOrder, city: 'М' });
      expect(result.success).toBe(false);
    });

    it('accepts city exactly 2 chars', () => {
      const result = createOrderSchema.safeParse({ ...validOrder, city: 'Мо' });
      expect(result.success).toBe(true);
    });

    it('rejects city > 100 chars', () => {
      const result = createOrderSchema.safeParse({ ...validOrder, city: 'a'.repeat(101) });
      expect(result.success).toBe(false);
    });
  });

  // Contact — Telegram username
  describe('contact — Telegram username', () => {
    it('accepts valid @username', () => {
      const result = createOrderSchema.safeParse({ ...validOrder, contact: '@myuser' });
      expect(result.success).toBe(true);
    });

    it('accepts @username with underscores and digits', () => {
      const result = createOrderSchema.safeParse({ ...validOrder, contact: '@user_name_123' });
      expect(result.success).toBe(true);
    });

    it('rejects @username shorter than 5 chars after @', () => {
      const result = createOrderSchema.safeParse({ ...validOrder, contact: '@abcd' });
      expect(result.success).toBe(false);
    });

    it('rejects @username longer than 32 chars after @', () => {
      const result = createOrderSchema.safeParse({
        ...validOrder,
        contact: '@' + 'a'.repeat(33),
      });
      expect(result.success).toBe(false);
    });

    it('accepts @username exactly 5 chars after @', () => {
      const result = createOrderSchema.safeParse({ ...validOrder, contact: '@abcde' });
      expect(result.success).toBe(true);
    });

    it('accepts @username exactly 32 chars after @', () => {
      const result = createOrderSchema.safeParse({
        ...validOrder,
        contact: '@' + 'a'.repeat(32),
      });
      expect(result.success).toBe(true);
    });
  });

  // Contact — Russian phone
  describe('contact — phone number', () => {
    it('accepts +7XXXXXXXXXX format', () => {
      const result = createOrderSchema.safeParse({ ...validOrder, contact: '+79001234567' });
      expect(result.success).toBe(true);
    });

    it('accepts 8XXXXXXXXXX format', () => {
      const result = createOrderSchema.safeParse({ ...validOrder, contact: '89001234567' });
      expect(result.success).toBe(true);
    });

    it('accepts phone with dashes', () => {
      const result = createOrderSchema.safeParse({ ...validOrder, contact: '+7-900-123-45-67' });
      expect(result.success).toBe(true);
    });

    it('accepts phone with parentheses', () => {
      const result = createOrderSchema.safeParse({ ...validOrder, contact: '+7(900)1234567' });
      expect(result.success).toBe(true);
    });

    it('rejects invalid contact format', () => {
      const result = createOrderSchema.safeParse({ ...validOrder, contact: 'not-a-contact' });
      expect(result.success).toBe(false);
    });

    it('rejects empty contact', () => {
      const result = createOrderSchema.safeParse({ ...validOrder, contact: '' });
      expect(result.success).toBe(false);
    });
  });
});

// ─── updateOrderSchema ──────────────────────────────────

describe('updateOrderSchema', () => {
  it('allows partial update without city', () => {
    const result = updateOrderSchema.safeParse({
      category: 'Электрика',
      description: 'Обновленное описание заказа, достаточно длинное',
      contact: '@newuser',
    });
    expect(result.success).toBe(true);
  });

  it('allows updating only description', () => {
    const result = updateOrderSchema.safeParse({
      category: 'Сантехника',
      description: 'Только новое описание заказа',
      contact: '@username123',
    });
    expect(result.success).toBe(true);
  });

  it('still validates field constraints', () => {
    const result = updateOrderSchema.safeParse({
      category: 'Сантехника',
      description: 'short',
      contact: '@username123',
    });
    expect(result.success).toBe(false);
  });
});
