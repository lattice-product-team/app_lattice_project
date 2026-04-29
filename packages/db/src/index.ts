import { loadConfig } from '@app/core';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Load validated config
const env = loadConfig();

// Explicit exports to avoid resolution issues
export {
  users,
  venues,
  events,
  tickets,
  pointsOfInterest,
  telemetryLogs,
  nodes,
  pathSegments,
  groups,
  groupMembers,
  savedLocations,
  offlinePackages,
  mobilityModeEnum,
  poiTypeEnum,
  eventTypeEnum,
  crowdLevelEnum,
  surfaceTypeEnum,
} from './schema';
export { sql, eq, and, desc, asc } from 'drizzle-orm';

const isProduction = env.NODE_ENV === 'production';

/**
 * Professional Database Connection Pool Configuration
 */
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  max: isProduction ? 20 : 10,
  idleTimeoutMillis: isProduction ? 30000 : 10000,
  connectionTimeoutMillis: 2000,
});

// Log pool errors to prevent process crashes
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const db = drizzle(pool, { schema });
