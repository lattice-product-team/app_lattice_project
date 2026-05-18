## Why

Older Android devices experience severe lag and frame drops when interacting with the map due to the high overhead of React-based `PointAnnotation` markers. These markers are treated as individual native views, forcing constant synchronization between the React Native bridge and the MapLibre OpenGL render loop. Transitioning to native `SymbolLayer` and `CircleLayer` will offload rendering entirely to the GPU, ensuring a smooth 60 FPS experience across all supported devices, including low-end hardware.

## What Changes

- **Native Marker Rendering**: Transition from `PointAnnotation` (React views) to `SymbolLayer` and `CircleLayer` for all Points of Interest (POIs) and Events.
- **SDF Icon Integration**: Implement Signed Distance Field (SDF) icons to allow dynamic, data-driven coloring of markers directly on the GPU.
- **Native Labeling**: Use native `textField` with halos for event and POI labels, ensuring high visibility and performance.
- **Optimized Clustering**: Leverage native `ShapeSource` clustering for high-density areas to reduce visual clutter and processing load.
- **Selection Handling**: Maintain a single "Active" `PointAnnotation` for complex animations on selected items while keeping all other markers in native layers.

## Capabilities

### New Capabilities

- `native-gpu-markers`: GPU-accelerated rendering of map features using MapLibre layers.
- `sdf-icon-pipeline`: Support for dynamic tinting of monochrome icons using SDF technology.

### Modified Capabilities

- `hybrid-map-rendering`: Shift from view-heavy to layer-heavy rendering strategy.
- `map-pin-components`: Standardize visual representation within native layer constraints.

## Impact

- **Mobile App**: Significant reduction in CPU/RAM usage on the map screen. Faster pan/zoom response.
- **Map Service**: Possible updates to GeoJSON properties to include `icon_name` and `color_hex` for data-driven styling.
- **Asset Management**: Addition of monochrome SDF-ready icon assets.
