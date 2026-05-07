# Capability: Social Proof Engine

## Purpose

Provide the infrastructure and logic for matching assets with external social platforms and fetching/caching social metrics.

## Requirements

### Requirement: Asset Matching Logic

The system SHALL implement a matching algorithm to link Lattice assets (Events/POIs) with DataForSEO business listings using name, latitude, and longitude.

#### Scenario: High confidence match

- **WHEN** an asset has an exact name match and is within 50 meters of a DataForSEO result
- **THEN** the system SHALL automatically link the asset to the external listing

#### Scenario: Ambiguous match

- **WHEN** multiple listings are found or distance is greater than 50 meters
- **THEN** the system SHALL mark the asset for manual verification in the admin dashboard

### Requirement: DataForSEO API Integration

The system SHALL interface with the DataForSEO "Google Maps Business Reviews" and "Google Maps Business Search" endpoints.

#### Scenario: Successful data retrieval

- **WHEN** a valid business identifier is provided
- **THEN** the system SHALL fetch average_rating, reviews_count, and the top 3 review snippets

### Requirement: Social Data Caching

The system SHALL store fetched social data in the asset's metadata JSONB column with a timestamp.

#### Scenario: Cache freshness

- **WHEN** social data is requested for an asset
- **THEN** the system SHALL return the cached data if it is less than 7 days old, otherwise trigger a background refresh
