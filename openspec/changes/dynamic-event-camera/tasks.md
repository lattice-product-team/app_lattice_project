## 1. Aggressive Layer Calibration

- [x] 1.1 Update `poisCircle` and `poisIcon` minZoomLevel to **14.0** in `MapLayers.tsx` (was 15.5).
- [x] 1.2 Update `poisLabel` minZoomLevel to **15.0** in `MapLayers.tsx` (was 17.5).
- [x] 1.3 Calibrate `textOpacity` and `iconOpacity` to start at 14.0 and be fully opaque by 16.0.
- [x] 1.4 Enable `textAllowOverlap: true` for all POIs to prevent "flickering" due to collision at lower zooms.

## 2. Map Camera Implementation

- [x] 2.1 Update `MapCameraManager.tsx` to use the Standard Gold Zoom (**17.2**) for event selection.
- [x] 2.2 Implement centroid calculation helper to ensure the camera centers on the geometric middle of the event area.
- [x] 2.3 Apply standardized padding `[SCREEN_HEIGHT * 0.45, 60, 40, 40]` to the centering animation.

## 3. Validation

- [x] 3.1 Verify that POIs are clearly visible and labels are legible at zoom 15.0.
- [x] 3.2 Verify that clicking an event feels smooth and the camera lands at the perfect readable distance.
