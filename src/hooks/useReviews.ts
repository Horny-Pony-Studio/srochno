import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getReviews,
  submitClientReview,
  submitExecutorComplaint,
  type ReviewListParams,
} from '@/lib/api';
import type {
  ClientReviewRequest,
  ExecutorComplaintRequest,
} from '@/types/api';
import { mapReviews } from '@/lib/mappers';
import type { Review } from '@/src/models/Review';

// ─── Query keys ─────────────────────────────────────────

export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: (filters?: ReviewListParams) =>
    [...reviewKeys.lists(), filters ?? {}] as const,
};

// ─── Queries ────────────────────────────────────────────

export function useReviews(filters?: ReviewListParams) {
  return useQuery({
    queryKey: reviewKeys.list(filters),
    queryFn: async (): Promise<Review[]> => {
      const res = await getReviews(filters);
      return mapReviews(res);
    },
  });
}

// ─── Mutations ──────────────────────────────────────────

export function useSubmitReview() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: ClientReviewRequest) => submitClientReview(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
}

export function useSubmitComplaint() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: ExecutorComplaintRequest) => submitExecutorComplaint(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
}
