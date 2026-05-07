import { db, sql, pool } from './src/index.js';

async function main() {
  console.log('☢️ Nuking database (full reset)...');
  try {
    // 1. Drop all tables in public schema except PostGIS
    const res = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND table_name NOT IN ('spatial_ref_sys')
    `);

    const tables = res.rows.map((r) => r.table_name);
    for (const table of tables) {
      console.log(`Dropping table ${table}...`);
      await db.execute(sql.raw(`DROP TABLE IF EXISTS "public"."${table}" CASCADE`));
    }

    // 2. Drop custom types (ENUMs)
    const typesRes = await db.execute(sql`
      SELECT typname 
      FROM pg_type 
      JOIN pg_namespace ON pg_type.typnamespace = pg_namespace.oid 
      WHERE pg_namespace.nspname = 'public' 
      AND typtype = 'e'
    `);

    const types = typesRes.rows.map((r) => r.typname);
    for (const type of types) {
      console.log(`Dropping type ${type}...`);
      await db.execute(sql.raw(`DROP TYPE IF EXISTS "public"."${type}" CASCADE`));
    }

    // 3. Drop drizzle migrations schema
    console.log(`Dropping drizzle schema...`);
    await db.execute(sql`DROP SCHEMA IF EXISTS "drizzle" CASCADE`);

    console.log('✅ Database fully nuked.');
  } catch (err) {
    console.error('❌ Nuke failed:', err);
  } finally {
    await pool.end();
  }
}

main();
