@## 1. Dependency Sanitization

- [x] 1.1 Remove `expo`, `react`, and `react-native` from the root `package.json`
- [x] 1.2 Remove any other mobile-specific packages accidentally hoisted to root `dependencies`
- [x] 1.3 Run `pnpm install` at the root to refresh the lockfile and node_modules

## 2. Environment & Code Cleanup

- [x] 2.1 Delete any redundant `App.tsx` or `index.js` at the root level
- [x] 2.2 Verify `apps/mobile/package.json` entry point is exactly `"main": "expo-router/entry"`
- [x] 2.3 Set `useNativeBlur = true` in `SafeBlurView.tsx` (as we are enforcing Dev Client)

## 3. Verification & Build

- [x] 3.1 Clear all Metro caches: `pnpm --filter @app/mobile exec expo start --clear`
- [x] 3.2 Delete the existing app from the iOS simulator (Expo Go and old Lattice builds)
- [x] 3.3 Run `npx expo run:ios` from `apps/mobile` to perform a fresh native build
- [ ] 3.4 Verify the app opens without "NitroModules" or resolution errors
