export interface Review {
  id: number;
  authorName: string;
  rating: number;
  comment: string | null;
  category: string;
  createdAt: string;
  orderId?: string | null;
  description?: string | null;
  contact?: string | null;
  city?: string | null;
}
