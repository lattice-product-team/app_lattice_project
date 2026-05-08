import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
config({ path: resolve(__dirname, '../../../.env') }); // from packages/db/src to root
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { sql } from 'drizzle-orm';
import { db, pool } from './index';

console.log('DATABASE_URL:', process.env.DATABASE_URL);

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
