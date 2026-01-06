export type OrderStatus = "active" | "expired" | "deleted" | "closed_no_response";

export interface ExecutorTake {
  executorId: string;
  takenAt: string; // ISO
}

export interface CustomerResponse {
  respondedAt: string; // ISO
}

export interface Order {
  id: string;
  category: string;
  description: string;
  city: string;

  /**
   * Contact is shown to executor only after payment / take.
   * In UI you can hide it by role/permissions.
   */
  contact: string;

  /** ISO */
  createdAt: string;

  /** default 60 */
  expiresInMinutes: number;

  status: OrderStatus;

  /** max 3 */
  takenBy: ExecutorTake[];

  /** used for 15-min no-response autoclose logic */
  customerResponse?: CustomerResponse;

  /** city can't be changed after creation */
  cityLocked: boolean;
}