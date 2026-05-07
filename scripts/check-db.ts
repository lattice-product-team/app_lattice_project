import pkg from 'pg';
const { Client } = pkg;

async function checkConnectivity() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL environment variable is missing');
    process.exit(1);
  }

  console.log(
    `[DB Check] Attempting to connect to: ${dbUrl.replace(/:[^:@]+@/, ':***@')}`
  );

  const client = new Client({
    connectionString: dbUrl,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  try {
    await client.connect();
    await client.query('SELECT 1 as connected');
    console.log('✅ Database connectivity verified!');
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connectivity FAILED:', error);
    process.exit(1);
  }
}

checkConnectivity();
