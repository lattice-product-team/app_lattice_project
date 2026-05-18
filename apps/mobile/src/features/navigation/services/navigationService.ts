import { RouteGeoJSON } from '../../../types';
import Env from '../../../config/env';
import { decodePolyline } from '../../../utils/geoUtils';

export interface RouteRequest {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  mode?: 'driving' | 'walking' | 'bicycle';
  avoidStairs?: boolean;
  wheelchairAccess?: boolean;
  timestamp?: number;
}

export const navigationService = {
  getRoute: async (request: RouteRequest): Promise<RouteGeoJSON> => {
    console.log(`[NavigationService] 🛰 Requesting proxy route (${request.mode}) via API Gateway`);

    const response = await fetch(`${Env.apiUrl}/navigation/valhalla-route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        origin: request.origin,
        destination: request.destination,
        mode: request.mode,
        avoidStairs: request.avoidStairs,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API Gateway Error]', errorText);
      throw new Error('Failed to fetch route from gateway');
    }

    const data = await response.json();

    // The server now returns a ready-to-use Feature collection with decoded maneuvers
    return data as RouteGeoJSON;
  },
};
