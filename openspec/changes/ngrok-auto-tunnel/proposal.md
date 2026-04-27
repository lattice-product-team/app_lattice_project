## Why

The current mobile development environment relies on a custom `zrok` script to expose the Metro bundler over the internet. However, `zrok` only exposes Metro (port 8081) and leaves the `EXPO_PUBLIC_API_URL` pointing to `localhost:3000`, which fails on physical devices running over 4G/LTE since they cannot resolve `localhost`. We need a seamless way to expose both Metro and the API Gateway simultaneously so physical mobile devices can fully interact with the backend during development.

## What Changes

- Replaces the `zrok-tunnel.sh` script with a new `ngrok-tunnel.sh` script.
- Configures `ngrok.yml` to automatically start two tunnels simultaneously (Metro on port 8081 and API on port 3000).
- Automatically queries the `ngrok` local API to extract the dynamically generated public URLs.
- Injects `EXPO_PACKAGER_PROXY_URL` and `EXPO_PUBLIC_API_URL` environment variables before starting Expo.
- Updates `package.json` scripts to replace `dev:zrok` with `dev:ngrok`.

## Capabilities

### New Capabilities
- `mobile-dev-tunnels`: Automated dual-tunneling for mobile development (Metro + API).

### Modified Capabilities

## Impact

- `apps/mobile/zrok-tunnel.sh` (deleted)
- `apps/mobile/ngrok.yml` (added)
- `apps/mobile/ngrok-tunnel.sh` (added)
- `apps/mobile/package.json` (modified dev script)
