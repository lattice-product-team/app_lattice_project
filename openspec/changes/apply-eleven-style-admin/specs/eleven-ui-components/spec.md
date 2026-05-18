## MODIFIED Requirements

### Requirement: Floating Product Demo Cards

The system SHALL implement high-fidelity interactive cards with a 16px border-radius and hairline shadow. For Admin Web, these cards MUST use a pure white (#ffffff) background in light mode to provide maximum contrast against the Eggshell ground.

#### Scenario: Card Rendering

- **WHEN** a product demo card is embedded in a section
- **THEN** it MUST use a background of #ffffff, a radius of 16px, and a shadow defined as `rgba(0, 0, 0, 0.4) 0px 0px 1px 0px`.
