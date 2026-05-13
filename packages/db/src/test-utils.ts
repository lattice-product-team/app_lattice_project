import { db, sql } from './index.js';
import * as schema from './schema.js';
import { getTableConfig } from 'drizzle-orm/pg-core';

/**
 * Utility to truncate all tables in the database.
 * Use this in `beforeEach` hooks for real database integration tests.
 * WARNING: This will delete all data in the connected database.
 */
export async function truncateAllTables() {
  // Get all table names from the schema using getTableConfig
  const tableNames = Object.values(schema)
    .map((entity: any) => {
      try {
        return getTableConfig(entity).name;
      } catch {
        return null;
      }
    })
    .filter((name): name is string => !!name);

  if (tableNames.length === 0) return;

  // Build the truncate query
  const query = sql.raw(
    `TRUNCATE TABLE ${tableNames.map((name) => `"${name}"`).join(', ')} RESTART IDENTITY CASCADE`
  );

  await db.execute(query);
}
