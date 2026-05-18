## ADDED Requirements

### Requirement: Discovery Feed API

The system SHALL provide a unified `/v1/discovery` endpoint that returns a collection of sections for the mobile explore page.

#### Scenario: Fetching the discovery feed

- **WHEN** a GET request is made to `/v1/discovery`
- **THEN** the system SHALL return a JSON object containing an array of `sections`, where each section includes a `type`, `title`, and a list of `items` (Events or POIs).

### Requirement: Server-Defined Ranking

The discovery orchestrator SHALL determine the content of "Featured" and "Trending" sections based on server-side criteria.

#### Scenario: Popularity ranking

- **WHEN** the "Trending" section is requested
- **THEN** the system SHALL include POIs with the highest interaction scores or "Trending" flags.
