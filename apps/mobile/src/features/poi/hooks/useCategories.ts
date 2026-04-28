import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../services/apiClient';

export interface Category {
  id: string;
  label: string;
  icon: string;
  category: string;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.get<Category[]>('/pois/categories'),
  });
};
