## 1. Style Fetching Infrastructure

- [x] 1.1 Implement a `useMapStyle` hook or utility to fetch the MapTiler JSON style
- [x] 1.2 Add state management in `MapContent.tsx` to handle the patched style object
- [x] 1.3 Implement error handling and fallback to raw URLs if fetch fails

## 2. Style Patching Logic

- [x] 2.1 Implement the patching function to iterate through layers and set `visibility: 'none'` for:
    - [x] 2.1.1 `Ferry line` and `Ferry`
    - [x] 2.1.2 All `Highway shield` layers
    - [x] 2.1.3 All layers with `source-layer: "poi"`
- [x] 2.2 Integration: Apply the patched style to the `MapLibreGL.MapView`

## 3. Cleanup & Verification

- [x] 3.1 Remove the now-obsolete `setSourceVisibility` and `onDidFinishLoadingStyle` cleanup logic
- [x] 3.2 Verify that maritime lines and highway shields are gone in the simulator
- [x] 3.3 Verify that street names and city names are still clearly visible
- [x] 3.4 Confirm theme switching (Light/Dark) still works and patches the correct style
