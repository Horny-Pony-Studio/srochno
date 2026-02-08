import { useMutation } from '@tanstack/react-query';
import { rechargeBalance } from '@/lib/api';
import type { RechargeRequest } from '@/types/api';
import { useAuth } from '@/src/providers/AuthProvider';

export function useRechargeBalance() {
  const { refetchUser } = useAuth();

  return useMutation({
    mutationFn: (data: RechargeRequest) => rechargeBalance(data),
    onSuccess: () => {
      refetchUser();
    },
  });
}
