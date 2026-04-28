import { useQuery } from '@tanstack/react-query';
import { geoService } from '../../../services/geoService';

export const useSinglePOI = (id: number | null) => {
  return useQuery({
    queryKey: ['poi', id],
    queryFn: () => (id ? geoService.getPOI(id) : null),
    enabled: !!id,
  });
};
