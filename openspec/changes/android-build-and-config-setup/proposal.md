## Why

Currently, the project lacks a formal Android build and configuration strategy. Developing for Android typically requires a heavy local installation (Android Studio, SDKs, etc.), which is a significant barrier. We need a way to build and test the Android application using cloud-based services (EAS Build) to maintain a lightweight local development environment while ensuring cross-platform parity.

## What Changes

- **CONFIGURE**: `eas.json` to include specific profiles for Android development and production builds.
- **ADD**: Android-specific configuration to `app.json` (package name, permissions, icons, splash screen).
- **SETUP**: Local scripts in `package.json` to trigger remote builds easily.
- **IMPLEMENT**: A robust environment variable strategy for remote builds (MapTiler keys, API URLs).

## Capabilities

### New Capabilities
- `android-cloud-build`: The ability to trigger and download Android builds (APK/AAB) entirely through the cloud without local Android Studio installation.

## Impact

- **Configuration Files**: `apps/mobile/app.json`, `apps/mobile/eas.json`.
- **Scripts**: Root and mobile `package.json`.
- **Infrastructure**: Requirement for an Expo/EAS account and project setup.
