import 'dotenv/config';
import { pool } from './index.js';

async function debug() {
  const client = await pool.connect();
  try {
    console.log('--- DB DEBUG START ---');

    // 1. Check current state
    const colInfo = await client.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'mobility_mode'
    `);

    if (colInfo.rows.length === 0) {
      console.log('Column mobility_mode does not exist in users table!');
    } else {
      console.log('Current column info:', colInfo.rows[0]);
    }

    // 2. Check types
    const types = await client.query(`
      SELECT n.nspname as schema, t.typname as type 
      FROM pg_type t 
      JOIN pg_namespace n ON n.oid = t.typnamespace 
      WHERE t.typname IN ('mobility_mode', 'mobility_profile')
    `);
    console.log('Existing types:', types.rows);

    // 3. Try the migration step that is failing
    console.log('Attempting the problematic ALTER TABLE...');
    const migrationSQL = `
      ALTER TABLE "users" ALTER COLUMN "mobility_mode" DROP DEFAULT;
      ALTER TABLE "users" ALTER COLUMN "mobility_mode" SET DATA TYPE "mobility_mode" USING "mobility_mode"::text::"mobility_mode";
      ALTER TABLE "users" ALTER COLUMN "mobility_mode" SET DEFAULT 'standard';
    `;

    await client.query(migrationSQL);
    console.log('SUCCESS: Migration step applied manually.');
  } catch (err: any) {
    console.error('FAILED: Migration step failed.');
    console.error('Error Message:', err.message);
    console.error('Hint:', err.hint);
  } finally {
    client.release();
    await pool.end();
    console.log('--- DB DEBUG END ---');
  }
}

debug();
