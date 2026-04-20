import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { sql } from 'drizzle-orm';
import { db, pool } from './index.js';

async function main() {
  console.log('Running migrations...');
  try {
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS postgis;`);
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
