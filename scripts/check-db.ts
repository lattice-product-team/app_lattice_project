import { db, sql } from '@app/db';
import { loadConfig } from '@app/core';

async function checkConnectivity() {
  const env = loadConfig();
  console.log(
    `[DB Check] Attempting to connect to: ${env.DATABASE_URL.replace(/:[^:@]+@/, ':***@')}`
  );

  try {
    const result = await db.execute(sql`SELECT 1 as connected`);
    console.log('✅ Database connectivity verified!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connectivity FAILED:', error);
    process.exit(1);
  }
}

checkConnectivity();
