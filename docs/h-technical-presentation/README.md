# H - Technical Presentation

This section documents the technical evolution and challenges of the project.

## 1. Feature Evolution (Sprint by Sprint)
- **Sprint 1**: Foundation. Migration from local storage to a centralized Postgres DB. Implementation of the first API contract.
- **Sprint 2**: Intelligence. Integration of Valhalla for routing and MapLibre for high-performance rendering.
- **Sprint 3**: Polish. Optimization of marker rendering cycles and documentation restructuring.

## 2. Problems & Solutions
- **Problem**: UI lag during heavy map interactions.
  - **Solution**: Implemented a "Mount-Always" architectural stability pattern using native components and optimized Reanimated hooks.
- **Problem**: Coordinate-offset clutter at high zoom levels.
  - **Solution**: Developed a custom spiderfication algorithm to disperse overlapping markers.
- **Problem**: Docker image bloat.
  - **Solution**: Implemented multi-stage builds and optimized layer caching.

## 3. Technical Requirements
- **Hardware**: iOS 15.1+ / Android API 30+ for mobile. Docker-capable host for backend.
- **Software**: Node.js 20+, pnpm, PostgreSQL 15, Redis.
- **Security**: JWT-based authentication, environment variable encryption.
