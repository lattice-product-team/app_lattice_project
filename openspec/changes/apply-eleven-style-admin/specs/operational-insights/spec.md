## ADDED Requirements

### Requirement: Accessibility Health Index
The system SHALL calculate an "Accessibility Health Index" for the active event by comparing the number of active users with reduced mobility against the congestion levels of wheelchair-accessible path segments.

#### Scenario: Index Calculation
- **WHEN** 10% or more of active users have `mobility_mode` set to "wheelchair" or "reduced_mobility"
- **AND** the primary accessible path to the event is "Blocked"
- **THEN** the system MUST report a "Low" accessibility health status.

### Requirement: Critical POI Monitoring
The system SHALL monitor all Points of Interest (POIs) and flag those with a `crowd_level` of "High" or "Blocked" as "Critical".

#### Scenario: Alerting Critical POIs
- **WHEN** a Medical or WC POI reaches "Blocked" status
- **THEN** the Dashboard MUST highlight this POI in the "Monitoring" section with a visual warning.

### Requirement: Gate Traffic Analysis
The system SHALL visualize the inflow rate per entry gate based on ticket validation data.

#### Scenario: Verify Gate Traffic
- **WHEN** an admin views the dashboard
- **THEN** they MUST be able to see a ranked list of entry gates by their current traffic velocity (users per minute).
