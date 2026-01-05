export interface Order {
  id: string;
  category: string;
  description: string;
  city: string;
  contact: string;
  timeLeft: number;
  takenCount: number;
  createdAt: Date;
  canEdit: boolean;
}