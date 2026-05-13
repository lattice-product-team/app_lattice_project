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

  getEvent: async (id: number): Promise<any> => {
    return apiClient.get<any>(`/events/${id}`);
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

  getEventSpatial: async (eventId: number): Promise<any> => {
    return apiClient.get<any>(`/events/${eventId}/spatial`);
  },

  saveLocation: async (data: {
    label: string;
    latitude: number;
    longitude: number;
  }): Promise<any> => {
    return apiClient.post<any>('/saved', data);
  },

  deleteSavedLocation: async (id: number): Promise<any> => {
    return apiClient.delete<any>(`/saved/${id}`);
  },

  getDiscoveryFeed: async (lat?: number, lng?: number): Promise<any> => {
    const params: any = {};
    if (lat) params.lat = lat;
    if (lng) params.lng = lng;
    return apiClient.get<any>('/discovery', params);
  },
};
