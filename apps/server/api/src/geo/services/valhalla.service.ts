import { loadConfig, getCache, setCache, decodePolyline, roundCoord } from '@app/core';

const config = loadConfig();

export interface ValhallaRequest {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  mode: 'driving' | 'walking' | 'bicycle';
  avoidStairs?: boolean;
}

/**
 * Service to proxy and cache Valhalla routing requests.
 */
export const valhallaService = {
  async getRoute(request: ValhallaRequest) {
    const { origin, destination, mode, avoidStairs } = request;

    // 1. Generate Cache Key
    // We round to 4 decimals (~11m) to increase cache hits for nearby requests
    const rLat1 = roundCoord(origin.lat, 4);
    const rLng1 = roundCoord(origin.lng, 4);
    const rLat2 = roundCoord(destination.lat, 4);
    const rLng2 = roundCoord(destination.lng, 4);

    const cacheKey = `route:${mode}:${rLat1},${rLng1}:${rLat2},${rLng2}:${avoidStairs ? 'no-stairs' : 'default'}`;

    // 2. Check Cache
    const cached = await getCache(cacheKey);

    if (cached) {
      console.log(`[ValhallaService] ⚡️ Cache HIT for ${cacheKey}`);
      return JSON.parse(cached);
    }

    console.log(`[ValhallaService] 📡 Cache MISS for ${cacheKey}. Fetching from Valhalla...`);

    // 3. Prepare Valhalla Request
    let costing = 'pedestrian';
    if (mode === 'driving') costing = 'auto';
    if (mode === 'bicycle') costing = 'bicycle';

    const valhallaBody = {
      locations: [
        { lat: origin.lat, lon: origin.lng },
        { lat: destination.lat, lon: destination.lng },
      ],
      costing,
      costing_options: {
        pedestrian: {
          walking_speed: 5.0,
          avoid_stairs: avoidStairs ? 1.0 : 0.0,
        },
      },
      directions_options: {
        units: 'kilometers',
        language: 'en-US',
      },
    };

    // 4. Execute Fetch
    const response = await fetch(`${config.VALHALLA_URL}/route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(valhallaBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Valhalla upstream error: ${errorText}`);
    }

    const data = await response.json();
    if (!data.trip || !data.trip.legs) {
      throw new Error('Invalid Valhalla response structure');
    }

    // 5. Process & Optimize Response
    const allCoords: [number, number][] = [];
    const allManeuvers: any[] = [];
    let totalDistance = 0;
    let totalTime = 0;

    data.trip.legs.forEach((leg: any) => {
      const legCoords = decodePolyline(leg.shape, 6);
      
      // Filter out invalid coordinates
      const validLegCoords = legCoords.filter(c => 
        c && c.length === 2 && 
        !isNaN(c[0]) && !isNaN(c[1])
      );
      
      allCoords.push(...validLegCoords);
      
      if (leg.maneuvers) {
        allManeuvers.push(...leg.maneuvers.map((m: any) => ({
          text: m.instruction,
          distance: (m.length || 0) * 1000,
          maneuverType: m.type?.toString() || '',
          index: m.begin_shape_index,
          coordinate: legCoords[m.begin_shape_index],
        })));
      }

      totalDistance += (leg.summary?.length || 0) * 1000;
      totalTime += (leg.summary?.time || 0);
    });

    const result = {
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
    };

    // 6. Save to Cache (1 hour)
    await setCache(cacheKey, JSON.stringify(result), 3600);

    return result;
    },
    };

