import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from '../packages/db/src/schema';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function checkEvent() {
  const result = await db.select().from(schema.events);
  console.log('--- ALL EVENTS ---');
  result.forEach(e => {
    console.log(`ID: ${e.id}, Name: ${e.name}, Featured: ${e.isFeatured}`);
  });
  
  const id8 = result.find(e => e.id === 8);
  console.log('--- EVENT ID 8 ---');
  console.log(id8 ? JSON.stringify(id8, null, 2) : 'NOT FOUND');
  process.exit(0);
}

checkEvent().catch(err => {
  console.error(err);
  process.exit(1);
});
