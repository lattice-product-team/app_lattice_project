# Architecture Decision Records (ADR)

This document tracks the major technical decisions and conventions established for the Lattice project.

## 1. Directory Structure

- **`/apps/server`**: Contains all containerized microservices.
- **`/apps/mobile/app`**: Native Expo Router file-based routing.
- **`/apps/mobile/src`**: Localized business logic, components, and state.
- **`/packages`**: Shared code and schema definitions.

## 2. API Versioning

All external communications are prefixed with `/api/v1`.

- **Reasoning:** Ensures backward compatibility for older app versions and follows industry standards (Stripe, GitHub) for professional scalability.

## 3. Map Engine Pivot: MapLibre

We migrated from Mapbox to `@maplibre/maplibre-react-native`.

- **Reasoning:** Vendor lock-in avoidance, lower costs for nationwide builds, and total freedom over style JSON customization.

## 4. Location Service: Expo Location

Chosen over standard React Native geolocation.

- **Reasoning:** Seamless integration with the Expo ecosystem and unified permission management for both foreground and background tracking.

## 5. Persistence: MMKV

Used for all client-side storage needs.

- **Reasoning:** Synchronous read/write operations prevent UI flickers and provide ~30x better performance than the deprecated `AsyncStorage`.

## 6. Real-time protocol: MessagePack

Utilized over standard JSON for WebSockets.

- **Reasoning:** Binary compression significantly reduces payload size, which is critical in low-bandwidth, high-density environments like a racing event.

## 7. Caching Layer: Redis

Implemented as a secondary storage layer alongside Drizzle/PostgreSQL.

- **Reasoning:** Critical for handling high-frequency real-time telemetry (GPS) and reducing database load during event peaks. Redis's in-memory nature allows sub-millisecond responses impossible with traditional SQL during massive concurrency.

## 8. Augmented Reality Engine: React Three Fiber (R3F)

Chosen for modern, cross-platform AR scenes over ViroReact or custom WebGL implementations.

- **Reasoning:** Better performance with React Native's New Architecture, seamless integration with the Expo ecosystem, and a more robust ecosystem of components (`drei`, `cannon`) for high-fidelity 3D visualization.

---

> These decisions form the foundation of our scalability strategy.
