## MODIFIED Requirements

### Requirement: Hairline Elevation System

The system SHALL replace standard depth elevation with a hairline shadow system that maintains a flat perceptual plane. For mobile overlays, shadows MUST be combined with solid backgrounds (0.85-0.95 opacity) to create depth without using real-time Gaussian blur.

#### Scenario: Card Elevation

- **WHEN** a UI card or sheet is displayed
- **THEN** it MUST use a subtle shadow combined with a solid-transparency background
- **AND** SHALL NOT use `expo-blur`.

## ADDED Requirements

### Requirement: Modern Solid Color Palette

The mobile system SHALL extend the color system with "Modern Solid" tokens that provide consistent transparency without the need for computational blur.

#### Scenario: Token Definition

- **WHEN** rendering background overlays
- **THEN** the system MUST use the following tokens:
  - `GlassBackground`: rgba(255, 255, 255, 0.9) [Light] / rgba(28, 28, 30, 0.9) [Dark]
  - `GlassBorder`: rgba(0, 0, 0, 0.08) [Light] / rgba(255, 255, 255, 0.12) [Dark]
