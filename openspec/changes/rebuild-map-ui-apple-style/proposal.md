## Why

The current map interface has grown fragmented through multiple iterations, leading to overlapping controls (3D button, navigation pill), inconsistent "Island" behavior across different sheet states, and technical debt in legacy components. 

A "from scratch" rebuild is necessary to establish a clean, unified architecture that ensures a premium Apple Maps experience with stable glassmorphism, perfect control alignment, and a cohesive "Island" design system that never breaks regardless of the sheet's expansion level.

## What Changes

- **Unified Map Bottom Sheet**: Consolidation of exploration and POI details into a single, high-performance sheet architecture with a permanent "Island" layout (margins on all sides).
- **Integrated Control Overlay**: Redesign of the floating controls (3D, Recenter, Map Layers, Binoculars) to be visually and physically linked to the sheet's search bar position.
- **Premium Glassmorphism**: Standardized design tokens for all floating elements (32px rounding, 0.5px inner glow, blur intensity 90).
- **Action Trident 2.0**: Refined engagement panel for event locations with improved haptics and visual depth.
- **Removal of Legacy UI**: Complete removal of `MapHUD`, old `MapBottomSheet`, and `PoiDetailSheet` implementations to simplify the feature directory.

## Capabilities

### New Capabilities
- `map-discovery-platform`: A unified system for event discovery and POI interaction using a state-driven "Island" UI.
- `adaptive-map-controls`: A contextual control system that adapts its position and appearance based on the map and sheet state.

### Modified Capabilities
- `map-navigation`: Updating requirements for how users interact with map markers and recenter functionality.

## Impact

- **Affected Features**: `src/features/map` will undergo a major structural refactor.
- **State Management**: `useMapUIStore` will be simplified to handle the unified sheet states.
- **App Entry**: `(main)/index.tsx` will be restructured to serve as a clean container for the new UI layers.
- **Dependencies**: Continued use of `@gorhom/bottom-sheet` and `react-native-reanimated` for all transitions.
