## Why

The current map marker system is fragmented between high-performance but low-fidelity GL layers (`SymbolLayer`) for POIs and high-fidelity native views (`MarkerView`) for events. This fragmentation causes inconsistent visual quality, rendering artifacts on Android (such as text clipping and coordinate displacement), and technical debt in styling management. By unifying all markers under a single `MarkerView` architecture—leveraging the recently implemented viewport throttling—we can achieve a premium, consistent UI that remains performant on Android.

## What Changes

- **Full MarkerView Unification**: Transition all POIs and Events from GL-based rendering to `MapLibreGL.MarkerView`.
- **Marker Styling Overhaul**: Re-implement the entire styling system for map markers using a unified set of React Native components, ensuring consistent borders, shadows, and circular clipping across all types.
- **Coordinate & Anchor Calibration**: Standardize the `anchor` points for all `MarkerView` instances to fix the "floating" or "displaced" behavior observed during map rotation and tilt on Android.
- **Robust Label System**: Re-architect marker labels to ensure they are always visible, properly layered (`zIndex`), and do not clip on Android devices.
- **SymbolLayer Deprecation**: Remove all legacy `SymbolLayer` and `CircleLayer` implementations for POIs and Events to simplify the `MapLayers.tsx` logic.

## Capabilities

### Modified Capabilities
- `hybrid-map-rendering`: Transition from a hybrid GL/Native approach to a unified native view approach optimized via state throttling.
- `map-pin-components`: Complete redesign and reimplementation of all map pin visual components.
- `spatial-hierarchy-logic`: Update the logic that determines marker visibility and level-of-detail to work with the new unified system.

## Impact

- `apps/mobile/src/features/map/components/MapLayers.tsx`: Major refactor to use `MarkerView` exclusively for dynamic elements.
- `apps/mobile/src/features/map/components/POIPin.tsx` & `EventPin.tsx`: New or updated components for the unified pin system.
- `apps/mobile/src/styles/mapPinStyles.ts`: New centralized styling system for map markers.
- `apps/mobile/src/features/map/components/MapContent.tsx`: Ensure data normalization supports the unified rendering path.
