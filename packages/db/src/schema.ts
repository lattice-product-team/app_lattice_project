import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  timestamp,
  integer,
  pgEnum,
  doublePrecision,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { geometry } from './custom-types';

// ---------------------------------------------------------
// ENUMS
// ---------------------------------------------------------

export const mobilityModeEnum = pgEnum('mobility_mode', [
  'standard',
  'wheelchair',
  'reduced_mobility',
  'visual_impairment',
  'family_stroller',
]);

export const poiTypeEnum = pgEnum('poi_type', [
  'restaurant',
  'wc',
  'grandstand',
  'gate',
  'medical',
  'shop',
  'parking',
  'meetup_point',
]);

export const crowdLevelEnum = pgEnum('crowd_level', ['low', 'moderate', 'high', 'blocked']);

export const surfaceTypeEnum = pgEnum('surface_type', [
  'asphalt',
  'grass',
  'gravel',
  'stairs',
  'ramp',
]);

// ---------------------------------------------------------
// TABLES
// ---------------------------------------------------------

export const venues = pgTable('venues', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  boundary: geometry('boundary'), // Polygon for venue area
  center: geometry('center'), // Default map center
  primaryColor: varchar('primary_color', { length: 7 }).default('#ff382e'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  venueId: integer('venue_id')
    .references(() => venues.id),
  name: varchar('name').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email').unique().notNull(),
  passwordHash: varchar('password_hash').notNull(),
  fullName: varchar('full_name'),
  mobilityMode: mobilityModeEnum('mobility_mode').default('standard'),
  avoidStairs: boolean('avoid_stairs').default(false),
  avoidCrowds: boolean('avoid_crowds').default(false),
  avoidSlopes: boolean('avoid_slopes').default(false),
  avoidGrandstands: boolean('avoid_grandstands').default(false),
  hasTicket: boolean('has_ticket').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id),
  venueId: integer('venue_id')
    .references(() => venues.id),
  eventId: integer('event_id')
    .references(() => events.id),
  code: varchar('code').unique(),
  ownerEmail: varchar('owner_email'),
  gate: varchar('gate'),
  zoneName: varchar('zone_name'),
  seatRow: varchar('seat_row'),
  seatNumber: varchar('seat_number'),
  seatLocation: geometry('seat_location'), // Using point geometry
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at'),
});

export const pointsOfInterest = pgTable('points_of_interest', {
  id: serial('id').primaryKey(),
  venueId: integer('venue_id')
    .references(() => venues.id),
  name: varchar('name').unique().notNull(),
  description: text('description'),
  type: poiTypeEnum('type').notNull(),
  location: geometry('location').notNull(),
  crowdLevel: crowdLevelEnum('crowd_level').default('low'),
  isWheelchairAccessible: boolean('is_wheelchair_accessible').default(true),
  hasPriorityLane: boolean('has_priority_lane'),
});

export const nodes = pgTable('nodes', {
  id: serial('id').primaryKey(),
  venueId: integer('venue_id')
    .references(() => venues.id),
  location: geometry('location').notNull(),
  name: varchar('name'), // Optional name for key intersections
});

export const pathSegments = pgTable('path_segments', {
  id: serial('id').primaryKey(),
  venueId: integer('venue_id')
    .references(() => venues.id),
  sourceNodeId: integer('source_node_id')
    .notNull()
    .references(() => nodes.id),
  targetNodeId: integer('target_node_id')
    .notNull()
    .references(() => nodes.id),
  distance: doublePrecision('distance').notNull(), // Pre-calculated meters
  surface: surfaceTypeEnum('surface').default('asphalt'),
  slopePercentage: doublePrecision('slope_percentage').default(0),
  hasStairs: boolean('has_stairs').default(false),
  crowdLevel: crowdLevelEnum('crowd_level').default('low'),
});

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: varchar('name'),
  inviteCode: varchar('invite_code').unique(),
  createdBy: integer('created_by').references(() => users.id),
  meetingPoint: geometry('meeting_point'),
  createdAt: timestamp('created_at'),
});

export const groupMembers = pgTable(
  'group_members',
  {
    userId: integer('user_id').references(() => users.id),
    groupId: integer('group_id').references(() => groups.id),
    joinedAt: timestamp('joined_at'),
    lastLocation: geometry('last_location'),
    lastUpdated: timestamp('last_updated'),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.groupId] }),
  })
);

export const savedLocations = pgTable('saved_locations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  label: varchar('label'),
  location: geometry('location'),
  createdAt: timestamp('created_at'),
});

export const offlinePackages = pgTable('offline_packages', {
  id: integer('id').primaryKey(), // Explicit integer in DBML
  regionName: varchar('region_name'),
  fileUrl: varchar('file_url'),
  version: varchar('version'),
  sizeMb: doublePrecision('size_mb'),
});

export const telemetryLogs = pgTable('telemetry_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  eventId: integer('event_id').references(() => events.id),
  location: geometry('location').notNull(),
  timestamp: timestamp('timestamp').defaultNow(),
});

