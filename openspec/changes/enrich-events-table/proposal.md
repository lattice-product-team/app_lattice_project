## Why

The current Events dashboard provides limited visibility into operational details. To transform it into a production-grade operations center, we need to expose more data (Category, Timeline, Capacity) and automate the identification of event locations using reverse geocoding.

## What Changes

- **Database**: Add `address` column to the `events` table.
- **Backend (Geo Service)**:
    - Implement an automatic reverse geocoding utility to resolve coordinates into human-readable addresses.
    - Update event retrieval logic to include the new address and metadata fields.
- **Frontend (Admin Web)**:
    - Refactor the Events table to include: Category, Date Range, Address, and Capacity.
    - Implement a horizontally scrollable table container (`overflow-x-auto`) to handle the increased data density.
    - Apply editorial styling (Chips, tabular numerals) to the new columns.

## Capabilities

### New Capabilities
- `reverse-geocoding`: Automated resolution of coordinates to street/city addresses.
- `advanced-event-metadata`: Display of extended attributes like category and capacity.

### Modified Capabilities
- `global-ops-center`: Updated table structure and responsiveness.

## Impact

- **Database Schema**: Migration needed for `events` table.
- **Geo Service**: New external dependency/utility for geocoding.
- **Admin UI**: Layout changes in `/events` page.
