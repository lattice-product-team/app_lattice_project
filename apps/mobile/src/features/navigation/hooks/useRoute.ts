import { useQuery } from '@tanstack/react-query';
import { navigationService, RouteRequest } from '../services/navigationService';

export const useRoute = (request: RouteRequest | null) => {
  return useQuery({
    queryKey: ['route', request],
    queryFn: () => (request ? navigationService.getRoute(request) : null),
    enabled: !!request,
    staleTime: 0,
  });
};
