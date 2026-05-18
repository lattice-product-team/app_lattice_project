## Why

The current map marker implementation using `MarkerView` and `PointAnnotation` is unstable on iOS, leading to invisible or flickering pins. This change will establish a robust, unified, and performant iconography architecture using a stabilized `MarkerView` pattern that ensures 100% visibility and follows the premium visual guidelines.

## What Changes

- **Refactored MapLayers**: Unified logic for Event and POI rendering with a focus on stability.
- **Stabilized MarkerView Container**: Introduction of a "Layout Shield" (View with explicit dimensions and layout properties) that guarantees rendering in MapLibre iOS.
- **Lucide Standard**: Final migration of all map assets to Lucide iconography with consistent stroke weights (2.2 for standard, 2.5 for markers).
- **Dynamic Theming**: Support for brand-specific colors and imagery within the pin frame.

## Capabilities

### New Capabilities

- `map-marker-system`: A centralized system for managing and rendering custom map markers with native-like stability.

### Modified Capabilities

- map-pin-components: Updating requirements for coordinate synchronization, marker lifecycle, and hierarchical visibility.
- zoom-based-discovery: Updating zoom thresholds for POI reveal to 13.5.

## Impact

- `apps/mobile/src/features/map/components/MapLayers.tsx`
- `apps/mobile/src/features/map/components/EventMarker.tsx`
- `apps/mobile/src/features/map/components/POIMarker.tsx`
- `apps/mobile/src/features/map/components/MapContent.tsx`
- `apps/mobile/src/utils/poiUtils.ts`
