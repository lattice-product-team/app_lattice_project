## ADDED Requirements

### Requirement: Centralized Architecture Overview
The system SHALL maintain a `system-overview.md` in `docs/architecture/` that describes the high-level monorepo architecture and service boundaries.

#### Scenario: Onboarding new developer
- **WHEN** a new developer reads the architecture overview
- **THEN** they understand the relationship between apps (admin, mobile) and services.

### Requirement: Architectural Decision Records (ADR)
The system SHALL use a standardized ADR template for all significant architectural changes, stored in `docs/architecture/adr/`.

#### Scenario: Reviewing a past decision
- **WHEN** a developer searches for the rationale behind a tech choice
- **THEN** they find an ADR document with status, context, and consequences.
