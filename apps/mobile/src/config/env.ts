import Constants from 'expo-constants';

/**
 * Environment Configuration
 * 
 * Centralized, type-safe accessor for environment variables.
 * These are injected via app.config.ts into expoConfig.extra.
 */

interface EnvConfig {
  apiUrl: string;
  nodeEnv: string;
}

// Get the config from extra
const extra = Constants.expoConfig?.extra;

if (!extra || !extra.apiUrl) {
  // This should ideally never happen due to Zod validation in app.config.ts
  console.warn('⚠️  Environment configuration is missing or incomplete!');
}

export const Env: EnvConfig = {
  apiUrl: extra?.apiUrl || 'http://localhost:3000/api/v1',
  nodeEnv: extra?.nodeEnv || 'development',
};

export default Env;
