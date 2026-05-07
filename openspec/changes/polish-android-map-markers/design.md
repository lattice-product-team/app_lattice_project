## Context

The Lattice mobile app currently uses a hybrid rendering approach for map entities: `PointAnnotation` for events and GL-based `SymbolLayer`/`CircleLayer` for POIs. While performant, the GL layers lack the UI flexibility required for premium circular clipping, rich typography, and consistent shadow effects on Android. The user has requested a complete unification under the `MarkerView` architecture to achieve a high-fidelity "Apple Maps" aesthetic across all marker types.

## Goals / Non-Goals

**Goals:**
- Unify all POI and Event rendering under a single `MapLibreGL.MarkerView` system.
- Fix Android-specific bugs: text clipping, coordinate displacement during rotation, and "floating" markers.
- Create a reusable `MapPin` component system for easy styling updates.
- Maintain 60fps performance on Android by leveraging the existing viewport state throttling.

**Non-Goals:**
- Implementing clustering (out of scope for this UI polish phase).
- Modifying the underlying map tile engine or navigation logic.

## Decisions

### 1. Unified Component Architecture
We will move away from inline rendering in `MapLayers.tsx` and instead create a hierarchy of React components:
- `BaseMapMarker`: Handles the `MarkerView` wrapper, positioning, and common anchor logic.
- `EventMarker`: Specific styling for events (images, large badges).
- `POIMarker`: Minimalist styling for categories (glyphs, smaller badges).

**Rationale**: This promotes code reuse and makes it trivial to apply global style changes (e.g., border radius or shadow depth) across the entire map.

### 2. Standardized Anchor Calibration
We will standardize all markers to use `anchor={{ x: 0.5, y: 1.0 }}` (bottom-center). 
- **Alternatives considered**: `center` (0.5, 0.5).
- **Rationale**: Bottom-center is more stable for pins that have a "stem" or vertical orientation. When the map tilts (3D) or rotates, the base of the pin remains exactly on the coordinate, whereas `center` anchors often appear to "sink" or "drift" relative to the ground plane.

### 3. Absolute Label Layering
Labels will be rendered as children of the `MarkerView` but will use absolute positioning and a fixed `zIndex` system to ensure they appear consistently below or above the pin body as designed.
- **Rationale**: This fixes the "missing text" and "clipping" issues on Android where relative layout in native view containers can be unpredictable.

### 4. JS-Side Visibility Culling
Since we are moving away from GL filters (`filter: ['==', ...]`), we will implement visibility logic in the React render loop using the throttled `zoom` and `bounds` state from the store.
- **Rationale**: Rendering 100+ `MarkerView`s simultaneously on Android can cause lag. By only mounting markers that are within the current viewport (with a small buffer), we maintain peak performance.

## Risks / Trade-offs

- **[Risk]** JS Thread Saturation → **Mitigation**: The 100ms viewport throttle already prevents rapid re-renders. We will further optimize by using `React.memo` on individual marker components.
- **[Risk]** Coordinate Sync Delay → **Mitigation**: Using `MarkerView` (which is highly optimized in MapLibre for native view synchronization) instead of `PointAnnotation` (legacy).
- **[Risk]** Memory Pressure → **Mitigation**: Unmount markers that are far from the viewport to keep the native view hierarchy lean.
