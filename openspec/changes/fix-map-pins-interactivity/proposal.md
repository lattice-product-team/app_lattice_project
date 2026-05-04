## Why

The current map implementation has two major UX issues:
1. **Laggy interactivity**: Event pins and POIs only appear or disappear after the user stops dragging the map, creating a "jumpy" experience.
2. **Visual bugs**: Map markers (MarkerViews) occasionally appear in the top-left corner (0,0) before jumping to their correct location, creating a low-quality "glitchy" feel.

Fixing these is essential for the "premium" feel of the application.

## What Changes

- **Real-time Pin Filtering**: Transition from `onRegionDidChange` to `onRegionIsChanging` for zoom updates, ensuring pins appear/disappear fluidly during movement.
- **Throttled State Updates**: Implement a throttle mechanism for zoom updates to maintain high performance while dragging.
- **Marker Positioning Fix**: Implement an opacity-based reveal strategy for `MarkerView` components to hide the initial (0,0) positioning flash.
- **Coordinate Validation**: Add strict validation for pin coordinates to prevent rendering at default [0,0] locations.

## Capabilities

### New Capabilities
- `fluid-map-pins`: Requirements for real-time interactivity and stable positioning of custom map markers.

### Modified Capabilities
- None

## Impact

- **MapContent.tsx**: Update event handling and zoom state management.
- **EventPin.tsx / POIPin.tsx**: Update rendering logic and animations.
- **Performance**: Improved perceived performance and visual stability.
