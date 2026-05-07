## Context

The `admin-web` uses HeroUI v3 and `react-map-gl` (MapLibre) to provide interactive management tools. Currently, opening the creation modals for events and assets causes a crash because of a reference to `ModalContainer` (which is named `ModalContent` in v3). Furthermore, the complex interaction between the modal's animation and the map's initialization can lead to infinite loops or UI hangs if the map tries to resize into a 0-pixel container.

## Goals / Non-Goals

**Goals:**

- Fix the immediate crash by correcting component names.
- Ensure stable rendering of maps within modals.
- Align `Select` component usage with HeroUI standard API.
- Prevent infinite re-render loops in selection handlers.

**Non-Goals:**

- Refactoring the entire UI to a new framework.
- Adding new features to the event or asset creation forms beyond stability fixes.
- Changing the backend API.

## Decisions

### 1. Correct HeroUI Component Hierarchy

- **Decision**: Include `ModalDialog` inside `ModalContainer` and wrap the content.
- **Rationale**: The underlying `react-aria-components` requires a `Dialog` inside a `Modal` overlay for correct focus management. Missing this causes a focus trapping infinite loop that freezes the browser.
- **Alternative**: Using `ModalContent` was attempted but failed due to library export naming.

### 2. Dynamic Import for Maps

- **Decision**: Use Next.js `dynamic` with `ssr: false` to load `AdminMap`.
- **Rationale**: Prevents initialization issues in the modal context and ensures the container size is stable.

### 3. Robust Selection Handlers

- **Decision**: Guard selection handlers and robustly extract keys from potential `Selection` objects.
- **Rationale**: Prevents infinite re-render loops caused by state mismatches when a `Selection` object is compared to a string ID.

## Risks / Trade-offs

- **Risk**: Map might still flicker during modal transition.
  - **Mitigation**: Ensure `AdminMap` handles resize internally and use a slight delay or wait for modal animation to complete before full map interaction is enabled if necessary.
- **Risk**: `SelectItem` might require different styling than the current custom `ListBox.Item`.
  - **Mitigation**: Use HeroUI's `classNames` slot prop to match the existing aesthetic.
