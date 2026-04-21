import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { geoService } from '../../services/geoService';
import { useAuthStore } from '../../store/useAuthStore';

export const useSavedLocations = () => {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ['saved-locations', token],
    queryFn: () => geoService.getSavedLocations(token || undefined),
    enabled: !!token,
  });
};

export const useSaveLocation = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  return useMutation({
    mutationFn: (data: { label: string, latitude: number, longitude: number }) => 
      geoService.saveLocation(data, token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-locations'] });
    },
  });
};

export const useDeleteSavedLocation = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  return useMutation({
    mutationFn: (id: number) => geoService.deleteSavedLocation(id, token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-locations'] });
    },
  });
};
