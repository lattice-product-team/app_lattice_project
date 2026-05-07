import { customType } from 'drizzle-orm/pg-core';

/**
 * PostGIS Geometry Type for Drizzle ORM
 *
 * Defines a GeoJSON Point (SRID 4326) for longitude/latitude coordinates.
 * This ensures compatibility with Mapbox and the API Contract.
 */
export const geometry = customType<{ data: [number, number] }>({
  dataType() {
    return 'geometry(Point, 4326)';
  },
  toDriver(value) {
    return `SRID=4326;POINT(${value[0]} ${value[1]})`;
  },
  fromDriver(value: unknown) {
    if (typeof value !== 'string') return [0, 0];
    const matches = value.match(/POINT\((.+) (.+)\)/);
    if (!matches) return [0, 0];
    return [parseFloat(matches[1]), parseFloat(matches[2])] as [number, number];
  },
});

export const polygon = customType<{ data: [number, number][][] }>({
  dataType() {
    return 'geometry(Polygon, 4326)';
  },
  toDriver(value) {
    const rings = value
      .map((ring) => '(' + ring.map((p) => `${p[0]} ${p[1]}`).join(',') + ')')
      .join(',');
    return `SRID=4326;POLYGON(${rings})`;
  },
  fromDriver(value: unknown) {
    if (typeof value !== 'string') return [];
    // Basic parser for POLYGON((...))
    const ringsMatch = value.match(/POLYGON\((.+)\)/);
    if (!ringsMatch) return [];
    const ringsStr = ringsMatch[1];
    const rings = ringsStr.split(/\)\s*,\s*\(/).map((r) =>
      r
        .replace(/[()]/g, '')
        .split(',')
        .map((p) => p.trim().split(' ').map(parseFloat) as [number, number])
    );
    return rings;
  },
});
