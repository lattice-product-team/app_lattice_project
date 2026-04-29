import { ExpoConfig, ConfigContext } from 'expo/config';
import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import path from 'path';
import { z } from 'zod';

// Load environment variables from the root .env
const projectRoot = __dirname;
const rootDir = path.resolve(projectRoot, '../../');
const rootEnvPath = path.join(rootDir, '.env');
console.log('📡 [Config] Root Directory:', rootDir);
console.log('📡 [Config] Loading .env from:', rootEnvPath);

const envOutput = dotenv.config({ path: rootEnvPath });
expand(envOutput);

if (envOutput.error) {
  console.error('❌ [Config] Error loading .env file:', envOutput.error);
} else {
  console.log('✅ [Config] .env loaded successfully');
  // Explicitly ensure LAN_IP is in process.env
  if (envOutput.parsed?.LAN_IP) {
    process.env.LAN_IP = envOutput.parsed.LAN_IP;
  }
}

/**
 * Environment Variables Schema
 * Scalable validation for all mobile environment variables.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_URL: z.string().url(),
  GATEWAY_HOST: z.string().default('localhost'),
  GATEWAY_PORT: z.string().default('3000'),
  // Variables provided by scripts (overrides)
  TUNNEL_URL: z.string().url().optional(),
  LAN_IP: z.string().optional(),
});

// Validate process.env against schema
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(parsedEnv.error.format(), null, 2));
  // In a professional setup, we throw to prevent building with invalid config
  throw new Error('Invalid environment variables');
}

const env = parsedEnv.data;

/**
 * Dynamic URL Resolution
 * Prioritizes Tunnel > LAN IP > Default Host
 */
const resolveApiUrl = () => {
  if (env.TUNNEL_URL) return `${env.TUNNEL_URL}/api/v1`;
  if (env.LAN_IP) return `http://${env.LAN_IP}:${env.GATEWAY_PORT}/api/v1`;
  return env.API_URL;
};

const API_URL = resolveApiUrl();
console.log('🌐 [Config] Resolved API_URL:', API_URL);
console.log('📶 [Config] Raw LAN_IP:', env.LAN_IP);

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Lattice',
  slug: 'lattice',
  version: '1.0.0',
  orientation: 'default',
  icon: './assets/images/icon.png',
  scheme: 'lattice',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.cdc.lattice.dev',
    infoPlist: {
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: true,
      },
      NSCameraUsageDescription: 'Lattice uses the camera to display augmented reality navigation and points of interest.',
      NSLocationWhenInUseUsageDescription: 'Allow Lattice to use your location to guide you through the venue.',
      NSLocationAlwaysAndWhenInUseUsageDescription: 'Allow Lattice to use your location to guide you through the venue.',
    },
  },
  android: {
    package: 'com.cdc.lattice.dev',
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    permissions: [
      'CAMERA',
      'RECORD_AUDIO',
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.ACCESS_FINE_LOCATION',
    ],
  },
  web: {
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    [
      'expo-dev-client',
      {
        newArchEnabled: true,
      },
    ],
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          backgroundColor: '#000000',
        },
      },
    ],
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission: 'Allow Lattice to use your location to guide you through the venue.',
        locationWhenInUsePermission: 'Allow Lattice to use your location to guide you through the venue.',
        isAndroidBackgroundLocationEnabled: false,
      },
    ],
    '@maplibre/maplibre-react-native',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: false,
  },
  extra: {
    ...config.extra,
    apiUrl: API_URL,
    nodeEnv: env.NODE_ENV,
    eas: {
      projectId: '2fbc4e45-153f-443a-b152-c034ef3964b0',
    },
  },
});
