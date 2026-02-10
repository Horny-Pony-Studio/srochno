import { Order } from "@/src/models/Order";

export const ORDER_LIFETIME_MINUTES = 60;
export const NO_RESPONSE_CLOSE_MINUTES = 15;
export const MAX_EXECUTORS_PER_ORDER = 3;

export function minutesLeft(order: Order, nowMs: number = Date.now()): number {
  const createdMs = Date.parse(order.createdAt);
  const expiresMs = createdMs + order.expiresInMinutes * 60_000;
  return Math.max(0, Math.ceil((expiresMs - nowMs) / 60_000));
}

export function takenCount(order: Order): number {
  return order.takenBy.length;
}

export function isExpired(order: Order, nowMs: number = Date.now()): boolean {
  return minutesLeft(order, nowMs) <= 0 || order.status === "expired";
}

export function secondsLeft(order: Order, nowMs: number = Date.now()): number {
  const createdMs = Date.parse(order.createdAt);
  const expiresMs = createdMs + order.expiresInMinutes * 60_000;
  return Math.max(0, Math.ceil((expiresMs - nowMs) / 1000));
}

export function isTakenByUser(order: Order, userId: number | string): boolean {
  return order.takenBy.some((t) => t.executorId === String(userId));
}

export function isAutoClosedNoResponse(order: Order, nowMs: number = Date.now()): boolean {
  if (order.status === "closed_no_response") return true;
  if (order.customerResponse) return false;
  if (order.takenBy.length === 0) return false;

  const firstTakeMs = Math.min(...order.takenBy.map((t) => Date.parse(t.takenAt)));
  return nowMs - firstTakeMs >= NO_RESPONSE_CLOSE_MINUTES * 60_000;
}

