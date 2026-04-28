import { apiClient } from '../../../services/apiClient';
import { API_ENDPOINTS } from '../../../constants/api';
import { RouteGeoJSON } from '../../../types';

export interface RouteRequest {
  origin: { lat?: number; lng?: number; poiId?: number };
  destination: { lat?: number; lng?: number; poiId?: number };
  avoidStairs?: boolean;
  wheelchairAccess?: boolean;
}

export const navigationService = {
  getRoute: async (request: RouteRequest): Promise<RouteGeoJSON> => {
    return apiClient.post<RouteGeoJSON>(
      API_ENDPOINTS.GEO.NAVIGATION,
      request
    );
  },
};
