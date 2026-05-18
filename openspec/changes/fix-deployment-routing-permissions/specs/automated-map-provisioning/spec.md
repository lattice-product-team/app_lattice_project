## ADDED Requirements

### Requirement: Automated PBF Download and Build

The Valhalla service SHALL automatically download OSM PBF files and build routing tiles at startup if they are missing from the volume.

#### Scenario: First-time map provisioning

- **WHEN** the `tile_urls` environment variable is provided and the tile volume is empty
- **THEN** the Valhalla container MUST download the PBF file and build the tiles before becoming ready.
