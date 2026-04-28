## ADDED Requirements

### Requirement: POI Data Normalization
The system SHALL use a client-side adapter to transform raw backend POI data into a standardized `UIPOI` model.

#### Scenario: Normalizing mixed property names
- **WHEN** raw data has `label` instead of `name`
- **THEN** the adapter SHALL map it to a consistent `displayName` field in the `UIPOI` model

### Requirement: Type-Safe UI Consumption
UI components SHALL only consume normalized data models from the adapter layer.

#### Scenario: Rendering a POI card
- **WHEN** a component renders a POI
- **THEN** it SHALL use the properties guaranteed by the `UIPOI` type (e.g., `displayName`, `mainColor`)
