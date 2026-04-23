# System Overview: Lattice

Lattice is a premium mobile application designed to enhance the spectator experience at high-density events and festivals, providing advanced navigation, real-time telemetry, and immersive interactions.

## Technology Stack

- **Mobile Framework:** Expo (React Native)
  - **Environment:** Custom Development Builds (required for MMKV, Reanimated, R3F).
- **Map Engine:** MapLibre GL (`@maplibre/maplibre-react-native`).
  - **Optimization:** SurfaceView and **Native Layer Rendering** (`ShapeSource`) for maximum GPU performance on Android.
- **Augmented Reality:** React Three Fiber (R3F) with **Orientation-Aware Hybrid Projection** for stable labels in any orientation.
- **Backend:** Node.js (Express) within a microservices architecture.
- **Database:** PostgreSQL with PostGIS extension.
- **Real-time:** Socket.io with MessagePack for binary compression.

## Core Philosophical Pillars

1. **Mixed Style Design:** Fusion of Cupertino elegance and Material structure.
2. **Offline-First:** Critical data (POIs, Map Styles) is cached to survive network saturation.
3. **Location Intelligence:** Efficiency-gated GPS updates and on-device routing calculations.

## Documentation Map

- [**Architecture**](./backend.md): Technical deep-dives into Backend and Frontend systems.
- [**Guides**](../guides/setup.md): Setup, Deployment, and Contribution standards.
- [**API**](../apis/api-contract.md): Data contracts and schema definitions.

---

> For detailed technical decisions and ADRs, see [**Architecture Decisions**](./decisions.md).
