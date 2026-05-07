# Proposal: DataForSEO Social Proof Integration

## Problem Statement

Currently, Lattice Events and Points of Interest (POIs) only display internal operational data. To improve user engagement and trust in the mobile application, we need to provide real-world social proof such as ratings and reviews. DataForSEO provides a robust API to fetch this data from Google Business/Maps listings.

## Proposed Solution

We will implement an integration with the DataForSEO API to fetch and cache social data (average rating, review count, and snippets) for both Events and POIs. This data will be stored as optional fields in the existing metadata JSONB columns, allowing for a graceful degradation when no data is found.

## What Changes

- New backend service/utility to interface with DataForSEO API.
- Background/On-demand logic to populate social data for assets.
- API response enrichment for Events and POIs to include social metrics.
- Admin UI indicators to show if an asset has linked social data.

## Capabilities

### New Capabilities

- `social-proof-engine`: Logic for matching Lattice assets with external business listings and fetching metadata via DataForSEO.

### Modified Capabilities

- `event-registry`: Add optional social metrics to the event data model.
- `poi-registry`: Add optional social metrics to the POI data model.

## Impact

- **Backend**: New API client for DataForSEO.
- **Database**: Metadata structure updates (no schema change needed as we use JSONB).
- **Frontend (Admin)**: Visibility of social data in registry tables.
- **Frontend (Mobile)**: Future capability to render stars and reviews (out of scope for implementation, only data availability).
