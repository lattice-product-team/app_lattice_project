## Context

Lattice currently uses a flat POI system where all points are equally weighted. The transition to a hierarchical "Event-centric" model requires a redesign of the map interaction layer to support parent (Event) and child (POI) relationships, high-fidelity visuals, and contextual visibility.

## Goals / Non-Goals

**Goals:**

- Implement Apple Maps-inspired high-fidelity Event pins.
- Create a hierarchical visibility system (selection/zoom/geofence).
- Add category-based filtering from the UI.
- Implement a "Mini-card" detail view for sub-POIs.

**Non-Goals:**

- Offline map support (out of scope for this change).
- Custom 3D model markers (sticking to 2D billboarding).

## Decisions

### 1. Pin Implementation: `MarkerView` vs `SymbolLayer`

- **Decision**: Use `MapLibreGL.MarkerView` for Event pins.
- **Rationale**: Event pins require complex UI (circular images, shadows, dynamic labels) and smooth `reanimated` transitions. `SymbolLayer` is better for performance but limits styling to static images. Given the limited number of active events, the performance cost of `MarkerView` is acceptable for the premium look.
- **Alternatives**: Using `SymbolLayer` would require a pre-render pass to convert images to icons, losing dynamic interaction capabilities.

### 2. State Management: Hierarchical `usePOIStore`

- **Decision**: Add `selectedEventId`, `visibleSubPois`, and `activeFilters` to the existing store.
- **Rationale**: Centralizing the hierarchy in the store allows components like the `DiscoveryDashboard` and `MapContent` to stay in sync.
- **Logic**:
  - `visibleSubPois` will be derived from `selectedEventId` + `userLocation` geofencing.

### 3. Animation Strategy: `Reanimated 3`

- **Decision**: Use `useAnimatedStyle` for pin "pop" animations and sheet transitions.
- **Rationale**: Ensures 60fps animations that feel native and responsive.

### 4. POI Mini-Cards: BottomSheet Variant

- **Decision**: Create a `POIMiniCard.tsx` component that reuses the logic of `EventDetailSheet` but with a fixed low snap-point (30% height).

## Risks / Trade-offs

- **Performance** [Risk] → If an event has hundreds of sub-POIs, `MarkerView` might cause lag. [Mitigation] → Use `SymbolLayer` as a fallback for sub-POIs if the count exceeds 50, or implement simple culling based on viewport.
- **Image Loading** [Risk] → Flicker when event images are downloading. [Mitigation] → Use `expo-image` for high-performance caching and smooth transitions.
