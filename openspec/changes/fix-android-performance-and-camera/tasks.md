## 1. Viewport State Optimization

- [ ] 1.1 Implement a throttle mechanism (100ms) for `onRegionIsChanging` in `MapContent.tsx`.
- [ ] 1.2 Add threshold-based logic to `setCurrentZoom` (only update React state if zoom delta > 0.15).
- [ ] 1.3 Throttle `setLastCameraPosition` store updates to reduce bridge traffic.

## 2. GL Layer Migration

- [ ] 2.1 Add `MapImageManager` to `MapContent.tsx` to register event thumbnails in the GL texture atlas.
- [ ] 2.2 Transition event markers in `MapLayers.tsx` from `PointAnnotation` to `SymbolLayer` and `CircleLayer`.
- [ ] 2.3 Update `onPoiPress` to handle interactions from the new `ShapeSource` event layers.
- [ ] 2.4 Optimize POI and event labels with smooth zoom-based opacity interpolations in GL.

## 3. Camera & UI Stabilization

- [ ] 3.1 Refactor `MapCameraManager.tsx` to prevent animation command overlapping on Android.
- [ ] 3.2 Update `SafeBlurView.tsx` with high-performance fallbacks or reduced intensity for Android platforms.
- [ ] 3.3 Ensure `AROverlay.tsx` properly releases resources (Three.js and CameraView) when backgrounded or hidden.

## 4. Verification

- [ ] 4.1 Validate 60fps map panning performance on Android.
- [ ] 4.2 Confirm camera selection transitions are fluid and responsive.
- [ ] 4.3 Verify haptic feedback and interactions work correctly on the new GL-based event markers.
