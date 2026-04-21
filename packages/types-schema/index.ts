/**
 * Core TypeScript interfaces for Lattice
 */

export interface TicketInfo {
  code: string;
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
  name: string;
  description: string;
  type: POIType;
  location: [number, number];
  crowdLevel: 'low' | 'moderate' | 'high' | 'blocked';
}
