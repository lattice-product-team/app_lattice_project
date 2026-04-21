import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { POICollection } from '../types';

export const geoService = {
  getPOIs: async (category?: string): Promise<POICollection> => {
    return apiClient.get<POICollection>(
      API_ENDPOINTS.GEO.POIS, 
      category ? { category } : undefined
    );
  },

  getPOI: async (id: number): Promise<any> => {
    return apiClient.get<any>(`${API_ENDPOINTS.GEO.POIS}/${id}`);
  },

  getCategories: async (): Promise<string[]> => {
    return apiClient.get<string[]>(API_ENDPOINTS.GEO.CATEGORIES);
  },
  
  getPathNetwork: async (): Promise<any> => {
    return apiClient.get<any>(API_ENDPOINTS.GEO.NETWORK);
  },

  getSavedLocations: async (): Promise<any> => {
    return apiClient.get<any>('/saved');
  },

  saveLocation: async (data: { label: string, latitude: number, longitude: number }): Promise<any> => {
    return apiClient.post<any>('/saved', data);
  },

  deleteSavedLocation: async (id: number): Promise<any> => {
    return apiClient.delete<any>(`/saved/${id}`);
  },
};
