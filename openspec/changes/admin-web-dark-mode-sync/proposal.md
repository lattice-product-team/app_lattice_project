## Why

The `admin-web` dashboard currently forces a light theme regardless of the user's system preferences. Implementing system-synchronized dark and light modes, along with a manual toggle, is essential for visual comfort, especially for "command center" operations, and ensures the application follows modern web accessibility standards.

## What Changes

- **Theme Management**: Integration of `next-themes` to handle theme detection, persistence, and manual switching.
- **System Synchronization**: The application will default to the system's preferred theme (Dark/Light).
- **Manual Theme Switch**: Addition of a theme toggle UI in the Control Panel (Sidebar) footer, featuring animated Sun/Moon icons.
- **Map Theme Integration**: The `AdminMap` component will dynamically switch its MapTiler style based on the active theme.
- **CSS Variable Refinement**: Completion and refinement of dark mode tokens in `globals.css` to ensure full coverage and high-contrast accessibility.

## Capabilities

### New Capabilities
- `theme-management`: Handles the global theme state, system preference detection, manual overrides, and persistence across sessions.
- `map-theme-sync`: Extends the theme state to the geographic visualization layer.
- `theme-toggle-ui`: Provides a visual interface for users to manually switch themes with animated feedback.

### Modified Capabilities
- None.

## Impact

- **apps/admin-web**: `RootLayout`, `Providers`, `globals.css`, `AdminMap`, and `Sidebar` components.
- **dependencies**: Addition of `next-themes` to `admin-web`.
