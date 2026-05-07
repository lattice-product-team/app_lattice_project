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
import { geometry, polygon } from './custom-types';

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
  'bar',
  'information',
  'entrance',
  'exit',
  'emergency',
  'stage',
  'merch',
  'security',
]);

export const crowdLevelEnum = pgEnum('crowd_level', ['low', 'moderate', 'high', 'blocked']);

export const surfaceTypeEnum = pgEnum('surface_type', [
  'asphalt',
  'grass',
  'gravel',
  'stairs',
  'ramp',
]);

export const eventTypeEnum = pgEnum('event_type', [
  'music',
  'food',
  'tech',
  'sports',
  'generic',
]);

export const operationalStatusEnum = pgEnum('operational_status', [
  'open',
  'closed',
  'maintenance',
]);

// ---------------------------------------------------------
// TABLES
// ---------------------------------------------------------

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  description: text('description'),
  type: eventTypeEnum('type').default('generic'),
  location: geometry('location'),
  locationName: varchar('location_name'),
  address: text('address'),
  boundary: polygon('boundary'),
  imageUrl: text('image_url'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  isPermanent: boolean('is_permanent').default(false),
  primaryColor: varchar('primary_color', { length: 7 }).default('#ff382e'),
  metadata: text('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email').unique().notNull(),
  passwordHash: varchar('password_hash').notNull(),
  fullName: varchar('full_name'),
  googleId: varchar('google_id').unique(),
  appleId: varchar('apple_id').unique(),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  isPasskeyEnabled: boolean('is_passkey_enabled').default(false),
  mobilityMode: mobilityModeEnum('mobility_mode').default('standard'),
  avoidStairs: boolean('avoid_stairs').default(false),
  avoidCrowds: boolean('avoid_crowds').default(false),
  avoidSlopes: boolean('avoid_slopes').default(false),
  avoidGrandstands: boolean('avoid_grandstands').default(false),
  hasTicket: boolean('has_ticket').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const passkeyCredentials = pgTable('passkey_credentials', {
  id: varchar('id').primaryKey(), // Credential ID
  userId: integer('user_id').references(() => users.id).notNull(),
  publicKey: text('public_key').notNull(),
  counter: integer('counter').default(0),
  deviceType: varchar('device_type'),
  backedUp: boolean('backed_up').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  eventId: integer('event_id').references(() => events.id),
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
  eventId: integer('event_id').references(() => events.id),
  name: varchar('name').unique().notNull(),
  description: text('description'),
  type: poiTypeEnum('type').notNull(),
  location: geometry('location').notNull(),
  locationName: varchar('location_name'),
  address: text('address'),
  capacity: integer('capacity'),
  currentOccupancy: integer('current_occupancy'),
  status: operationalStatusEnum('status').default('open'),
  metadata: text('metadata'),
  crowdLevel: crowdLevelEnum('crowd_level').default('low'),
  isWheelchairAccessible: boolean('is_wheelchair_accessible').default(true),
  hasPriorityLane: boolean('has_priority_lane'),
});

export const nodes = pgTable('nodes', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => events.id),
  location: geometry('location').notNull(),
  name: varchar('name'), // Optional name for key intersections
});

export const pathSegments = pgTable('path_segments', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => events.id),
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
