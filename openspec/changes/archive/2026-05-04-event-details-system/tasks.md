## 1. Foundation & State

- [x] 1.1 Add `selectedEventId` state to `index.tsx` to track the active detail view.
- [x] 1.2 Implement `EventDetailSheet` component scaffold with its own `detailSheetState` shared value.
- [x] 1.3 Add opening/closing logic with `withSpring` animations between Level 0 and Level 2.

## 2. Detail Sheet UI

- [x] 2.1 Create the symmetrical header with "Share", "Drag Handle", and "Close (X)" buttons.
- [x] 2.2 Implement the "Quick Actions" row with "Directions", "Call", and "Website" buttons.
- [x] 2.3 Apply the "Border Overlay" pattern to the detail sheet container and action buttons.
- [x] 2.4 Build the information grid section (Open/Closed status, Ratings, Distance).

## 3. Interaction & Refinement

- [x] 3.1 Implement `pointerEvents` toggling to disable the main discovery island when details are open.
- [x] 3.2 Ensure the `SafeBlurView` on the detail sheet animates from blur (Level 2) to solid color (Level 3).
- [x] 3.3 Add `Haptics.impactAsync` to all new interactive buttons and sheet snap points.

## 4. Data Integration

- [x] 4.1 Create a mock data service/hook to provide enriched event details (About text, ratings).
- [x] 4.2 Map the `selectedEvent` data to the UI fields in the detail sheet.
