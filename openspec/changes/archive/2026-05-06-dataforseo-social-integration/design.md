## Context

Lattice needs to fetch external social proof (ratings/reviews) from Google Maps via the DataForSEO API. We have existing JSONB `metadata` columns in both `events` and `points_of_interest` tables that can be utilized for storage without schema migrations.

## Goals / Non-Goals

**Goals:**

- Implement a reusable `DataForSEOClient` for authenticated API requests.
- Create an automated matching service using name and geospatial proximity.
- Store social metrics (rating, review count, snippets) in the existing metadata JSONB.
- Provide a manual override mechanism in the Admin UI for specific Google Maps linkage.

**Non-Goals:**

- Real-time review streaming (data will be cached/synced periodically).
- Rendering reviews in the Admin UI (only metrics for now).
- Frontend design for the mobile application.

## Decisions

### 1. Dedicated Social Orchestrator Service

We will create a `SocialService` within the `server/geo` package.

- **Rationale**: Keeps the business logic for external API matching separate from the core database operations.
- **Alternatives**: Putting logic in controllers (too messy) or a separate microservice (overkill for now).

### 2. JSONB Metadata Structure

Social data will be nested under a `social` key in the metadata column.

- **Structure**:
  ```json
  {
    "social": {
      "rating": 4.5,
      "reviews_count": 120,
      "source_url": "https://maps.google.com/...",
      "last_updated": "2026-05-06T...",
      "snippets": ["Great venue!", "Easy access"]
    }
  }
  ```
- **Rationale**: Zero-cost schema evolution.
- **Alternatives**: Dedicated `reviews` table (more complex, not needed yet).

### 3. Background Sync Policy

Data will be fetched on-demand if missing, and then synced in the background every 7 days.

- **Rationale**: DataForSEO calls cost money/credits; ratings don't change daily.
- **Alternatives**: Sync on every request (too expensive) or only manual sync (stale data).

## Risks / Trade-offs

- **[Risk] Name Mismatches** → **Mitigation**: Use name + lat/lng proximity (50m) and provide a manual "Link to Google Maps" field in the admin panel.
- **[Risk] API Rate Limits/Costs** → **Mitigation**: Aggressive caching (7 days) and state-based syncing (only for active events).
- **[Trade-off] Metadata Bloat** → We will only store the top 3 review snippets to keep the JSONB column size manageable.
