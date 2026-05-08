import { z } from 'zod';
import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Backend Environment Schema
 * Centralized validation for all microservices and packages.
 */
const backendEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Database
  DATABASE_URL: z.string().url(),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().transform(String).default('5432'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('password'),
  DB_NAME: z.string().default('lattice_db'),
  DB_SSL: z.enum(['true', 'false']).default('false'),


  // Redis
  REDIS_URL: z.string().url().optional(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform(String).default('6379'),

  // Services
  API_PORT: z.string().transform(Number).default(3000),
  API_BASE_PATH: z.string().default(''),

  // Security
  JWT_SECRET: z.string().default('development_secret_do_not_use_in_prod'),
  BCRYPT_ROUNDS: z.string().transform(Number).default(10),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000,http://localhost:3004'),
});

export type BackendEnv = z.infer<typeof backendEnvSchema>;

let cachedConfig: BackendEnv | null = null;

/**
 * Loads and validates the monorepo environment.
 * Uses cached version if already loaded.
 */
export const loadConfig = (options?: { forceReload?: boolean }): BackendEnv => {
  if (cachedConfig && !options?.forceReload) {
    return cachedConfig;
  }

  // Find root .env by walking up from this package
  // packages/core/src/config.ts -> packages/core/src -> packages/core -> packages -> root
  const rootDir = path.resolve(__dirname, '../../../');
  const envPath = path.join(rootDir, '.env');

  const envOutput = dotenv.config({ path: envPath });
  expand(envOutput);

  const parsed = backendEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      '❌ Invalid backend environment variables:',
      JSON.stringify(parsed.error.format(), null, 2)
    );
    throw new Error('Invalid backend environment configuration');
  }

  cachedConfig = parsed.data;
  return cachedConfig;
};
