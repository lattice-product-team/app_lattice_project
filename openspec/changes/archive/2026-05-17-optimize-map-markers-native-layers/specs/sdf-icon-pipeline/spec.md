## ADDED Requirements

### Requirement: Signed Distance Field (SDF) Icon Support

The system SHALL register monochrome icon assets with the `sdf: true` flag in the `MapImageManager`.

#### Scenario: Real-time icon tinting

- **WHEN** an SDF icon is used in a `SymbolLayer`
- **THEN** the system SHALL allow changing the icon's color dynamically using the `iconColor` style property without re-fetching assets

### Requirement: Category-to-SDF Mapping

The system SHALL map GeoJSON category properties to specific SDF icon names registered in the map's image registry.

#### Scenario: Correct icon display

- **WHEN** a feature has `category: 'dining'`
- **THEN** the map SHALL display the corresponding 'dining-sdf' icon as defined in the mapping logic
