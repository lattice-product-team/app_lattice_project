## Context

Currently, the "Midnight Island" handles both discovery and event summaries within the same component structure. This proposal evolves the architecture into a stacked system where event details are rendered in a separate, dedicated sheet that overlays the main discovery interface.

## Goals / Non-Goals

**Goals:**

- Implement a secondary `EventDetailSheet` component.
- Manage sheet stacking in `index.tsx` using a `selectedEventId` state.
- Preserve the underlying island state (search results, scroll position).
- Mimic Apple Maps' high-fidelity POI card aesthetics.

**Non-Goals:**

- Removing the existing island (it must stay underneath).
- Implementing the map camera synchronization (postponed).

## Decisions

### 1. Sheet Stacking & Gesture Isolation

- **Decision**: Render `EventDetailSheet` as a separate absolute-positioned layer above the main island.
- **Rationale**: This allows both sheets to have independent animation states (`islandState` vs `detailSheetState`).
- **Isolation**: When the detail sheet is active, the main island will receive `pointerEvents="none"` to prevent accidental dragging of the background layer.

### 2. Layout & Levels

- **Nivel 0**: Dismissed (hidden below screen).
- **Nivel 2 (0.5)**: Floating state (12px margins, 32px bottom radius).
- **Nivel 3 (1.0)**: Expanded state (0px margins, 0px bottom radius).
- **Rationale**: Maintains consistency with the design language established for the main island.

### 3. Component Architecture

- **Header**: Contains the "drag handle", a "Share" button on the left, and a "Close (X)" button on the right.
- **Quick Actions Row**: Three symmetrical buttons (Directions, Call, Website) using `LatticeTheme.colors.brand.primary` and `glass` variants.
- **Content ScrollView**: A vertical scroll area for "About", "Ratings", and "Gallery" sections.

## Risks / Trade-offs

- [Risk] → Memory overhead of keeping two complex sheets in the tree.
- [Mitigation] → Use `React.memo` and ensure the underlying sheet is not performing expensive operations while "covered".
- [Risk] → Complex gesture handling with nested ScrollViews.
- [Mitigation] → Apply the same "scrollEnabled" logic used in the main island (only scrollable at Nivel 3).
