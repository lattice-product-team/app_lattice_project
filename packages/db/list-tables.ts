import { db, sql, pool } from './src/index.js';

async function main() {
  try {
    const res = await db.execute(
      sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    );
    console.log(
      'Tables:',
      res.rows.map((r) => r.table_name)
    );
  } catch (err) {
    console.error('Failed to list tables:', err);
  } finally {
    await pool.end();
  }
}

main();
