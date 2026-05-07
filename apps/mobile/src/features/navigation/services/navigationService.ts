import { RouteGeoJSON } from '../../../types';
import Env from '../../../config/env';
import { decodePolyline } from '../../../utils/geoUtils';

export interface RouteRequest {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  mode?: 'driving' | 'walking';
}

export const navigationService = {
  getRoute: async (request: RouteRequest): Promise<RouteGeoJSON> => {
    const costing = request.mode === 'driving' ? 'auto' : 'pedestrian';
    
    const body = {
      locations: [
        { lat: request.origin.lat, lon: request.origin.lng },
        { lat: request.destination.lat, lon: request.destination.lng }
      ],
      costing,
      costing_options: {
        [costing]: {
          use_living_streets: 0.5,
        }
      },
      directions_options: {
        units: 'kilometers',
        language: 'en-US'
      }
    };

    const response = await fetch(`${Env.valhallaUrl}/route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch route from Valhalla');
    }

    const data = await response.json();
    const leg = data.trip.legs[0];
    const coords = decodePolyline(leg.shape, 6);

    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: coords,
      },
      properties: {
        distance: data.trip.summary.length * 1000, // convert km to meters
        durationEstimate: data.trip.summary.time,
      },
      // Store maneuvers for turn-by-turn guidance
      maneuvers: leg.maneuvers.map((m: any) => ({
        instruction: m.instruction,
        distance: m.length * 1000,
        type: m.type
      }))
    } as any;
  },
};
