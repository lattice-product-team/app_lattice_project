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

## 4. Android Cloud Builds (No Local Setup Required)
If you don't want to install Android Studio, use EAS Cloud:
```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo
eas login

# 3. Trigger build (will give you an APK link)
pnpm android:build:dev
```

## 5. Environment Variables & Secrets
For services like MapTiler to work in cloud builds, you MUST add secrets to EAS:
```bash
# Add MapTiler key for remote builds
eas secret:create --name MAPTILER_KEY --value your_key_here --scope project --type string
```
The app will automatically map these secrets via `app.config.ts`.

---

## Connectivity Troubleshooting
If your dev build cannot connect to the API:
1. Run `pnpm dev:lan`.
2. Wait for the **Connectivity Diagnostics** to finish.
3. If a port is marked as `NOT reachable`, check your macOS Firewall settings.
