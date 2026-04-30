## Context

The application is transitioning to an event-centric discovery model. Currently, the UI is cluttered with legacy components from its previous "circuit navigation" phase. The interaction model needs to be unified under a single, high-fidelity system that handles both global exploration and specific event/POI details using `@gorhom/bottom-sheet`.

## Goals / Non-Goals

**Goals:**
- **Unified Action Trident**: Implement a persistent "Navigate | Tickets | Calendar" row in the detail sheet.
- **Contextual Discovery**: Refactor the main sheet to show trending events by default.
- **Integrated Saved List**: Move "Saved Items" from a Modal to a dynamic state within the `MapBottomSheet`.
- **1:N Visual Support**: Enable the map to show related sub-POIs when an event is selected.

**Non-Goals:**
- Implementing the actual Ticket purchase flow (external links are sufficient for now).
- Changing the underlying MapLibre rendering engine.
- Adding social features (comments/likes) at this stage.

## Decisions

### 1. Sticky Trident & Header Structure (Apple Style)
To match Apple Maps' high-fidelity interaction:
- **Header**: Contains `title` and `category`. Fixed at the top.
- **Trident**: A horizontal row of three circular buttons (36-44px height). This row is **sticky** and sits directly below the header.
- **Styling**: Use `rgba(255, 255, 255, 0.08)` for button backgrounds in dark mode to achieve the "glass pill" look.

### 2. Sheet Aesthetics & Micro-interactions
- **Corner Radius**: Uniform 32px for all sheets.
- **Border**: 0.5px "inner glow" using `rgba(255, 255, 255, 0.15)` on the top edge.
- **Blur**: Intensity set to 85-90 for a thick, premium glass effect.
- **Haptics**: Trigger `Haptics.ImpactFeedbackStyle.Light` exactly when the `snapPoint` is reached.

### 3. "Zoom to Explore" Camera Orchestration
When an Event is selected:
- **Camera**: Animate to `fitBounds` of child POIs with a padding of 50px.
- **Orchestration**: The `PoiDetailSheet` will expand to "Medium" height while the camera moves.

### 4. Temporal Discovery Filters
Airbnb-style horizontal pills in the main sheet.
- **Layout**: Sticky row below the search bar.
- **Interaction**: Selecting a filter updates the event list with a subtle fade animation.

### 5. Legacy Component Deletion
The following files are confirmed as dead code and will be removed:
- `QuickActions.tsx`: Replaced by the new discovery filters.
- `SheetFooterActions.tsx`: Replaced by the Sticky Trident.
- `SaveLocationModal.tsx`: Replaced by the integrated Saved Center (with Sharing).

## Risks / Trade-offs

- **[Risk] Content Overflow** → [Mitigation] The fixed header + action row consumes ~150px of vertical space. We must ensure the snap points are adjusted so the scroll area remains usable even in "Medium" snap height.
- **[Risk] State Complexity** → [Mitigation] Use `useMapUIStore` to clearly define mutually exclusive states (EXPLORING, SAVED_LIST, POI_DETAIL).
