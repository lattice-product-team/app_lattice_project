## Why

The current mobile development environment is unstable and prone to failures during bundling and connectivity. Developers are forced to manually detect IP addresses and manage brittle `.env` synchronization scripts, leading to a "0 kb" download error and Metro crashes. We need a robust, automated system that "just works" for local development and provides a clear path for native builds.

## What Changes

- **Expo Configuration**: Disable static output in `app.json` to prevent SSR bundling crashes on native modules.
- **Smart Connectivity**: Replace the manual `dev:lan` script with a "Smart LAN" system that automatically detects the correct network interface and validates external reachability.
- **Dynamic Env Sync**: Upgrade `sync-env.ts` to handle runtime overrides without modifying the root `.env` file, ensuring the mobile app always has the correct API URL.
- **Pre-flight Validation**: Add a diagnostic check to the startup sequence to identify common network blockers (e.g., macOS firewall or hotspot isolation).
- **Build Clarity**: Standardize the commands for local native builds versus cloud builds.

## Capabilities

### New Capabilities

- `network-preflight-diagnostics`: A tool to verify if the MacBook's local ports are reachable from the external network interface.

### Modified Capabilities

- `env-synchronization`: Allow dynamic runtime overrides for variables (like `GATEWAY_HOST`) during the sync process without persisting them to the root file.
- `cross-environment-networking`: Standardize the use of LAN IPs and Tunnels to ensure consistent connectivity across all development scenarios.

## Impact

- **Affected Code**: `apps/mobile/package.json`, `apps/mobile/app.json`, `scripts/sync-env.ts`, and root `package.json`.
- **System Behavior**: Mobile startup will now include a validation step and will no longer crash due to SSR misconfiguration.
