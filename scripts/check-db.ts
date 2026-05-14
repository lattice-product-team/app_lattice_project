import pkg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pkg;

// Manual .env loader to avoid extra dependencies
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        // Remove quotes if present
        if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
          value = value.substring(1, value.length - 1);
        }
        if (!process.env[key]) process.env[key] = value;
      }
    });
  }
}

async function checkConnectivity() {
  loadEnv();
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL environment variable is missing');
    process.exit(1);
  }

  console.log(`[DB Check] Attempting to connect to: ${dbUrl.replace(/:[^:@]+@/, ':***@')}`);

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
