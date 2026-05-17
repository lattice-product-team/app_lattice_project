import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Onboarding Script for App Lattice
 * 
 * This script automates the developer environment setup:
 * 1. Checks prerequisites (Node, pnpm, Docker)
 * 2. Initializes .env from .env.example
 * 3. Installs dependencies
 * 4. Starts infrastructure services (Postgres, Redis, Valhalla)
 * 5. Runs database migrations
 * 6. Seeds initial data
 */

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

function log(message: string, color = colors.blue) {
  console.log(`${color}${colors.bright}>>> ${message}${colors.reset}`);
}

function run(command: string, description: string) {
  log(description, colors.cyan);
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`${colors.red}❌ Error executing command: ${command}${colors.reset}`);
    process.exit(1);
  }
}

async function main() {
  console.log(`\n${colors.blue}${colors.bright}========================================`);
  console.log(`   🏗️  LATTICE PROJECT ONBOARDING      `);
  console.log(`========================================${colors.reset}\n`);

  // 1. Check Prerequisites
  log("Checking prerequisites...");
  const checks = [
    { name: 'pnpm', cmd: 'pnpm --version' },
    { name: 'docker', cmd: 'docker --version' },
    { name: 'docker compose', cmd: 'docker compose version' },
  ];

  for (const check of checks) {
    try {
      execSync(check.cmd, { stdio: 'ignore' });
      console.log(`  ✅ ${check.name} found`);
    } catch (e) {
      console.error(`  ❌ ${check.name} NOT found. Please install it to continue.`);
      process.exit(1);
    }
  }

  // 2. Setup .env
  log("Initializing environment files...");
  const envPath = path.resolve(process.cwd(), '.env');
  const envExamplePath = path.resolve(process.cwd(), '.env.example');

  if (!fs.existsSync(envPath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log("  ✅ Created .env from .env.example");
  } else {
    console.log("  ℹ️  .env file already exists, skipping copy");
  }

  // 3. Install Dependencies
  run("pnpm install", "Installing project dependencies...");

  // 4. Start Infrastructure
  run("docker compose up -d db redis valhalla", "Starting Docker infrastructure services...");

  // 5. Wait for Database
  log("Waiting for database to be ready...");
  let retries = 10;
  let connected = false;
  while (retries > 0 && !connected) {
    try {
      execSync("npx tsx scripts/check-db.ts", { stdio: 'ignore' });
      connected = true;
      console.log("  ✅ Database is ready!");
    } catch (e) {
      retries--;
      if (retries > 0) {
        process.stdout.write(`  ⏳ Still waiting for DB (${retries} retries left)... \r`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }

  if (!connected) {
    console.error("\n  ❌ Database failed to start or connection timeout.");
    process.exit(1);
  }

  // 6. Database Schema
  run("pnpm db:generate", "Generating database client...");
  run("pnpm db:migrate", "Running migrations...");

  // 7. Seed Data
  run("pnpm db:seed", "Seeding initial development data...");

  // 8. Success Summary
  console.log(`\n${colors.green}${colors.bright}========================================`);
  console.log(`   ✨ ONBOARDING COMPLETE! ✨           `);
  console.log(`========================================${colors.reset}`);
  console.log(`\nNext steps:`);
  console.log(`  1. Update ${colors.yellow}.env${colors.reset} with your local IP and API keys.`);
  console.log(`  2. Run ${colors.blue}pnpm dev${colors.reset} to start all services.`);
  console.log(`  3. Open ${colors.cyan}http://localhost:3004${colors.reset} for the Admin Web.`);
  console.log(`\nHappy coding! 🚀\n`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
