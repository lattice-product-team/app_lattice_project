import { useQuery } from '@tanstack/react-query';
import { geoService } from '../../services/geoService';

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => geoService.getEvents(),
  });
};
