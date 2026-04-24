## Context

The Lattice application requires real-time mobile development testing on physical devices using 4G/LTE to ensure network-independent reliability. Previously, `zrok` was used to tunnel Metro Bundler (port 8081), but the API Gateway (port 3000) remained on localhost, breaking network calls. We are switching to `ngrok` because it supports robust multi-tunneling via YAML config and provides a local JSON API to extract the public URLs dynamically without complex log parsing.

## Goals / Non-Goals

**Goals:**
- Provide a single command (`pnpm dev:ngrok`) to expose both Metro and API.
- Automatically detect the generated ngrok URLs and inject them into the Expo environment.
- Eliminate the need to manually copy-paste ngrok URLs.

**Non-Goals:**
- Setting up permanent domain names (this is strictly for local dev).
- Managing tunnels for individual microservices (Gateway handles routing).

## Decisions

- **Multi-tunnel via `ngrok.yml`**: Instead of running two separate instances of ngrok, we use a single `ngrok start --all` with a configuration file. This is cleaner, uses fewer resources, and prevents port collisions.
- **Node-based JSON extraction**: We will use a small inline Node script to parse `http://localhost:4040/api/tunnels` instead of relying on `jq`, ensuring the script works seamlessly on any machine where Node is installed (which is a given in an Expo project).
- **Environment variables injection**: The script will export `EXPO_PACKAGER_PROXY_URL` and `EXPO_PUBLIC_API_URL` to seamlessly inject these into the Expo build context.

## Risks / Trade-offs

- [Risk] Ngrok unauthenticated sessions time out or have low limits. → Mitigation: Document that users must have an ngrok authtoken configured.
- [Risk] Ngrok takes a moment to establish tunnels, causing the fetch to fail. → Mitigation: Add a short `sleep 3` before querying the local API, or implement a retry mechanism.
