/**
 * Core TypeScript interfaces for Lattice
 */

export interface Venue {
  id: number;
  name: string;
  boundary?: any; // GeoJSON Polygon
  center?: [number, number]; // [lng, lat]
  primaryColor: string;
}

export interface Event {
  id: number;
  venueId: number;
  name: string;
  startDate: string;
  endDate: string;
}

export interface TicketInfo {
  code: string;
  venueId?: number;
  eventId?: number;
  gate: string;
  zoneName: string;
  seatRow: string;
  seatNumber: string;
  seatLocation: [number, number]; // [longitude, latitude] - Following GeoJSON standard
}

export interface UserTicketSyncResponse {
  user_id: string;
  token: string;
  ticket_info: TicketInfo;
  event_config?: {
    venue: Venue;
    event: Event;
  };
}

export type POIType =
  | 'restaurant'
  | 'wc'
  | 'grandstand'
  | 'gate'
  | 'medical'
  | 'shop'
  | 'parking'
  | 'meetup_point';

export interface POI {
  id: number;
  venueId: number;
  name: string;
  description: string;
  type: POIType;
  location: [number, number];
  crowdLevel: 'low' | 'moderate' | 'high' | 'blocked';
}
