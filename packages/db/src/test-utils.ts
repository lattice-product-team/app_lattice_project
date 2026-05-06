import { db, sql } from './index';
import * as schema from './schema';

/**
 * Utility to truncate all tables in the database.
 * Use this in `beforeEach` hooks for real database integration tests.
 * WARNING: This will delete all data in the connected database.
 */
export async function truncateAllTables() {
  // Get all table names from the schema
  const tableNames = Object.values(schema)
    .filter((entity: any) => entity && entity.dbName)
    .map((entity: any) => entity.dbName);

  if (tableNames.length === 0) return;

  // Build the truncate query
  const query = sql.raw(`TRUNCATE TABLE ${tableNames.map(name => `"${name}"`).join(', ')} RESTART IDENTITY CASCADE`);
  
  await db.execute(query);
}
