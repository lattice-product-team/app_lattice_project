# map-marker-system Specification

## Purpose

Define a robust, unified, and performant system for rendering custom map markers that ensures 100% visibility on all platforms.

## ADDED Requirements

### Requirement: Marker Layout Shield
The system SHALL wrap every custom map marker in a dedicated layout container with fixed, non-zero pixel dimensions (e.g., 120x80) to ensure the native MapLibre engine correctly allocates rendering resources on iOS.

#### Scenario: iOS Rendering
- **WHEN** a marker is mounted on an iOS device
- **THEN** it SHALL be immediately visible at its specified coordinates
- **AND** it MUST NOT exhibit size calculation delays or "flash" on mount

### Requirement: Unified Iconography Registry
The system SHALL use a centralized utility (`poiUtils.ts`) to manage all icon mappings, ensuring that `lucide-react-native` is the exclusive source for vector iconography.

#### Scenario: Icon Resolution
- **WHEN** a component requests an icon for a "museum" category
- **THEN** the system SHALL return the corresponding Lucide component with a stroke weight of 2.5
