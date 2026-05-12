# Tasks: Reimplement AR Event Exploration

## Phase 1: Infrastructure & Store
- [x] Install `expo-screen-orientation`.
- [x] Create `apps/mobile/src/features/map/store/useARStore.ts`.
- [x] Create `apps/mobile/src/features/map/hooks/useARData.ts` to handle complex filtering logic.

## Phase 2: UI Entry Points
- [x] Add "Binoculars" handler to `AdaptiveControlOverlay.tsx`.
- [x] Add "Use AR" button to `useDetailModel.ts` for Events.
- [x] Add "Use AR" button to `useDetailModel.ts` for POIs.

## Phase 3: AR Core Updates
- [x] Update `AROverlay.tsx`:
    - Integrate with `useARStore`.
    - Implement `useARData` for dynamic pin rendering.
    - Add orientation lock logic (`useEffect`).
    - Add real-time heading tracking (`watchHeadingAsync`).
- [x] Update `ARHUD.tsx`:
    - Make status messages and titles dynamic based on `filterMode`.
    - Fix padding/safe areas for Portrait-only mode.
- [x] Update `MainARScene.tsx`:
    - Optimize 3D pin rendering.
    - Remove landscape-specific layout logic.

## Phase 4: Integration & Polish
- [x] Mount `AROverlay` in `apps/mobile/app/(main)/index.tsx`.
- [x] Ensure smooth transitions when entering/exiting AR.
- [x] Test permission flows (Camera/Location).
- [x] Verify Portrait lock on physical devices.
