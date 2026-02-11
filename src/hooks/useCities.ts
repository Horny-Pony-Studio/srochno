import { useQuery } from '@tanstack/react-query';
import { getCities } from '@/lib/api';

export function useCities() {
  return useQuery({
    queryKey: ['cities'],
    queryFn: () => getCities(),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
