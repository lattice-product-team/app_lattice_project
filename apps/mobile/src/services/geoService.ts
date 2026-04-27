import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { POICollection } from '../types';

export const geoService = {
  getPOIs: async (category?: string, eventId?: number): Promise<POICollection> => {
    const params: any = {};
    if (category) params.category = category;
    if (eventId) params.eventId = eventId;
    return apiClient.get<POICollection>(API_ENDPOINTS.GEO.POIS, params);
  },

  getEvents: async (): Promise<any[]> => {
    return apiClient.get<any[]>('/events');
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

  getSavedLocations: async (token?: string): Promise<any> => {
    return apiClient.get<any>('/saved', undefined, token);
  },

  saveLocation: async (data: { label: string, latitude: number, longitude: number }, token?: string): Promise<any> => {
    return apiClient.post<any>('/saved', data, token);
  },

  deleteSavedLocation: async (id: number, token?: string): Promise<any> => {
    // We'll use a DELETE method which I'll add to apiClient
    return apiClient.delete<any>(`/saved/${id}`, token);
  },
};
