## 1. Data Orchestration Layer

- [x] 1.1 Create `useDetailModel` hook to normalize Event and POI data.
- [x] 1.2 Implement category-to-icon mapping for POIs in the unified model.
- [x] 1.3 Add logic to hide/show sections based on data availability (e.g., tickets, hours).

## 2. Premium UI Components

- [x] 2.1 Implement `MetricGrid` component with icon-label pairs.
- [x] 2.2 Implement `ActionPillBar` with horizontal scrolling and haptics.
- [x] 2.3 Create `PremiumSheetHeader` with dark navy background and gradient depth.

## 3. Premium Detail Sheet Implementation

- [x] 3.1 Refactor `EventDetailSheet.tsx` to use the new `PremiumSheetHeader` and components.
- [x] 3.2 Update Reanimated physics for smoother Level 1 -> Level 2 transitions.
- [x] 3.3 Implement the "Custom Route" card integration within the sheet content.
- [x] 3.4 Integrate the image carousel for rich media display.

## 4. Integration & Cleanup

- [x] 4.1 Update `MapIndexPage.tsx` to use `PremiumDetailSheet` for both events and POIs.
- [x] 4.2 Deprecate and remove `POIMiniCard.tsx`.
- [x] 4.3 Verify haptic feedback and interaction consistency across all selection types.
- [x] 4.4 Final polish of colors and typography to match reference images exactly.
