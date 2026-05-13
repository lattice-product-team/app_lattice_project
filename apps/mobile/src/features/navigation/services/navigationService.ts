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
    let costing = 'pedestrian';
    if (request.mode === 'driving') costing = 'auto';
    if (request.mode === 'bicycle') costing = 'bicycle';

    const body = {
      locations: [
        { lat: request.origin.lat, lon: request.origin.lng },
        { lat: request.destination.lat, lon: request.destination.lng },
      ],
      costing,
      costing_options: {
        pedestrian: {
          walking_speed: 5.0,
          use_ferry: 1.0,
          use_living_streets: 0.5,
          avoid_stairs: request.avoidStairs ? 1.0 : 0.0,
        },
        auto: {
          maneuver_penalty: 10,
          country_crossing_penalty: 30.0,
        },
      },
      directions_options: {
        units: 'kilometers',
        language: 'en-US',
      },
    };

    console.log(`[NavigationService] 🛰 Requesting ${costing} route:`, {
      from: `${request.origin.lat},${request.origin.lng}`,
      to: `${request.destination.lat},${request.destination.lng}`,
      mode: request.mode,
      avoidStairs: request.avoidStairs,
    });

    const response = await fetch(`${Env.valhallaUrl}/route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Valhalla Error]', errorText);
      throw new Error('Failed to fetch route');
    }

    const data = await response.json();
    if (!data.trip || !data.trip.legs) {
      throw new Error('Invalid Valhalla response structure');
    }

    // Merge all legs to support long/complex routes
    const allCoords: [number, number][] = [];
    const allManeuvers: any[] = [];
    let totalDistance = 0;
    let totalTime = 0;

    data.trip.legs.forEach((leg: any) => {
      const legCoords = decodePolyline(leg.shape, 6);
      
      // Filter out invalid coordinates to prevent MapLibre crashes/glitches
      const validLegCoords = legCoords.filter(c => 
        c && c.length === 2 && 
        typeof c[0] === 'number' && typeof c[1] === 'number' &&
        !isNaN(c[0]) && !isNaN(c[1])
      );
      
      allCoords.push(...validLegCoords);
      
      if (leg.maneuvers) {
        allManeuvers.push(...leg.maneuvers.map((m: any) => ({
          text: m.instruction,
          distance: (m.length || 0) * 1000,
          maneuverType: m.type?.toString() || '',
        })));
      }

      totalDistance += (leg.summary?.length || 0) * 1000;
      totalTime += (leg.summary?.time || 0);
    });
    
    console.log(`[NavigationService] ${costing} route result: ${totalTime}s, ${totalDistance}m, points: ${allCoords.length}, legs: ${data.trip.legs.length}`);

    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: allCoords,
      },
      properties: {
        distance: totalDistance || data.trip.summary.length * 1000,
        durationEstimate: totalTime || data.trip.summary.time,
      },
      maneuvers: allManeuvers,
    } as any;
  },
};
