import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

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
