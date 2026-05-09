## Why

The current mobile interface uses two distinct patterns for displaying details: a comprehensive bottom sheet for Events and a minimal "mini-card" for POIs. This creates a fragmented user experience. Furthermore, the existing `EventDetailSheet` lacks the premium, high-fidelity aesthetic (blur effects, rich typography, and iconography) requested by the user. Unifying these into a single, adaptive, and visually stunning "Premium Detail Sheet" will provide a consistent and high-end feel across the entire exploration experience.

## What Changes

- **Unified Detail Architecture**: Replace the separate `EventDetailSheet` and `POIMiniCard` logic with a single, highly flexible `DetailSheet` component.
- **Visual Redesign (Level 1 & 2)**: Implement a new design language based on the reference images:
    - **Dynamic Header**: Glassmorphism-style top bar with integrated image background, logo/icon overlay, and action buttons (Share, Close).
    - **Action Pill Bar**: A horizontal row of high-contrast action pills (e.g., "52 min", "Website", "Tickets").
    - **Metric Grid**: A clean grid for quick stats like "Hours", "Ratings", "Accepts", and "Distance" with consistent iconography.
    - **Promotional Cards**: Integration of "Create a Custom Route" style cards within the sheet.
    - **Image Carousel**: A native-feeling image gallery for richer exploration.
- **Adaptive Content Rendering**: The sheet will automatically adjust its layout and sections based on the available data (e.g., hiding "Tickets" if not applicable, showing "Hours" only for POIs/Businesses).
- **Smooth State Transitions**: Refined Reanimated physics for transitions between Level 1 (peek), Level 2 (half), and Level 3 (full).

## Capabilities

### New Capabilities
- `unified-detail-orchestration`: A shared logic layer that adapts raw Event/POI data into a consistent UI model for the new sheet.

### Modified Capabilities
- `event-detail-sheet`: Redesigning the core requirement of how event details are presented.
- `mini-card-ui`: Deprecating the current "mini-card" in favor of the new unified sheet (Level 1/2).
- `premium-sheet-interaction`: Updating interaction patterns (gestures, snaps) to match the new visual hierarchy.

## Impact

- **Components**: `EventDetailSheet.tsx` (Complete rewrite), `POIMiniCard.tsx` (Removal/Refactor), `MapIndexPage` (Integration updates).
- **Stores**: `usePOIStore` and `useEventStore` may need small adjustments to share selection states more cleanly.
- **Styles**: Significant updates to design tokens (Blur, Shadows, Typography).
- **Assets**: New icons or refined SVG usage for the metric grid.
