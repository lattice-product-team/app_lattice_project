# Capability: Event Registry

## Purpose

Manage and display the central registry of events, including their status and external social proof.

## Requirements

### Requirement: Social Metadata Persistence

The event data model SHALL include optional fields within its metadata for external social proof.

#### Scenario: Event with social data

- **WHEN** an event is fetched via API
- **THEN** it SHALL include a `social_proof` object in its metadata with `rating`, `reviews_count`, and `source` ("google_maps")

### Requirement: Social Data Display in Admin

The event registry table in the admin dashboard SHALL show the average rating as a star indicator when available.

#### Scenario: Visual indicator

- **WHEN** an event has linked social data
- **THEN** the registry table SHALL render a yellow star icon with the numeric rating next to the event name
