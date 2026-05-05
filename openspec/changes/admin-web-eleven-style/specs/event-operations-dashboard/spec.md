## MODIFIED Requirements

### Requirement: Live Event Header
The system SHALL display a context-aware header on the dashboard indicating the current active event's name and its operational status. For administrative interfaces, the header MUST use the Waldenburg 300 typography at a minimum of 32px with -0.64px letter-spacing to ensure an editorial, premium aesthetic.

#### Scenario: Live Event Display
- **WHEN** an administrator logs into the dashboard during an active event timeframe
- **THEN** the header MUST show the event name using Waldenburg 300 typography with a "LIVE" status indicator rendered as a black Obsidian pill badge.

### Requirement: Operational Overview Cards
The system SHALL provide real-time metrics in a summary section. These cards MUST be rendered as "Floating Product Demo Cards" with a #ffffff background, 16px border-radius, and hairline shadow (rgba(0,0,0,0.4) 0px 0px 1px) to distinguish them from the Eggshell ground.

#### Scenario: Real-time Metric Updates
- **WHEN** telemetry data changes
- **THEN** the dashboard cards MUST reflect the updated values immediately, using Inter 500 for metric values and Inter 400 for descriptors.

### Requirement: Gate Congestion Status
The dashboard SHALL include a table listing all active venue gates. This table MUST adhere to the HeroUI v3 Dot Notation standards and use the "Chalk" (#e5e5e5) border color for all dividers.

#### Scenario: Gate Status Identification
- **WHEN** a gate reaches a "High" or "Blocked" crowd level
- **THEN** the status MUST be indicated using a pill-shaped badge (9999px radius) with specific achromatic colors defined in the ElevenLabs system.
