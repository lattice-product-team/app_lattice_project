## Context

Currently, the `MapContent` component updates the `currentZoom` state only in `onRegionDidChange`. This causes pins to pop in or out only when movement stops. Additionally, `MapLibreGL.MarkerView` components exhibit a "flash" at the top-left corner (0,0) before the native side synchronizes their position.

## Goals / Non-Goals

**Goals:**

- Real-time reactivity of pins during zoom/drag gestures.
- Elimination of the (0,0) marker flash.
- Zero-impact on map panning performance.

**Non-Goals:**

- Redesigning the visual look of the pins.
- Implementing clustering (handled by other logic).

## Decisions

### 1. Real-time Zoom with Throttled State Updates

Instead of relying solely on `onRegionDidChange`, we will add `onRegionIsChanging`. To prevent React's state management from becoming a bottleneck during gestures:

- **Decision**: Update `currentZoom` using a throttled function (~100ms interval).
- **Rationale**: 100ms is frequent enough to feel "fluid" for pin filtering but infrequent enough to avoid frame drops on the main thread.

### 2. Guarded Coordinate Rendering

- **Decision**: Filter out any events or POIs with [0,0] coordinates in `MapContent.tsx` before they even reach the pin components.
- **Rationale**: Prevents accidental rendering of "phantom" pins if data is incomplete.

### 3. Hybrid Rendering & GL Optimization (New)

- **Decision**: Use `SymbolLayer` for all non-selected and non-primary event POIs. Only use `MarkerView` for the currently selected POI and primary events that require high-fidelity React animations.
- **Rationale**: `SymbolLayer` is rendered directly by the GPU in the GL engine, which is much faster and doesn't suffer from the coordinate synchronization lag that causes the (0,0) flash.

### 4. Component Decomposition & Adapter Pattern (New)

- **Decision**: Extract POI normalization logic into a dedicated adapter. Split `MapContent` into `MapLayers`, `MapCameraManager`, and `MapInteractionLayer`.
- **Rationale**: Reduces the complexity of the main map component, making it more maintainable and easier to optimize individual rendering paths.

### 5. Opacity-Based Reveal Strategy

- **Decision**: Initialize remaining `MarkerView` components (Events/Selected) with `opacity: 0` using a Reanimated SharedValue. Use a `useEffect` to trigger a `withTiming(1, { duration: 150 })` animation.
- **Rationale**: Provides a buffer for the native side to sync coordinates, while `SymbolLayer` handles the rest of the icons instantly.

## Risks / Trade-offs

- **[Risk] State update overhead** → Mitigation: Use a conservative throttle interval (100ms) and ensure only the necessary state slice (`currentZoom`) is updated.
- **[Risk] Delayed appearance** → Mitigation: Keep the reveal delay very short (50ms). It's better to see a pin appear 50ms later than to see it flash at (0,0).
