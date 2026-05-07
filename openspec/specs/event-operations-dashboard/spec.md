## Purpose

Standardizes the operational interface for the Event Operations Dashboard.

## Requirements

### Requirement: Live Event Header

The system SHALL display a context-aware header on the dashboard indicating the current active event's name and its operational status. For administrative interfaces, the header MUST use the Waldenburg 300 typography at a minimum of 32px with -0.64px letter-spacing to ensure an editorial, premium aesthetic.

#### Scenario: Live Event Display

- **WHEN** an administrator logs into the dashboard during an active event timeframe
- **THEN** the header MUST show the event name using Waldenburg 300 typography with a "LIVE" status indicator rendered as a black Obsidian pill badge.

### Requirement: Operational Overview Cards

The system SHALL provide real-time metrics for "Active Spectators", "Active Alerts", and "Ticket Claimed Percentage" in a prominent summary section, sourced exclusively from live telemetry and database queries, using standardized admin typography (14px values). These cards MUST be rendered as "Floating Product Demo Cards" with a #ffffff background, 16px border-radius, and hairline shadow (rgba(0,0,0,0.4) 0px 0px 1px) to distinguish them from the Eggshell ground.

#### Scenario: Real-time Metric Updates

- **WHEN** telemetry data or ticket status changes in the database
- **THEN** the dashboard cards MUST reflect the updated values immediately (or via polling/revalidation) without relying on hardcoded initial states, using the reduced font scale. Using Inter 500 for metric values and Inter 400 for descriptors.

### Requirement: Spectator Inflow Visualization

The dashboard SHALL display a chart representing the volume of spectators entering the venue over time or the density distribution across zones.

#### Scenario: Inflow Chart Rendering

- **WHEN** the dashboard is rendered
- **THEN** it SHALL display a bar chart showing the number of unique telemetry logs or ticket scans per hour.

### Requirement: Gate Congestion Status

The dashboard SHALL include a table listing all active venue gates with their current crowd level (Low, Moderate, High, Blocked) and estimated wait times. This table MUST adhere to the HeroUI v3 Dot Notation standards and use the "Chalk" (#e5e5e5) border color for all dividers, including a designated `isRowHeader` column.

#### Scenario: Gate Status Identification

- **WHEN** a gate reaches a "High" or "Blocked" crowd level
- **THEN** the status MUST be indicated using a pill-shaped badge (9999px radius) with specific achromatic colors defined in the system, and the corresponding row in the table MUST be highlighted with a warning indicator.

### Requirement: Event-Centric Sidebar Navigation

The dashboard SHALL provide a navigation sidebar that elevates Events as the primary spatial entity, explicitly omitting Venue management sections.

#### Scenario: Navigating the dashboard

- **WHEN** an administrator views the primary sidebar
- **THEN** they MUST see top-level links for Events and Points of Interest, but MUST NOT see a link for Venues.
