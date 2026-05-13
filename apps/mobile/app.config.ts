import { ExpoConfig, ConfigContext } from 'expo/config';
import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import path from 'path';
import { z } from 'zod';

// Load environment variables from the root .env if it exists
const projectRoot = __dirname;
const rootDir = path.resolve(projectRoot, '../../');
const rootEnvPath = path.join(rootDir, '.env');

import * as fs from 'fs';
if (fs.existsSync(rootEnvPath)) {
  const envOutput = dotenv.config({ path: rootEnvPath });
  expand(envOutput);

  // Explicitly ensure LAN_IP is in process.env
  if (envOutput.parsed?.LAN_IP) {
    process.env.LAN_IP = envOutput.parsed.LAN_IP;
  }
} else {
  console.log('ℹ️ [Config] No .env file found at root, relying on environment variables.');
}

/**
 * Environment Variables Schema
 * Scalable validation for all mobile environment variables.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_URL: z.string().url().default('http://localhost:3000/api/v1'),
  GATEWAY_HOST: z.string().default('localhost'),
  GATEWAY_PORT: z.string().default('3000'),
  VALHALLA_PORT: z.string().default('8002'),
  // Variables provided by scripts (overrides)
  TUNNEL_URL: z.string().url().optional(),
  LAN_IP: z.string().optional(),
  GOOGLE_IOS_CLIENT_ID: z.string().optional(),
  GOOGLE_ANDROID_CLIENT_ID: z.string().optional(),
});

// Validate process.env against schema
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    '❌ Invalid environment variables:',
    JSON.stringify(parsedEnv.error.format(), null, 2)
  );
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

const resolveValhallaUrl = () => {
  // Temporary public instance for testing until local is ready
  return 'https://valhalla1.openstreetmap.de';
};

const API_URL = resolveApiUrl();
const VALHALLA_URL = resolveValhallaUrl();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Lattice',
  slug: 'lattice-app',
  owner: 'lattice-organization',
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
      NSCameraUsageDescription:
        'Lattice uses the camera to display augmented reality navigation and points of interest.',
      NSLocationWhenInUseUsageDescription:
        'Allow Lattice to use your location to guide you through events.',
      NSLocationAlwaysAndWhenInUseUsageDescription:
        'Allow Lattice to use your location to guide you through events.',
      NSMicrophoneUsageDescription:
        'Lattice uses the microphone for voice search and commands.',
      NSSpeechRecognitionUsageDescription:
        'Lattice uses speech recognition to help you search for places using your voice.',
    },
  },
  android: {
    package: 'com.lattice.app',
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    permissions: [
      'INTERNET',
      'CAMERA',
      'RECORD_AUDIO',
      'android.permission.RECORD_AUDIO',
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
        newArchEnabled: false,
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
        locationAlwaysAndWhenInUsePermission:
          'Allow Lattice to use your location to guide you through events.',
        locationWhenInUsePermission:
          'Allow Lattice to use your location to guide you through events.',
        isAndroidBackgroundLocationEnabled: false,
      },
    ],
    [
      '@react-native-voice/voice',
      {
        microphonePermission: 'Allow Lattice to access your microphone for voice search.',
        speechRecognitionPermission: 'Allow Lattice to recognize your speech for commands.',
      },
    ],
    '@maplibre/maplibre-react-native',

    'expo-web-browser',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: false,
  },
  extra: {
    ...config.extra,
    apiUrl: API_URL,
    valhallaUrl: VALHALLA_URL,
    nodeEnv: env.NODE_ENV,
    mapTilerKey: process.env.MAPTILER_KEY || 'iqk4irD5FCOr6M6VHVWZ',
    googleIosClientId: env.GOOGLE_IOS_CLIENT_ID || 'missing-ios-client-id',
    googleAndroidClientId: env.GOOGLE_ANDROID_CLIENT_ID || 'missing-android-client-id',
    eas: {
      projectId: '6778ec40-b372-4c34-8df4-aef0c4bbf887',
    },
  },
});
