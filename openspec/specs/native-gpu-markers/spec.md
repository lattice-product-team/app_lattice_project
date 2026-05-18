# native-gpu-markers Specification

## Purpose

TBD - created by archiving change optimize-map-markers-native-layers. Update Purpose after archive.

## Requirements

### Requirement: GPU-Accelerated Feature Rendering

The system SHALL render POIs and Events using native MapLibre `SymbolLayer` and `CircleLayer` components to ensure 60 FPS performance during map interactions.

#### Scenario: Smooth high-density rendering

- **WHEN** the map contains more than 100 markers and the user pans or zooms
- **THEN** the markers SHALL remain perfectly synchronized with the map tiles without any visual lag or stuttering

### Requirement: Native Expression-Based Styling

The system SHALL use MapLibre data-driven styling (DDS) expressions to determine marker appearance based on feature properties.

#### Scenario: Dynamic color assignment

- **WHEN** a feature has a `color_hex` property in its GeoJSON
- **THEN** the `CircleLayer` or `SymbolLayer` SHALL apply that color directly on the GPU using an expression like `['get', 'color_hex']`
