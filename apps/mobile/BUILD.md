# Lattice Mobile Build Guide

This document explains how to generate native builds for the Lattice mobile application.

## 1. Development Builds (Local)
Use these when you want to test on a physical device with hot-reloading and debug tools.

### Prerequisites
- macOS with Xcode installed (for iOS)
- Android Studio with SDK (for Android)
- Your device connected via USB or Hotspot

### Commands
```bash
# Build and run on iOS
npm run ios

# Build and run on Android
npm run android
```

## 2. Standalone Builds (Cloud - EAS)
Use these to generate a `.ipa` or `.apk` that you can share or upload to stores.

### Internal Testing (Ad-hoc)
```bash
# Build for iOS (Internal Distribution)
npx eas build --platform ios --profile development

# Build for Android (APK)
npx eas build --platform android --profile development
```

### Production
```bash
npx eas build --platform ios --profile production
npx eas build --platform android --profile production
```

## 3. Local Native Builds (Advanced)
If you want to build the IPA/APK on your own machine without using Expo's cloud:
```bash
npx eas build --platform ios --local --profile development
```

---

## Connectivity Troubleshooting
If your dev build cannot connect to the API:
1. Run `npm run dev:lan`.
2. Wait for the **Connectivity Diagnostics** to finish.
3. If a port is marked as `NOT reachable`, check your macOS Firewall settings.
