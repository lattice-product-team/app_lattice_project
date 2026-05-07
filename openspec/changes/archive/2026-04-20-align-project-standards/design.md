## Context

The Lattice project was initially scaffolded with some inconsistencies regarding coordinate ordering (standardizing on GeoJSON vs internal typing) and sub-optimal mobile rendering choices. To maintain the "premium" quality and GPU-performance requirements, we need to bring the codebase in line with its own documented standards.

## Goals / Non-Goals

**Goals:**

- Enforce `[longitude, latitude]` (GeoJSON) as the single source of truth for location data.
- Transition `MapContent.tsx` to 100% native layer rendering on iOS.
- Clean up hardcoded styles and migrate to NativeWind.

**Non-Goals:**

- Adding new features or map layers.
- Changes to the backend persistence logic (PostGIS handles GeoJSON correctly, this is a type alignment issue).

## Decisions

### 1. Correcting Coordinate Order in Types

- **Decision**: Update `packages/types-schema/index.ts` to swap the comment `[lat, lng]` to `[lng, lat]` and ensure all consumers follow this.
- **Rationale**: GeoJSON (standardized in `api-contract.md`) uses `[longitude, latitude]`. Mismatched types lead to flipped coordinates in UI and routing.

### 2. Native Layers vs MarkerView (iOS)

- **Decision**: Replace the `.map()` loop of `MarkerView` with a single `SymbolLayer` on iOS.
- **Rationale**: `MarkerView` creates individual React Native views for each point, which is extremely heavy on bridge communication. Standard `SymbolLayer` renders on the GPU via MapLibre, scaling to thousands of points effortlessly.

### 3. NativeWind Migration

- **Decision**: Remove `StyleSheet.create` from `MapContent.tsx` and use `className` with NativeWind.
- **Rationale**: Consistency with the rest of the project and easier maintenance of the dynamic "glassmorphism" styles.

## Risks / Trade-offs

- **Risk**: Flipped coordinates during migration → **Mitigation**: Verify all call sites of `useMapStore` and `navigationService` during refactor.
- **Risk**: Touch interaction changes on native layers → **Mitigation**: Ensure `onPress` is correctly handled on the `ShapeSource`.
