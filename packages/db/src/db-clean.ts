import { db, pool } from './index';
import { sql } from 'drizzle-orm';

async function clean() {
  console.log('Cleaning database...');

  const tables = [
    'group_members',
    'groups',
    'offline_packages',
    'path_segments',
    'nodes',
    'tickets',
    'saved_locations',
    'points_of_interest',
    'events',
    'users',
  ];

  try {
    for (const table of tables) {
      const exists = await db.execute(
        sql.raw(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = '${table}'
        )
      `)
      );

      if (exists.rows[0].exists) {
        console.log(`Truncating ${table}...`);
        await db.execute(sql.raw(`TRUNCATE TABLE "${table}" CASCADE`));
      } else {
        console.log(`Skipping ${table} (does not exist)`);
      }
    }
    console.log('Database cleaned successfully.');
  } catch (error) {
    console.error('Error cleaning database:', error);
  } finally {
    await pool.end();
  }
}

clean();
