## 1. Map Enhancement

- [x] 1.1 Add `SymbolLayer` to `src/components/map/admin-map.tsx` to display event names natively.
- [x] 1.2 Update `allBoundariesGeoJSON` in `AdminMap.tsx` to include event `name` and `primaryColor` in GeoJSON properties.
- [x] 1.3 Implement zoom-level visibility logic for map labels to prevent clutter at low zoom levels.

## 2. Command Center Shell

- [x] 2.1 Refactor `src/app/(admin)/page.tsx` to introduce a grid/flex layout shell for the sidebar and main map area.
- [x] 2.2 Implement the `CommandDock` component (top bar) with an integrated search input for events.
- [x] 2.3 Create the collapsible `Sidebar` component to house event layers and navigation.
- [x] 2.4 Integrate `FloatingLogout` into the new shell architecture (Command Dock or Sidebar) and remove the old absolute positioning.

## 3. Interaction Logic

- [x] 3.1 Implement search filtering logic: searching for an event highlights it in the list and centers the map.
- [x] 3.2 Add a toggle in the sidebar for the "Crowd Radar" (Activity) for each event.
- [x] 3.3 Ensure the `FloatingNav` is either integrated into the sidebar or converted to a non-blocking minimal pill.

## 4. Polishing and Responsive Design

- [x] 4.1 Update `admin-web/src/app/globals.css` with any new layout variables (e.g., sidebar width).
- [x] 4.2 Ensure the sidebar handles mobile viewports correctly (collapses/hides automatically).
- [x] 4.3 Verify that map interactions (zoom, pan, click) are fully accessible across the entire viewport.
