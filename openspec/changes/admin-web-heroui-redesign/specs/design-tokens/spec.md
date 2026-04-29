## MODIFIED Requirements

### Requirement: Refined Brand Palette (Solar Gold)
The system SHALL define the "Solar Gold" palette as the primary brand identity, consisting of Primary (#E2B042), Secondary (#C59837), Accent (#F4C978), and Deep (#A67C27) tokens. For compatibility with modern CSS-first frameworks, the system SHALL also provide OKLCH mappings for these colors.

#### Scenario: Brand Color Availability
- **WHEN** the `@app/theme` package is inspected
- **THEN** it MUST contain the hex values AND OKLCH mappings for the refined Solar Gold palette.
