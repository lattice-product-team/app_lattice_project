## ADDED Requirements

### Requirement: Pill-Shaped Action Buttons
The system SHALL standardize all primary and secondary action buttons as "Pill" shapes with a fixed border-radius of 9999px.
- **Primary Pill**: Background #000000, Text #fdfcfc.
- **Ghost Pill**: Background #ffffff, Text #000000, Border 1px solid #e5e5e5.

#### Scenario: Button Shape Uniformity
- **WHEN** a CTA button is rendered in any layout
- **THEN** it MUST have a border-radius of 9999px and use the achromatic palette.

### Requirement: Editorial Text Inputs
The system SHALL implement text inputs in an editorial style, using a sharp 0px border-radius to distinguish them from interactive pill elements.
- **Contained Input**: Background #ffffff, Border 1px solid #e5e5e5, Radius 0px.
- **Transparent Input**: Background transparent, Border-bottom 1px solid #000000, Radius 0px.

#### Scenario: Input vs Button Contrast
- **WHEN** an input field and a button are placed together
- **THEN** the input MUST use 0px radius and the button MUST use 9999px radius to create a clear visual distinction between data entry and action.

### Requirement: Floating Product Demo Cards
The system SHALL implement high-fidelity interactive cards with a 16px border-radius and hairline shadow.

#### Scenario: Card Rendering
- **WHEN** a product demo card is embedded in a section
- **THEN** it MUST use a background of #ffffff and a radius of 16px to "pop" off the Eggshell ground.
