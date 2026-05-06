import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.vitest.ts'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react-native': 'react-native-web',
    },

    include: [
      'src/utils/__tests__/**/*.{test,spec}.{ts,tsx}',
      'src/hooks/__tests__/**/*.{test,spec}.{ts,tsx}',
      'src/services/__tests__/**/*.{test,spec}.{ts,tsx}',
    ],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
  },
});
