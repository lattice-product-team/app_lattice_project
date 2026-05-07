# Capability: POI Registry Enhancement

## Purpose
Enhance the POI registry with human-readable location data and automated resolution capabilities.

## Requirements

### Requirement: Human-Readable Location Data
The system SHALL support storing `locationName` and `address` fields for POIs to provide clear directions beyond geographic coordinates.

#### Scenario: Displaying location details
- **WHEN** listing POIs in the admin table
- **THEN** the system MUST show the human-readable location name (e.g., "Main Stage Left") and the resolved address.

### Requirement: Automated Location Resolution
The system SHALL use reverse geocoding to automatically resolve geographic coordinates into a human-readable address during POI creation or update.

#### Scenario: Auto-geocoding on map drop
- **WHEN** an administrator places a POI marker on the map
- **THEN** the system MUST invoke the `reverseGeocode` method and populate the `address` field with the result.

### Requirement: High-Density Admin Visualization
The Admin Dashboard SHALL implement a high-density table for the POI registry, including occupancy bars and accessibility icons.

#### Scenario: Real-time monitoring in admin
- **WHEN** an administrator opens the POI Registry page
- **THEN** each row MUST show a visual occupancy progress bar (current/total capacity) and icons for wheelchair accessibility.
