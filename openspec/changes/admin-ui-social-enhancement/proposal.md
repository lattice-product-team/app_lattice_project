# Change: Admin UI & Social Enhancement

Objective: Improve the Admin Web visual quality by redesigning status indicators and implementing a full-featured social proof system for events.

## 1. UI Redesign (Status Buttons)
- Create a new design for the 'Status' column in both POI and Event tables.
- **Style**: White operation-style buttons, high-contrast text, subtle shadows, and premium border treatments.
- **Interactivity**: Hover states and clear visual feedback for 'Open', 'Maintenance', 'Active', and 'Past' states.

## 2. Event Social Proof (Feature Port)
- Port the robust social proof system from POIs to Events.
- **Components**:
  - Interactive Star Rating (1-5).
  - Review counter display.
  - Animated sync state (`syncingIds`).
- **Logic**:
  - Integrate `syncSocial` helper using the existing `/social/sync` API endpoint (type: 'event').
  - Ensure metadata parsing correctly handles the `social` object within the event metadata.

## 3. Implementation Steps

### Phase 1: Global UI Refinement
- [ ] Define the new Status Button component/style in `admin-web`.
- [ ] Update `pois/page.tsx` to use the new status style.
- [ ] Update `events/page.tsx` to use the new status style.

### Phase 2: Event Social Proof
- [ ] Implement `syncSocial` logic in `events/page.tsx`.
- [ ] Update the 'Rating' column in `events/page.tsx` to match the POI star system.
- [ ] Add the review counter and animated sync icon.

## 4. Verification
- [ ] Confirm Social Proof sync works for Events.
- [ ] Verify visual consistency between POI and Event tables.
