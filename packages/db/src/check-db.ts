import 'dotenv/config';
import { pool } from './index.js';

async function check() {
  const client = await pool.connect();
  try {
    console.log('Checking database status...');

    // Check tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables:', tables.rows.map((r: any) => r.table_name).join(', '));

    // Check mobility_mode column type in users table
    const columnInfo = await client.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'mobility_mode'
    `);
    console.log('Column info:', columnInfo.rows[0]);

    // Check if mobility_mode enum exists
    const typeInfo = await client.query(`
      SELECT typname FROM pg_type WHERE typname = 'mobility_mode'
    `);
    console.log('mobility_mode enum exists:', typeInfo.rows.length > 0);

    // Check migrations table
    const migrations = await client.query('SELECT * FROM drizzle_migrations');
    console.log('Applied migrations:', migrations.rows);
  } catch (err) {
    console.error('Check failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

check();
