# documentation-asset-management Specification

## Purpose

TBD - created by archiving change refine-docs-and-branding. Update Purpose after archive.

## Requirements

### Requirement: Unified Asset Distribution

The system SHALL maintain a `public/assets` directory within the documentation application as the single source of truth for all documentation-related media.

#### Scenario: Asset Discovery

- **WHEN** adding a new image to a guide
- **THEN** it MUST be placed in `apps/docs/public/assets` and referenced via a root-relative URL.
