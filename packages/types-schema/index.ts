/**
 * Core TypeScript interfaces for Lattice
 * 
 * We use a combination of manual interfaces and inferred types 
 * from the Drizzle schema to ensure a single source of truth.
 */

import { InferSelectModel } from 'drizzle-orm';
import * as schema from '@app/db';

// --- INFERRED TYPES FROM DB SCHEMA ---
export type User = InferSelectModel<typeof schema.users>;
export type Event = InferSelectModel<typeof schema.events>;
export type Ticket = InferSelectModel<typeof schema.tickets>;
export type POI = InferSelectModel<typeof schema.pointsOfInterest>;
export type Group = InferSelectModel<typeof schema.groups>;
export type SavedLocation = InferSelectModel<typeof schema.savedLocations>;

// --- MANUAL INTERFACES FOR API & UI ---

export interface TicketInfo {
  code: string;
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
    event: Event;
  };
}

export type POIType = typeof schema.poiTypeEnum.enumValues[number];

// Re-export enums and other useful bits from schema if needed
export {
  mobilityModeEnum,
  poiTypeEnum,
  crowdLevelEnum,
} from '@app/db';
