# Developer Setup Guide

Welcome to the Lattice development team. This guide will help you get your local environment running.

## Prerequisites

- **Node.js (LTS):** v18.0.0 or higher.
- **pnpm:** v10.0.0 or higher.
- **Docker Desktop:** Running and updated (Required for PostGIS).
- **Mobile SDKs:** 
  - Xcode (macOS only) for iOS.
  - Android Studio + SDK Platform Tools for Android.
  - **Environment Variables**: `ANDROID_HOME` must point to your Android SDK location.

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   pnpm install
   ```

2. **Environment Configuration:**
   Copy `.env.example` to `.env` in the **root** of the project.
   The mobile app and all server services now read configuration directly from this central file.

3. **Start Infrastructure:**
   ```bash
   docker compose up -d db
   ```

4. **Prepare Database:**
   ```bash
   pnpm db:migrate
   pnpm db:clean          # Optional: Start with a fresh DB
   pnpm db:seed-montmelo  # Feed Montmeló POIs (Standard)
   # OR
   pnpm db:seed-pedralbes # Feed Pedralbes POIs (Testing)
   ```

5. **Run Development Server:**
   ```bash
   pnpm dev
   ```
   This command starts the API Gateway and the Mobile Metro bundler simultaneously.

## Mobile Development (Custom Builds)

> [!IMPORTANT]
> This project is **not compatible with Expo Go**. You must use Development Builds.

```bash
# For iOS
pnpm ios

# For Android
pnpm android
```

## Local Tunneling (Remote & Physical Devices)

To test on a physical device, you have two main options:

### Option A: Using Ngrok (Remote/Wireless - Recommended)

This is best for testing without a cable or when someone else needs to see your work.

1.  **Install Ngrok:** [ngrok.com](https://ngrok.com).
2.  **Authenticate:** `ngrok config add-authtoken <token>`.
3.  **Run the Tunnel Command (Root):**
    ```bash
    pnpm dev:tunnel
    ```
    This script will:
    - Create a public tunnel for the API (3000).
    - Automatically inject the tunnel URL into the Mobile App configuration.
    - Start the Metro Bundler with Expo's built-in tunnel.

### Option B: Using LAN (Wireless - High Performance)

If your device and computer are on the same Wi-Fi:

1.  **Run LAN Command:**
    ```bash
    pnpm dev:lan
    ```
    This will:
    - Detect your local IP address.
    - Configure the Mobile App to connect directly to your computer's IP.

### Option C: Using ADB Reverse (USB Cable - Android Only)

This is the fastest, most stable method for local Android testing.

1.  **Connect Device:** Ensure USB Debugging is enabled.
2.  **Run Port Forwarding:**
    ```bash
    adb reverse tcp:8081 tcp:8081
    adb reverse tcp:3000 tcp:3000
    ```
3.  **Start App:**
    ```bash
    pnpm android
    ```

---
> For contribution guidelines, see [**Contribution Standards**](./standards.md).
