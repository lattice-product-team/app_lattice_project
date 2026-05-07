## ADDED Requirements

### Requirement: Dynamic Operational Data Fetching
The system SHALL fetch all administrative table data (Events, Venues, POIs) from the backend API endpoints instead of using local mock objects.

#### Scenario: Successful Venue List Load
- **WHEN** an administrator navigates to the Venues page
- **THEN** the system MUST execute a GET request to `/api/v1/venues` and populate the table with the returned records.

### Requirement: Robust Response Validation
The system SHALL validate that API responses for list views are valid arrays before attempting to iterate or render them.

#### Scenario: Handling API Error Object
- **WHEN** the backend returns an error object (e.g., `{"error": "..."}`) instead of an array
- **THEN** the frontend MUST catch the type mismatch, fallback to an empty array, and display a user-friendly error toast.

### Requirement: Standardized Loading and Empty States
All dynamic administrative views SHALL implement visible loading indicators and explicit "No Data Found" states.

#### Scenario: Initializing Data Load
- **WHEN** a data-dependent page is first mounted
- **THEN** it MUST display a skeleton or spinner until the data fetching promise is settled.
