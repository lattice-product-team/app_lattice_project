## Modified Requirements

### Requirement: Component Resilience and Initialization

The discovery feed interface MUST handle cases where global theme context is not yet available during the initial mounting phase without crashing.

#### Scenario: First Render Safety

- **WHEN** the `DiscoveryFeed` component renders for the first time
- **THEN** it MUST use a verified theme object (either passed via props or from a reliable local fallback) to render its loading skeleton.
- **AND** it MUST NOT throw a `TypeError` when accessing theme colors or spacing tokens.
