import { POIGeoJSON } from '../index';

/**
 * Standardized POI model for UI consumption.
 * Guaranteed to have all necessary display properties.
 */
export interface StandardUIPOI {
  id: string;
  displayName: string;
  category: string;
  categoryLabel: string;
  categoryIcon: string;
  iconFamily: 'feather' | 'material';
  mainColor: string;
  coordinates: [number, number];
  parentId?: string | number;
  description?: string;
  images?: string[];
  distance?: string;
  duration?: string;
  raw: any; // Original GeoJSON properties for backward compatibility
}

// Keep the legacy type for transition period
export type UIPOI = StandardUIPOI;
