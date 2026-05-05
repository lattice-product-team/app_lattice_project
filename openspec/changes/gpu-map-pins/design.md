## Context

The Lattice mobile application requires a highly performant and stable map interface. Previous attempts using React Native's `MarkerView` and custom `VirtualOverlays` suffered from synchronization lag, flickering, and coordinate jumps. By moving all rendering to the MapLibre GPU engine, we eliminate these issues.

## Goals / Non-Goals

**Goals:**
- Achieve 100% stability in pin positioning (zero flickering).
- Support high-fidelity circular event icons with dynamic images.
- Scale to thousands of POIs using vector icons.
- Implement a hierarchical zoom visibility system.

**Non-Goals:**
- Supporting 3D pin models.
- Changing the underlying GeoJSON data structures.

## Decisions

### 1. GPU Layer Stack for Hero Events
- **Decision**: Instead of a single complex React component, we will stack multiple GPU layers:
  1. `CircleLayer` (Shadow): Soft black blur behind the pin.
  2. `CircleLayer` (Body): White circle with a dynamic `circleStrokeColor` based on the event category.
  3. `SymbolLayer` (Icon): The actual event image or placeholder.
- **Rationale**: This provides the "premium" circular look using pure GL primitives, which are perfectly stable during camera movement.
- **Alternative**: Using `MarkerView` (rejected: flickering/performance).

### 2. Dynamic Image Management
- **Decision**: Implement a `MapImageRegistry` component within `MapContent` that uses `<MapLibreGL.Images>` to register remote URLs as named icons (e.g., `event-img-{id}`).
- **Rationale**: MapLibre's `SymbolLayer` can only render images that are registered in the map's texture atlas.
- **Alternative**: Pre-fetching all images and bundling them (rejected: dynamic events).

### 3. Vector Iconography for POIs
- **Decision**: Use the built-in `maptiler_planet` icon set for secondary POIs (toilets, food, etc.).
- **Rationale**: Built-in icons are rendered directly from the vector tiles, making them nearly free in terms of performance.

## Risks / Trade-offs

- **[Risk] Image Masking** → **Mitigation**: Since GPU images are rectangular, we will encircle them with a white `CircleLayer` stroke to provide a "circular" visual effect. If true circular clipping is required, we will explore pre-masking images before registration.
- **[Risk] Texture Cache Limit** → **Mitigation**: We will monitor memory usage and limit registration to events within a specific radius of the user or map center.
