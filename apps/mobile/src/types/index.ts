export interface POIGeoJSON {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    id: number;
    name: string;
    label?: string;
    category: string;
    description: string;
    crowdLevel: 'low' | 'moderate' | 'high' | 'blocked';
    isWheelchairAccessible: boolean;
    hasPriorityLane: boolean;
    wait_time_minutes?: number;
    time?: string;
    distance?: string;
    images?: string[];
  };
}

export interface POICollection {
  type: 'FeatureCollection';
  features: POIGeoJSON[];
}

export type PermissionStatus = 'granted' | 'denied' | 'undetermined' | 'idle' | 'loading' | 'blocked';

export interface RouteGeoJSON {
  type: 'Feature';
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
  properties: {
    distance: number;
    durationEstimate: number;
  };
}

export type EventType = 'music' | 'food' | 'tech' | 'sports' | 'generic';

export interface LatticeEvent {
  id: number;
  venueId?: number;
  name: string;
  type: EventType;
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
  metadata?: any;
  center?: {
    type: 'Point';
    coordinates: [number, number];
  };
  boundary?: {
    type: 'Polygon';
    coordinates: [number, number][][];
  };
}
