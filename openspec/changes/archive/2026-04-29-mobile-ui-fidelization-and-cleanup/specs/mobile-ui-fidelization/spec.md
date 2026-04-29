## ADDED Requirements

### Requirement: Apple-Style Premium Search Bar
The mobile application SHALL use the `FloatingSearchBar` as the primary search interaction element. It MUST feature a 24pt border radius, a BlurView background with appropriate tinting for dark/light modes, and a height of 54pt.

#### Scenario: User opens search
- **WHEN** the map screen is loaded
- **THEN** a floating, translucent search bar is visible at the top of the bottom sheet

### Requirement: Native POI Suppression
The map engine SHALL hide all native Point of Interest (POI) layers from the base style to ensure only Lattice-curated data is displayed. This includes transit, education, medical, and administrative labels.

#### Scenario: Map loads in busy urban area
- **WHEN** the map style finishes loading
- **THEN** no native icons for bus stops, schools, or hospitals are visible on the map

### Requirement: Unified Icon Family Handling
The system SHALL support both Feather and MaterialCommunityIcons in its category metadata. UI components MUST correctly render the appropriate icon family based on the metadata configuration.

#### Scenario: Rendering a category chip
- **WHEN** a category chip for 'Música' (Material) is rendered
- **THEN** it correctly displays the 'music-note' icon without console warnings
