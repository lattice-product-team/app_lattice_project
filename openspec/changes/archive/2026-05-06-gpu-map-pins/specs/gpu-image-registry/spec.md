## ADDED Requirements

### Requirement: GPU Texture Registration

The system SHALL provide a mechanism to download and register remote images as textures in the map's internal image registry.

#### Scenario: Registering Event Poster

- **WHEN** an event has a valid image URL
- **THEN** the system SHALL fetch the image and register it with a unique ID (e.g., `event-img-<id>`) available to `SymbolLayer`.

### Requirement: Placeholder Fallback

The system SHALL display a default placeholder icon if the remote image is still loading or fails to download.

#### Scenario: Image Fetch Failure

- **WHEN** a remote image fails to load for an event
- **THEN** the `SymbolLayer SHALL fall back to a predefined `placeholder-event` icon registered in the style.
