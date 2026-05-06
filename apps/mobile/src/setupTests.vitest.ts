import { vi } from 'vitest';

// Vitest mocks use vi instead of jest
vi.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: vi.fn(() =>
    Promise.resolve({ status: 'granted', canAskAgain: true })
  ),
  getForegroundPermissionsAsync: vi.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: vi.fn(() =>
    Promise.resolve({
      coords: { latitude: 41.3863, longitude: 2.106 },
    })
  ),
  watchPositionAsync: vi.fn((options, callback) => {
    callback({ coords: { latitude: 41.3863, longitude: 2.106 } });
    return Promise.resolve({ remove: vi.fn() });
  }),
  getLastKnownPositionAsync: vi.fn(() =>
    Promise.resolve({
      coords: { latitude: 41.3863, longitude: 2.106 },
    })
  ),
  Accuracy: { High: 4 },
}));

vi.mock('expo-haptics', () => ({
  impactAsync: vi.fn(),
  notificationAsync: vi.fn(),
  selectionAsync: vi.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
}));

vi.mock('@maplibre/maplibre-react-native', () => ({
  default: {
    MapView: ({ children }: { children: any }) => children,
    Camera: ({ children }: { children: any }) => children,
    UserLocation: () => null,
    MarkerView: ({ children }: { children: any }) => children,
    setAccessToken: vi.fn(),
    Logger: { setLogCallback: vi.fn() },
    UserTrackingMode: { FollowWithHeading: 'FollowWithHeading' },
  },
  MapView: ({ children }: { children: any }) => children,
  Camera: ({ children }: { children: any }) => children,
  UserLocation: () => null,
  MarkerView: ({ children }: { children: any }) => children,
  setAccessToken: vi.fn(),
  Logger: { setLogCallback: vi.fn() },
  UserTrackingMode: { FollowWithHeading: 'FollowWithHeading' },
}));

vi.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

vi.mock('react-native-mmkv', () => ({
  createMMKV: vi.fn(() => ({
    set: vi.fn(),
    getString: vi.fn(),
    getNumber: vi.fn(),
    getBoolean: vi.fn(),
    contains: vi.fn(),
    delete: vi.fn(),
    getAllKeys: vi.fn(),
    clearAll: vi.fn(),
  })),
}));

