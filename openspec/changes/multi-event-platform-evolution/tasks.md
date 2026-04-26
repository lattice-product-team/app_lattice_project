## 1. Database & API Foundation

- [x] 1.1 Create migration for `events` table with category enum and geo boundaries
- [x] 1.2 Update `points_of_interest` and `nodes` tables to include `event_id`
- [x] 1.3 Update Geo service API endpoints to support `eventId` filtering
- [x] 1.4 Implement `GET /events` endpoint to fetch active festivals

## 2. Global State & Dynamic Theming

- [ ] 2.1 Update `useMapStore` to manage `currentEventId` and `selectedEvent`
- [ ] 2.2 Create `useEventTheme` hook for dynamic category-based styling
- [ ] 2.3 Add `event_type` to model types and schema

## 3. Multi-Event Discovery UI

- [ ] 3.1 Build `EventCarousel` component for the Discovery state
- [ ] 3.2 Update `MapBottomSheet` to handle the `Discovery` state transition
- [ ] 3.3 Implement "Fly-To" animation when selecting an event from the carousel

## 4. Accessibility & Routing Logic

- [ ] 4.1 Update `useLocationStore` to include user accessibility preferences
- [ ] 4.2 Refactor `useRoutingLogic` to check distance from event boundary
- [ ] 4.3 Implement "Remote Mode" UI warning for out-of-range navigation
- [ ] 4.4 Update routing engine to filter path segments based on accessibility toggles

## 5. Offline Experience

- [ ] 5.1 Implement `OfflineManager` service for tile and data bundling
- [ ] 5.2 Add "Download for Offline" button to the event context view
- [ ] 5.3 Implement fallback to local GeoJSON data when network is unavailable

## 6. User Profile & Settings

- [ ] 6.1 Build the new `Profile` screen with event history
- [ ] 6.2 Implement accessibility toggle switches in the Profile settings
- [ ] 6.3 Link profile preferences to the global routing state
