export interface Review {
  id: number;
  authorName: string;
  rating: number;
  comment: string | null;
  category: string;
  createdAt: string;
}
