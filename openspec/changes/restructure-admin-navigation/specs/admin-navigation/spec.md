## ADDED Requirements

### Requirement: Minimalist Navigation

The administrative interface SHALL use a minimalist navbar containing exactly three primary items: MAP, EVENTS, and POIS.

- The "Dash" and "Radar" items MUST be removed.
- The branding logo MUST be removed from the primary navigation bar.

#### Scenario: Verifying navbar items

- **WHEN** any admin page is loaded
- **THEN** the FloatingNav component SHALL display only the "MAP", "EVENTS", and "POIS" links.
