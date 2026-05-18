## Context

The current application relies on React Native `PointAnnotation` components to render map markers for POIs and Events. On high-end devices, this works adequately, but on older hardware (especially Android), the overhead of maintaining dozens of individual native views synchronized with the map's OpenGL loop causes severe frame drops and lag.

## Goals / Non-Goals

**Goals:**

- Transition the bulk of map markers to GPU-accelerated `SymbolLayer` components.
- Implement dynamic coloring using Signed Distance Field (SDF) icons.
- Ensure event and POI labels are performant and readable using native halos.
- Implement native clustering to handle dense marker areas smoothly.

**Non-Goals:**

- Removing React-based markers entirely (a single marker will remain for the "selected" state).
- Changes to the underlying map style or provider (MapTiler).

## Decisions

- **Layer-Based Architecture**: Move POIs and Events into `SymbolLayer` and `CircleLayer` within a `ShapeSource`. This allows the GPU to render thousands of markers in a single draw call.
- **SDF Icon Pipeline**: Use monochrome SVG assets registered with `sdf: true`. MapLibre will then allow dynamic tinting via the `iconColor` property using data-driven expressions.
- **Expression-Based Styling**: Use Mapbox/MapLibre expressions (e.g., `['get', 'color']`, `['match', ...]`) to handle visual logic on the native side instead of within React render cycles.
- **Hybrid Selection Pattern**: When a user selects a marker, the native layer for that specific ID will be hidden (via filter), and a single high-fidelity React `PointAnnotation` will be mounted. This provides the best of both worlds: extreme performance for the crowd and rich interaction for the focus.
- **Native Text Halos**: Replace background View components for text with `textHaloColor: '#FFFFFF'` and `textHaloWidth: 2`.

## Risks / Trade-offs

- **[Risk]**: Interactivity on `SymbolLayer` can be less precise than React views. → **[Mitigation]**: Implement a generous hit-box (via `hitbox` prop) and use `queryRenderedFeatures` for precise selection.
- **[Risk]**: SVG to SDF conversion can sometimes lose fine detail. → **[Mitigation]**: Stick to simple, high-contrast geometric icons for the marker symbols.
- **[Risk]**: Complexity of managing `Images` registration. → **[Mitigation]**: Centralize icon registration in the `MapImageManager` component.
