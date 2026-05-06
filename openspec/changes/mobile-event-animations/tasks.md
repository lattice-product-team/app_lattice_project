## 1. Setup & Context

- [x] 1.1 Locate the central component where `selectedEvent` (or `selectedPOI`) state is managed and where the Mapbox `<Camera>` ref is accessible (likely in the main map screen or a custom hook).
- [x] 1.2 Ensure the `<Camera>` component has an assigned `ref` to allow imperative method calls.

## 2. Core Implementation (Camera Fly-To)

- [x] 2.1 Implement a `useEffect` in the map component that triggers whenever `selectedEvent` changes and is not null.
- [x] 2.2 Within the effect, extract the coordinates from the selected event.
- [x] 2.3 Call `cameraRef.current?.setCamera({ centerCoordinate: [lng, lat], animationDuration: 800, animationMode: 'flyTo', zoomLevel: 15 })` (or similar appropriate zoom/duration).

## 3. Layout Offset Adjustments

- [x] 3.1 Modify the `setCamera` call to account for the BottomSheet. Use the Mapbox camera `padding` property (e.g., `{ paddingBottom: windowHeight * 0.4 }`) or manually calculate the offset center coordinate, to ensure the pin is framed in the upper half of the screen.

## 4. Interaction Binding

- [x] 4.1 Verify that tapping an event pin on the map updates the `selectedEvent` state (triggering the camera effect) without adding any bounce/scale animations to the pin component itself.
- [x] 4.2 Verify that tapping an event card in the discovery list (BottomSheet) also updates the `selectedEvent` state, thus sharing the exact same camera transition.
