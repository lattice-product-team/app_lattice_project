## Why

The current mobile map interface is cluttered with default MapTiler POI icons, ferry routes, and highway shields that distract from the application's specific content. Previous attempts to remove these elements failed because the standard `setLayoutProperty` method is not available in the React Native MapLibre wrapper. This change aims to stabilize the map's visual state by implementing a "Style Patching" strategy that surgically removes unwanted elements while preserving essential geographic context like streets and city names.

## What Changes

- **Advanced Style Suppression**: Implementation of a dynamic style patching mechanism that modifies the MapTiler style JSON at runtime.
- **Surgical Removal of Elements**:
    - **POIs**: Complete removal of all generic point-of-interest icons.
    - **Ferry Routes**: Removal of ferry lines and route labels from water bodies.
    - **Highway Shields**: Suppression of road number icons (e.g., C-58, B-10) to keep the road network clean.
- **Optimized Initialization**: Transition to a more robust style loading cycle that handles theme switching and patching seamlessly.

## Capabilities

### New Capabilities
- `map-aesthetic-control`: Capability to programmatically control the visibility of base map elements (POIs, labels, infrastructure) to ensure a premium, focused user experience.

### Modified Capabilities
<!-- No requirement changes to existing capabilities -->

## Impact

- **Mobile Application**: `MapContent.tsx` will be refactored to handle JSON style objects instead of simple URLs.
- **User Experience**: A highly polished, "Clean Split" map aesthetic that highlights app-specific data without built-in map clutter.
