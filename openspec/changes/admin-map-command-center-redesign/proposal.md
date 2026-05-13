## Why

The current Global Map interface suffers from layout congestion and poor interaction design. The floating navigation and logout buttons block map areas, there is no centralized search for events, and identifying events at a glance is difficult without hover interactions. This change aims to transform the map into a high-efficiency "Command Center" that balances information density with operational clarity.

## What Changes

- **Unified Command Dock**: Replace the current disparate floating elements with a structured top-dock containing global search and system status.
- **Collapsible Operations Panel**: Introduce a left-side panel to manage event layers and quick navigation, replacing the current "Active Layers" card.
- **Native Map Labeling**: Implement persistent event name labels on the map using symbol layers, reducing reliance on hover-states for basic identification.
- **Non-Blocking Navigation**: Transition the primary application navigation to a minimal, non-blocking component integrated into the command dock or sidebar.
- **Enhanced Crowd Radar**: Maintain and improve the Crowd Radar heatmap integration with a more intuitive "Scanner" toggle.

## Capabilities

### New Capabilities
- `admin-map-command-center`: Defines the requirements for the centralized map control interface, including search, layer management, and native labeling.

### Modified Capabilities
<!-- No functional changes to core data services, only UI/UX re-architecture. -->

## Impact

- **Affected Apps**: `apps/admin-web`
- **Affected Components**: `src/app/(admin)/page.tsx` (GlobalOperationsPage), `src/components/map/admin-map.tsx`, `src/components/floating-nav.tsx`.
- **User Experience**: Improved spatial awareness and faster event discovery through centralized search.
