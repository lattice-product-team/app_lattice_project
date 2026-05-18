# Proposal: Reimplement AR Event Exploration

## Problem

The previous AR functionality is currently orphaned and not integrated into the modern Map UI. Users need a way to explore events and pins in real-time using their camera, with specific filtering logic for global exploration, event-specific views, and individual pin tracking.

## Proposed Solution

Re-integrate the existing AR components (`AROverlay`, `MainARScene`, `ARHUD`) into the main map page. Introduce a centralized `useARStore` to manage AR visibility and filtering modes. Add entry points in the map HUD (Binoculars) and detail sheets (Use AR button).

### Key Features

- **Centralized AR Store:** Manages `isVisible`, `filterMode`, and `targetId`.
- **Three Filtering Modes:**
  - `CLOSEST_EVENT`: Triggered by Binoculars. Shows pins for the nearest event.
  - `SELECTED_EVENT`: Triggered from Event Details. Shows pins for that event.
  - `SPECIFIC_PIN`: Triggered from POI Details. Shows only that pin.
- **Orientation Lock:** Forces Portrait mode when AR is active using `expo-screen-orientation`.
- **Real-time AR HUD:** Shows distance, bearing, and dynamic status messages.

## Scope

- `apps/mobile/src/features/map/store/useARStore.ts` (New)
- `apps/mobile/app/(main)/index.tsx` (Integration)
- `apps/mobile/src/features/map/components/ar/` (Updates to existing components)
- `apps/mobile/src/features/map/hooks/useDetailModel.ts` (UI Entry points)
- `apps/mobile/src/features/map/components/AdaptiveControlOverlay.tsx` (UI Entry points)

## Dependencies

- `expo-camera` (Already installed)
- `expo-location` (Already installed)
- `expo-sensors` (Already installed)
- `@react-three/fiber/native` (Already installed)
- `expo-screen-orientation` (Needs to be installed)
