import * as fs from 'fs';
import { ExpoConfig, ConfigContext } from 'expo/config';
import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import path from 'path';
import { z } from 'zod';

// Load environment variables from the root .env if it exists
const projectRoot = __dirname;
const rootDir = path.resolve(projectRoot, '../../');
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
const rootEnvPath = path.join(rootDir, envFile);

// Prevents redundant logging during Expo's multiple config evaluations
const shouldLog = !process.env.APP_CONFIG_LOADED;

if (fs.existsSync(rootEnvPath)) {
  if (shouldLog) console.log(`ℹ️ [Config] Loading environment from ${envFile}`);
  const envOutput = dotenv.config({ path: rootEnvPath });
  expand(envOutput);

  // Explicitly ensure LAN_IP is in process.env
  if (envOutput.parsed?.LAN_IP) {
    process.env.LAN_IP = envOutput.parsed.LAN_IP;
  }
} else {
  // Fallback to .env if .env.production doesn't exist
  const fallbackPath = path.join(rootDir, '.env');
  if (fs.existsSync(fallbackPath)) {
    if (shouldLog) console.log('ℹ️ [Config] Falling back to .env');
    const envOutput = dotenv.config({ path: fallbackPath });
    expand(envOutput);
  } else {
    if (shouldLog) console.log('ℹ️ [Config] No .env files found, relying on environment variables.');
  }
}
process.env.APP_CONFIG_LOADED = 'true';

/**
 * Environment Variables Schema
 * Scalable validation for all mobile environment variables.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_URL: z.string().url().default('http://localhost:3000'),
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

const resolveApiUrl = () => {
  // Always use API_URL in production, ignore LAN_IP
  if (process.env.NODE_ENV === 'production') return env.API_URL;
  if (env.TUNNEL_URL) return env.TUNNEL_URL;
  if (env.LAN_IP) return `http://${env.LAN_IP}:${env.GATEWAY_PORT}`;
  return env.API_URL;
};

const resolveValhallaUrl = () => {
  // Temporary public instance for testing until local is ready
  return 'https://valhalla1.openstreetmap.de';
};

const API_URL = resolveApiUrl();
const VALHALLA_URL = resolveValhallaUrl();

const androidScheme = env.GOOGLE_ANDROID_CLIENT_ID
  ? `com.googleusercontent.apps.${env.GOOGLE_ANDROID_CLIENT_ID.split('.apps.googleusercontent.com')[0]}`
  : undefined;

if (shouldLog) {
  console.log('------------------------------------');
  console.log(`🚀 [Config] Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 [Config] API_URL: ${API_URL}`);
  console.log('------------------------------------');
}

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
      NSMicrophoneUsageDescription: 'Lattice uses the microphone for voice search and commands.',
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
    navigationBar: {
      barStyle: 'dark-content',
      backgroundColor: '#00000000',
    },
    predictiveBackGestureEnabled: false,
    permissions: [
      'INTERNET',
      'CAMERA',
      'RECORD_AUDIO',
      'android.permission.RECORD_AUDIO',
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.ACCESS_FINE_LOCATION',
    ],
    intentFilters: androidScheme
      ? [
          {
            action: 'VIEW',
            category: ['BROWSABLE', 'DEFAULT'],
            data: {
              scheme: androidScheme,
            },
          },
        ]
      : [],
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
    'expo-screen-orientation',
    './plugins/withAndroidBuildFix',
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
