## Why

The current map pins are placeholders that don't reflect the premium aesthetic of Lattice. Furthermore, there is no visual or logical distinction between a major "Event" and the functional "Points of Interest" (POIs) inside it, leading to a cluttered map and poor user orientation during events.

## What Changes

- **Event Pin Redesign (Apple Style)**: Implement circular pins with high-quality images and a "pin tail" on selection, following the Apple Maps visual language. Labels will be adaptive to prevent collision.
- **Hierarchical Visibility Logic**: Events are always visible; sub-POIs are revealed when:
  - The parent Event is selected.
  - The user is physically within the event's geofence.
  - The zoom level is high enough.
- **POI Selection (Mini-Cards)**: Selecting a sub-POI will replace the main event sheet with a "mini-card" UI for that specific location, keeping the map visible.
- **Interactive Service Summary**: Category icons in the Event Sheet (🚻, 🍔, etc.) will act as filters to highlight specific POIs on the map.
- **Premium Animations**: Subtle "pop" animations for pin entry/exit to provide feedback without excessive movement.
- **3D Billboarding**: Pins will remain vertical and facing the camera when the map is tilted in 3D mode.

## Capabilities

### New Capabilities

- `map-pin-components`: Premium React Native components for Event (Image-based) and POI (Glyph-based) markers.
- `spatial-hierarchy-logic`: Core logic for visibility management (selection, geofencing, zoom).
- `poi-category-filtering`: Logic to highlight/dim map markers based on selected categories from the UI.
- `mini-card-ui`: A specialized bottom sheet variant for individual POI details.

### Modified Capabilities

- `poi-store-optimization`: Update the `usePOIStore` to support hierarchical relationships and filtering states.

## Impact

- **Affected Components**: `MapContent.tsx`, `EventDetailSheet.tsx`, `usePOIStore.ts`.
- **Dependencies**: High-quality SVG glyphs for categories; sophisticated camera bounding box calculations.
