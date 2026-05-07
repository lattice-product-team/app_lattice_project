## ADDED Requirements

### Requirement: Automated Location Resolution
The system SHALL resolve the latitude and longitude coordinates of an event into a human-readable address (including street, city, and country) automatically upon creation or coordinate update.

#### Scenario: Successful Address Resolution
- **WHEN** an event is created or its coordinates are updated
- **THEN** the system SHALL fetch the corresponding address from the geocoding provider and persist it in the event's `address` field.

#### Scenario: Fallback to Formatted Coordinates
- **WHEN** the geocoding service is unavailable or no address is found for the given coordinates
- **THEN** the system SHALL store the coordinates in a human-readable format (e.g., "41.3828°N, 2.1774°E") in the `address` field.

### Requirement: Address Exposure in API
The event API endpoints SHALL include the `address` field in their responses to provide human-readable location data to the frontend.

#### Scenario: Event Data Retrieval
- **WHEN** a client requests event details through the API
- **THEN** the response SHALL include the `address` field along with the raw coordinates.
