## 1. Cleanup Legacy Tunnels

- [ ] 1.1 Delete `apps/mobile/zrok-tunnel.sh`.

## 2. Setup Ngrok configuration

- [ ] 2.1 Create `apps/mobile/ngrok.yml` mapping `metro` to 8081 and `api` to 3000.

## 3. Tunnel Automation Script

- [ ] 3.1 Create `apps/mobile/ngrok-tunnel.sh` with executable permissions.
- [ ] 3.2 Add logic to kill any existing orphan ngrok processes and handle script exit gracefully.
- [ ] 3.3 Add command to start `ngrok start --all --config=./ngrok.yml` in the background.
- [ ] 3.4 Add wait logic (`sleep 3`) and URL extraction via `http://localhost:4040/api/tunnels` parsed by inline Node script.
- [ ] 3.5 Export environment variables (`EXPO_PACKAGER_PROXY_URL` and `EXPO_PUBLIC_API_URL`).
- [ ] 3.6 Add command to start the Expo bundler (`npx expo start --clear`).

## 4. Package Configuration Update

- [ ] 4.1 Update `apps/mobile/package.json` to replace the `dev:zrok` script with `"dev:ngrok": "./ngrok-tunnel.sh"`.
