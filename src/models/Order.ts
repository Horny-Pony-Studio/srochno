export type OrderStatus = "active" | "expired" | "deleted" | "closed_no_response";

export interface ExecutorTake {
  executorId: string;
  takenAt: string;
}

export interface CustomerResponse {
  respondedAt: string;
}

export interface Order {
  id: string;
  category: string;
  description: string;
  city: string;
  contact: string;
  createdAt: string;
  expiresInMinutes: number;
  status: OrderStatus;
  takenBy: ExecutorTake[];
  customerResponse?: CustomerResponse;
  cityLocked: boolean;
}