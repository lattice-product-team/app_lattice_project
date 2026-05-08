## Why

The current user profile is a standard full-screen view (`/(main)/profile.tsx`) that feels disconnected from the app's core "Floating Island" navigation experience. Users want a more fluid, integrated way to access their profile stats and settings. The profile should behave as an independent overlay sheet (similar to event details) that sits above the main map controls and hides the primary island when active.

## What Changes

- **Profile View Transformation**: Transition the profile from a dedicated screen to an independent overlay sheet component.
- **Independent Overlay Logic**: The profile will be a separate layer (Z-index above main island) that can be triggered from the map.
- **Island Concealment**: When the profile overlay is active, the primary "Interactive Island" should be hidden or minimized to avoid visual clutter and focus the user's attention.
- **Nivel 2 Behavior**: The profile overlay will have its own state management, defaulting to a "Nivel 2" (0.5 height) expansion.
- **Visual Redesign**: Implement a new content layout based on the provided reference:
    - Centralized profile summary (Name, "Confidence" label, and character illustration).
    - Gamified progress bar (Level + Percentage).
    - Summary card ("Waiting for hidden qualities...") with action buttons.
    - Quick-stat cards (Daily activities, Streak, Time spent).
- **Control Icons**: Top-bar layout with Settings (left) and Close (right) functionality.

## Capabilities

### New Capabilities
- `profile-dropdown-view`: Specification for the new dropdown-based profile interface, its states (Nivel 2), and the gamified layout components.

### Modified Capabilities
- `functional-profile-actions`: Update requirements to handle actions (Settings, Logout, etc.) within the dropdown context instead of a standalone screen.

## Impact

- **Affected Files**: `apps/mobile/app/(main)/profile.tsx`, `apps/mobile/src/features/profile/components/*`.
- **Navigation**: The `profile.tsx` route will be refactored to trigger the dropdown state on the main screen.
- **UI Components**: Introduction of gamified stats components and progress bars.
