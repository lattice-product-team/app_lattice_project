import fs from 'fs';
import path from 'path';

/**
 * sync-env.ts
 * 
 * Synchronizes variables from the root .env to apps/mobile/.env
 * and prefixes them with EXPO_PUBLIC_ for Expo compatibility.
 */

const ROOT_ENV_PATH = path.join(process.cwd(), './.env');
const ROOT_ENV_EXAMPLE_PATH = path.join(process.cwd(), './.env.example');
const MOBILE_ENV_PATH = path.join(process.cwd(), './apps/mobile/.env');

// Variables to sync and their desired EXPO_PUBLIC_ names
// If the key is just a string, it will be prefixed as EXPO_PUBLIC_<KEY>
const VARS_TO_SYNC = [
  'NODE_ENV',
  'API_URL',
  'GATEWAY_HOST',
  'GATEWAY_PORT',
];

function syncEnv() {
  let envContent = '';

  if (fs.existsSync(ROOT_ENV_PATH)) {
    envContent = fs.readFileSync(ROOT_ENV_PATH, 'utf-8');
  } else if (fs.existsSync(ROOT_ENV_EXAMPLE_PATH)) {
    console.warn('⚠️  .env not found, using .env.example as source');
    envContent = fs.readFileSync(ROOT_ENV_EXAMPLE_PATH, 'utf-8');
  } else {
    console.error('❌ No .env or .env.example found at root!');
    process.exit(1);
  }

  const lines = envContent.split('\n');
  const mobileLines: string[] = [
    '# ==========================================',
    '# AUTO-GENERATED FROM ROOT .ENV',
    '# DO NOT EDIT MANUALLY',
    '# ==========================================',
    '',
  ];

  const envVars: Record<string, string> = {};

  // Simple parse of .env file
  lines.forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      
      // Remove quotes if present
      value = value.replace(/(^['"]|['"]$)/g, '');
      envVars[key] = value;
    }
  });

  // Check for --ip argument to override GATEWAY_HOST (useful for LAN/Hotspot)
  const args = process.argv.slice(2);
  const ipArgIndex = args.indexOf('--ip');
  if (ipArgIndex !== -1 && args[ipArgIndex + 1]) {
    const customIp = args[ipArgIndex + 1];
    console.log(`📡 Overriding GATEWAY_HOST with IP: ${customIp}`);
    envVars['GATEWAY_HOST'] = customIp;
  }

  // Perform variable interpolation if needed (simple ${VAR} support)
  const interpolate = (val: string): string => {
    return val.replace(/\${(\w+)}/g, (_, name) => {
      return envVars[name] || '';
    });
  };

  VARS_TO_SYNC.forEach(key => {
    if (envVars[key] !== undefined) {
      const interpolatedValue = interpolate(envVars[key]);
      mobileLines.push(`EXPO_PUBLIC_${key}=${interpolatedValue}`);
    }
  });

  fs.writeFileSync(MOBILE_ENV_PATH, mobileLines.join('\n'));
  console.log(`✅ Synced ${VARS_TO_SYNC.length} variables to ${MOBILE_ENV_PATH}`);
}

syncEnv();
