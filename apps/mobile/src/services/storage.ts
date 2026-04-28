import { createMMKV } from 'react-native-mmkv';

// Safe initialization for Web/SSR environments
const isNative = typeof pnpm === 'undefined'; // Simple check, or use Platform.OS
export const storage = typeof createMMKV !== 'undefined' 
  ? createMMKV() 
  : {
      set: () => {},
      getString: () => null,
      getNumber: () => null,
      getBoolean: () => null,
      delete: () => {},
      getAllKeys: () => [],
      clearAll: () => {},
      recuprate: () => {}, // mock for any other methods used
    } as any;

export const mmkvStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.remove(name),
};

export const getToken = (): string | null => {
  try {
    const authData = storage.getString('auth-storage');
    if (!authData) return null;
    const parsed = JSON.parse(authData);
    return parsed.state?.token || null;
  } catch (e) {
    return null;
  }
};
