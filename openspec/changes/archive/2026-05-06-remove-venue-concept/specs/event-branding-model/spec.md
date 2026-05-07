## ADDED Requirements

### Requirement: Independent Event Branding

The system SHALL support branding properties (primary color, logo) directly at the Event level to eliminate dependency on a parent Venue.

#### Scenario: Customizing event color

- **WHEN** an administrator updates the `primary_color` of an Event
- **THEN** the Auth and Mobile services MUST reflect this color in their respective UIs (e.g., login screens, headers) for that specific event.

### Requirement: Unified Metadata Structure

The system SHALL consolidate all auxiliary properties (social metrics, website, capacity) into a unified metadata structure within the Event entity.

#### Scenario: Fetching social data for an event

- **WHEN** a client requests event details
- **THEN** the system MUST return the `social` proof data (ratings, reviews) merged with other metadata fields.
