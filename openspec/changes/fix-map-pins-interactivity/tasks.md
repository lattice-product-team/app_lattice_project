## 1. Core Map Logic Updates

- [x] 1.1 Implement `onRegionIsChanging` handler in `MapContent.tsx`
- [x] 1.2 Add a throttled zoom update mechanism to ensure fluid pin filtering
- [x] 1.3 Add coordinate validation to filter out [0,0] pins in `MapContent`
- [x] 1.4 Adjust `getFilteredPOIs` to be more lenient and prioritize selected event children
- [x] 1.5 Implement `zoomSharedValue` in `MapContent` to drive pin animations without re-renders

## 2. Marker Component Stabilization & Animation

- [x] 2.1 Update `EventPin.tsx` with a Reanimated-driven opacity reveal strategy
- [x] 2.2 Update `POIPin.tsx` with a Reanimated-driven opacity reveal strategy
- [x] 2.3 Ensure both pin components handle the initial mount without visual glitches
- [x] 2.4 Implement exit animations (fade-out) in `EventPin` and `POIPin` using zoom thresholds
- [x] 2.5 Ensure POIs appear immediately when an event is selected regardless of zoom

## 3. Verification

- [x] 3.1 Verify pins appear/disappear smoothly during a zoom gesture
- [x] 3.2 Verify pins no longer flash in the top-left corner on mount or map reset
- [x] 3.3 Verify panning performance remains smooth (60fps)
