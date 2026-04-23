import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Explicit exports to avoid resolution issues
export {
  users,
  tickets,
  pointsOfInterest,
  nodes,
  pathSegments,
  groups,
  groupMembers,
  savedLocations,
  offlinePackages,
  mobilityModeEnum,
  poiTypeEnum,
  crowdLevelEnum,
  surfaceTypeEnum,
} from './schema';
export { sql, eq, and, desc, asc } from 'drizzle-orm';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Professional Database Connection Pool Configuration
 *
 * - max: Number of clients in the pool (Increased for high-density telemetry)
 * - idleTimeoutMillis: How long a client is allowed to remain idle before being closed
 * - connectionTimeoutMillis: How long to wait for a connection before timing out
 * - ssl: Required for production environments (e.g., cloud providers)
 */
export const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: isProduction ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }
    : {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'lattice_db',
        password: process.env.DB_PASSWORD || 'password',
        port: Number(process.env.DB_PORT) || 5432,
        max: 10,
        idleTimeoutMillis: 10000,
      }
);

// Log pool errors to prevent process crashes
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const db = drizzle(pool, { schema });
