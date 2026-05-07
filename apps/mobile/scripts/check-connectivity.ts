import net from 'net';
import os from 'os';

/**
 * check-connectivity.ts
 *
 * Validates that the MacBook is reachable from the external network.
 * This helps detect Firewall or Hotspot isolation issues before starting development.
 */

const PORTS = [3000, 8081];

function getLocalIP() {
  const interfaces = os.networkInterfaces();

  // Prioritize iPhone Hotspot (bridge100) or WiFi (en0)
  const priorityInterfaces = ['bridge100', 'en0', 'en1'];

  for (const name of priorityInterfaces) {
    const iface = interfaces[name];
    if (iface) {
      for (const entry of iface) {
        if (entry.family === 'IPv4' && !entry.internal) {
          return entry.address;
        }
      }
    }
  }

  // Fallback to any non-internal IPv4
  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    if (iface) {
      for (const entry of iface) {
        if (entry.family === 'IPv4' && !entry.internal) {
          return entry.address;
        }
      }
    }
  }

  return '127.0.0.1';
}

async function checkPort(ip: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);

    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, ip);
  });
}

async function main() {
  const ip = getLocalIP();
  console.log(`\n🔍 Checking connectivity on IP: ${ip}...`);

  if (ip === '127.0.0.1') {
    console.warn('⚠️  Could not find an external IP. Are you connected to a network?');
    return;
  }

  let allOk = true;
  for (const port of PORTS) {
    const isReachable = await checkPort(ip, port);
    if (isReachable) {
      console.log(`✅ Port ${port} is reachable from external devices.`);
    } else {
      console.warn(`❌ Port ${port} is NOT reachable on ${ip}.`);
      allOk = false;
    }
  }

  if (!allOk) {
    console.log('\n---------------------------------------------------------');
    console.log('🛑 ACTION REQUIRED: NETWORK BLOCK DETECTED');
    console.log('---------------------------------------------------------');
    console.log("Your phone probably won't be able to connect to the API.");
    console.log('Please check:');
    console.log('1. System Settings > Network > Firewall: Is it ON? (Turn it OFF for dev)');
    console.log(
      '2. System Settings > Network > Firewall > Options: Is "Block all incoming connections" ON?'
    );
    console.log('3. If using Personal Hotspot: Try toggling it OFF and ON again.');
    console.log('---------------------------------------------------------\n');
  } else {
    console.log('✨ All systems ready! Scan the QR code with confidence.\n');
  }
}

main();
