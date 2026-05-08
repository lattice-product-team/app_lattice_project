## MODIFIED Requirements

### Requirement: Arrival Summary
The system SHALL provide a bottom-mounted white glassmorphism sheet with Arrival Time, Duration, and Distance.

- **Duration Format**: If duration is less than 60 minutes, it SHALL be displayed in "X min". If 60 minutes or more, it SHALL be displayed in "Xh Ymin" (e.g., "1h 12min"). If exactly multiple of 60, it SHALL be "Xh" (e.g., "2h").

#### Scenario: Displaying long durations
- **WHEN** a route has an estimated duration of 75 minutes
- **THEN** the arrival summary shows "1h 15min" in the duration field.

#### Scenario: Displaying short durations
- **WHEN** a route has an estimated duration of 45 minutes
- **THEN** the arrival summary shows "45" and "min" as label.
