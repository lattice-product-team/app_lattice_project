## 1. UI Cleanup and Header Update

- [x] 1.1 Remove generic "Kate" greeting and hardcoded greeting logic from `apps/admin-web/src/app/page.tsx`.
- [x] 1.2 Implement dynamic "Event Status" header showing current event ("Formula 1 Spanish GP") and a "LIVE" status Chip.
- [x] 1.3 Audit and remove any remaining unused imports (`Avatar`, `Input`, etc.) in `page.tsx`.

## 2. Operational Overview Cards

- [x] 2.1 Refactor the top section to use a 3-column grid for overview metrics.
- [x] 2.2 Implement "Active Spectators" card using `Icons.Users` and mock data (e.g., 84.2K).
- [x] 2.3 Implement "Incident Alerts" card using `Icons.Bell` and a "High" status indicator if alerts > 0.
- [x] 2.4 Implement "Ticket Claimed" card showing percentage (e.g., 92%) and a progress bar or indicator.

## 3. Operations Visualization (Charts)

- [x] 3.1 Update the "Total Sales" bar chart to represent "Spectator Inflow" by hour (08:00 - 14:00).
- [x] 3.2 Update chart labels and axis to reflect event times instead of generic indices.
- [x] 3.3 Replace the generic line chart with a "Density Trend" visualization showing zone-specific saturation.

## 4. Gate & Access Point Status Table

- [x] 4.1 Create a new mock data array for `gates` (ID, Name, Location, Load, WaitTime, Status).
- [x] 4.2 Replace "Employees Table" structure with the "Gate Status" schema.
- [x] 4.3 Ensure strict HeroUI v3 compound component nesting: `Table > ScrollContainer > Content > Header / Body`.
- [x] 4.4 Add `isRowHeader` to the `Gate ID` column.
- [x] 4.5 Implement conditional styling for the "Load" column (e.g., red Chip for "High/Blocked").

## 5. Final Polish & Validation

- [x] 5.1 Update all dashboard action buttons to use the `rounded-full` style established in `standards-alignment`.
- [x] 5.2 Verify entire dashboard renders without runtime errors or console warnings.
- [x] 5.3 Run `npm run lint --prefix apps/admin-web` to ensure clean code.
