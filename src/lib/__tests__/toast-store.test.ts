import { describe, it, expect, vi, beforeEach } from 'vitest';

// Fresh store for each test — re-import the module
let addToast: typeof import('../toast-store').addToast;
let dismissToast: typeof import('../toast-store').dismissToast;
let getToasts: typeof import('../toast-store').getToasts;
let subscribe: typeof import('../toast-store').subscribe;

beforeEach(async () => {
  vi.resetModules();
  const mod = await import('../toast-store');
  addToast = mod.addToast;
  dismissToast = mod.dismissToast;
  getToasts = mod.getToasts;
  subscribe = mod.subscribe;
});

describe('toast-store', () => {
  it('starts with empty toasts', () => {
    expect(getToasts()).toEqual([]);
  });

  it('adds a toast with correct fields', () => {
    addToast('Hello', 'success', 3000);
    const toasts = getToasts();
    expect(toasts).toHaveLength(1);
    expect(toasts[0]).toMatchObject({
      message: 'Hello',
      type: 'success',
      duration: 3000,
    });
    expect(toasts[0].id).toBeTypeOf('number');
  });

  it('generates unique incremental IDs', () => {
    addToast('First', 'info', 3000);
    addToast('Second', 'error', 3000);
    const toasts = getToasts();
    expect(toasts[1].id).toBeGreaterThan(toasts[0].id);
  });

  it('dismisses a toast by id', () => {
    addToast('A', 'info', 3000);
    addToast('B', 'error', 3000);
    const [a] = getToasts();
    dismissToast(a.id);
    const remaining = getToasts();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].message).toBe('B');
  });

  it('dismissing non-existent id does nothing', () => {
    addToast('A', 'info', 3000);
    dismissToast(999);
    expect(getToasts()).toHaveLength(1);
  });

  it('notifies subscribers on addToast', () => {
    const listener = vi.fn();
    subscribe(listener);
    addToast('Test', 'info', 3000);
    expect(listener).toHaveBeenCalledOnce();
  });

  it('notifies subscribers on dismissToast', () => {
    addToast('Test', 'info', 3000);
    const listener = vi.fn();
    subscribe(listener);
    dismissToast(getToasts()[0].id);
    expect(listener).toHaveBeenCalledOnce();
  });

  it('unsubscribe stops notifications', () => {
    const listener = vi.fn();
    const unsub = subscribe(listener);
    unsub();
    addToast('Test', 'info', 3000);
    expect(listener).not.toHaveBeenCalled();
  });

  it('supports multiple subscribers', () => {
    const a = vi.fn();
    const b = vi.fn();
    subscribe(a);
    subscribe(b);
    addToast('Test', 'info', 3000);
    expect(a).toHaveBeenCalledOnce();
    expect(b).toHaveBeenCalledOnce();
  });

  it('returns a new array reference on mutation', () => {
    addToast('A', 'info', 3000);
    const before = getToasts();
    addToast('B', 'info', 3000);
    const after = getToasts();
    expect(before).not.toBe(after);
  });
});
