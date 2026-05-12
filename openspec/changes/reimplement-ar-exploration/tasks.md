# Tasks: Reimplement AR Event Exploration

## Phase 1: Infrastructure & Store
- [ ] Install `expo-screen-orientation`.
- [ ] Create `apps/mobile/src/features/map/store/useARStore.ts`.
- [ ] Create `apps/mobile/src/features/map/hooks/useARData.ts` to handle complex filtering logic.

## Phase 2: UI Entry Points
- [ ] Add "Binoculars" handler to `AdaptiveControlOverlay.tsx`.
- [ ] Add "Use AR" button to `useDetailModel.ts` for Events.
- [ ] Add "Use AR" button to `useDetailModel.ts` for POIs.

## Phase 3: AR Core Updates
- [ ] Update `AROverlay.tsx`:
    - Integrate with `useARStore`.
    - Implement `useARData` for dynamic pin rendering.
    - Add orientation lock logic (`useEffect`).
    - Add real-time heading tracking (`watchHeadingAsync`).
- [ ] Update `ARHUD.tsx`:
    - Make status messages and titles dynamic based on `filterMode`.
    - Fix padding/safe areas for Portrait-only mode.
- [ ] Update `MainARScene.tsx`:
    - Optimize 3D pin rendering.
    - Remove landscape-specific layout logic.

## Phase 4: Integration & Polish
- [ ] Mount `AROverlay` in `apps/mobile/app/(main)/index.tsx`.
- [ ] Ensure smooth transitions when entering/exiting AR.
- [ ] Test permission flows (Camera/Location).
- [ ] Verify Portrait lock on physical devices.
