import { spawn } from 'child_process';
import os from 'os';

/**
 * dev-lan.ts
 * 
 * Orchestrates the LAN development environment startup.
 * 1. Detects IP
 * 2. Syncs Env
 * 3. Starts Expo
 * 4. Runs Diagnostics
 */

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  const priorityInterfaces = ['bridge100', 'en0', 'en1'];
  
  for (const name of priorityInterfaces) {
    const iface = interfaces[name];
    if (iface) {
      for (const entry of iface) {
        if (entry.family === 'IPv4' && !entry.internal) return entry.address;
      }
    }
  }
  
  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    if (iface) {
      for (const entry of iface) {
        if (entry.family === 'IPv4' && !entry.internal) return entry.address;
      }
    }
  }
  return '127.0.0.1';
}

async function runCommand(command: string, args: string[], envOverrides: Record<string, string> = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, ...envOverrides }
    });
    child.on('exit', resolve);
  });
}

async function main() {
  const ip = getLocalIP();
  console.log(`\n📡 LATTICE DEV ENGINE: Starting on LAN IP ${ip}\n`);

  // 1. Sync Environment
  console.log('🔄 Syncing environment variables...');
  await runCommand('pnpm', ['--dir', '../..', 'env:sync', '--', '--ip', ip]);

  // 2. Prepare Expo Environment
  const expoEnv = {
    HOST: ip,
    REACT_NATIVE_PACKAGER_HOSTNAME: ip,
    EXPO_USE_DEV_CLIENT: 'true',
  };

  // 3. Start Expo in background-like manner but keep stdio
  console.log('🚀 Starting Metro Bundler...\n');
  
  // We start expo and then run diagnostics in parallel after a short delay
  const expoProcess = spawn('npx', ['expo', 'start', '--dev-client', '--host', 'lan', '--scheme', 'lattice'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, ...expoEnv }
  });

  // 4. Run Diagnostics after 5 seconds (enough time for Metro to bind)
  setTimeout(async () => {
    console.log('\n⏱️ Running connectivity diagnostics...');
    // We don't use 'inherit' here to keep the terminal clean while Expo is running
    spawn('npx', ['tsx', './scripts/check-connectivity.ts'], {
      stdio: 'inherit',
      shell: true
    });
  }, 8000);

  expoProcess.on('exit', (code) => {
    process.exit(code || 0);
  });
}

main();
