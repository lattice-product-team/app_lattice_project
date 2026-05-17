/**
 * Shared Geography Utilities
 */

/**
 * Decodes a Valhalla encoded polyline (6 decimal precision).
 * @param str Encoded polyline string
 * @param precision Precision level (Valhalla defaults to 6)
 * @returns Array of [lng, lat] coordinates
 */
export const decodePolyline = (str: string, precision: number = 6): [number, number][] => {
  let index = 0;
  let lat = 0;
  let lng = 0;
  const coordinates: [number, number][] = [];
  let shift = 0;
  let result = 0;
  let byte = null;
  let latitude_change: number;
  let longitude_change: number;
  const factor = Math.pow(10, precision);

  while (index < str.length) {
    byte = null;
    shift = 0;
    result = 0;

    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    latitude_change = result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;

    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    longitude_change = result & 1 ? ~(result >> 1) : result >> 1;

    lat += latitude_change;
    lng += longitude_change;

    coordinates.push([lng / factor, lat / factor]);
  }

  return coordinates;
};

/**
 * Rounds a coordinate to a specific precision.
 * 4 decimal places = ~11 meters (Ideal for routing cache keys)
 * 5 decimal places = ~1.1 meters
 */
export const roundCoord = (coord: number, precision: number = 4): number => {
  const factor = Math.pow(10, precision);
  return Math.round(coord * factor) / factor;
};
