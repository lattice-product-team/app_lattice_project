## 1. Data Adapter & Validation

- [x] 1.1 Create `poiAdapter.ts` in `features/poi/adapters/` to centralize normalization
- [x] 1.2 Implement strict coordinate validation (filtering [0,0], null, undefined) in the adapter
- [x] 1.3 Move event-to-POI conversion logic from `MapContent` to the adapter

## 2. Component Decomposition

- [x] 2.1 Create `MapCameraManager.tsx` to handle camera positioning, fitBounds, and zoom state
- [x] 2.2 Create `MapLayers.tsx` to host GL-based ShapeSources and SymbolLayers
- [x] 2.3 Create `MapInteractionLayer.tsx` as a container for React-driven `MarkerView`s
- [x] 2.4 Refactor `MapContent.tsx` to orchestrate these new specialized sub-components

## 3. Hybrid Rendering Implementation

- [x] 3.1 Implement `POISymbolLayer` within `MapLayers` for background POI rendering
- [x] 3.2 Add `onPress` handling to `MapLayers` ShapeSource to enable selection of GL POIs
- [x] 3.3 Update `MapContent` logic to split visible data between GL (background) and React (active) layers
- [x] 3.4 Ensure the "Selected POI" is dynamically excluded from the GL layer to avoid duplication

## 4. Stability & Polish

- [x] 4.1 Update `EventPin.tsx` and `POIPin.tsx` with a refined opacity reveal strategy
- [x] 4.2 Audit `MapContent` and its children for redundant re-renders using `React.memo`
- [x] 4.3 Implement exit animations for `MarkerView`s to ensure smooth transitions when filtering

## 5. Verification

- [x] 5.1 Verify map performance remains at 60fps with 100+ active POIs
- [x] 5.2 Confirm that no icons flash at the (0,0) coordinate during map mount or rapid panning
- [x] 5.3 Verify that selecting a GL icon correctly triggers the selection state and replaces it with a MarkerView
