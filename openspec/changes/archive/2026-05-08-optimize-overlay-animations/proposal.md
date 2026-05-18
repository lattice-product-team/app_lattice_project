## Why

The current implementation of the mobile application's main interface suffers from significant animation lag and "jitter" when transitioning between different UI states (Map, Exploration, Profile, Event Details). This is primarily caused by:

- Accessing Reanimated `SharedValue.value` during React component rendering, triggering excessive re-renders.
- A fragmented visibility logic where component display is controlled by a mix of React state and UI-thread animations.
- Heavy component re-renders on the main page blocking the JS bridge during critical animation frames.

## What Changes

### 1. Main Dropdown (Top-down)

- **Level 1**: Input + Profile Button (Very Small, ST).
- **Level 2**: Shortcuts (Events/Filters) (Small, ST).
- **Level 3**: Full Screen Search (Large, NT).
- **Behavior**: Collapses to Level 1 automatically if any bottom sheet is opened. Closes to Level 1 when opening Profile from Level 3.

### 2. Bottom-up Sheets (Business Details, Profile, Create Account)

- **Level 1 (ST)**: Basic Info. HUD buttons (Left/Right) perform a **fade-out** to avoid visual clutter behind the sheet.
- **Level 2 (NT)**: Detailed Info (Banner, Bio, etc.).
- **Specifics**:
  - Business Details: 2 levels (Small ST / Medium NT).
  - Profile: 2 levels (Small ST / Medium NT).
  - Create Account: 1 level (Medium-Small ST).

### 3. Bottom HUD Buttons

- **Left Button (Explore/Map Toggle)**: Persistent across modes, but fades out when a bottom sheet is in ST/NT mode.
- **Right Buttons (Controls)**: Map mode only, fades out when a bottom sheet is in ST/NT mode.

### 4. Navigation Mode

- **Behavior**: The Main Dropdown disappears completely. HUD buttons are replaced/modified for navigation focus.

## Capabilities

### New Capabilities

- `ui-state-manager`: Centralized SharedValue system to coordinate levels and transparency across all overlays.
- `hud-visibility-controller`: Logic to handle the fade-out of bottom buttons based on sheet positions.

### Modified Capabilities

- `mobile-overlay-system`: Refactor existing components to match the new 3-level (top) and 2-level (bottom) architecture.

## Impact

- `apps/mobile/app/(main)/index.tsx`: Significant refactoring of state and gesture logic.
- `apps/mobile/src/features/map/components/AdaptiveControlOverlay.tsx`: Updated to use derived visibility.
- `apps/mobile/src/features/map/store/useMapUIStore.ts`: Potential updates to sync UI-thread state back to the store when necessary.
