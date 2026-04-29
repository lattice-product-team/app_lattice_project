## Context

The current seeding strategy is split into separate scripts (`seed-montmelo.ts`, `seed-pedralbes.ts`) which causes data fragmentation. With the introduction of multi-event support, we need a unified seeding process that populates a coherent dataset of events, POIs, and routing nodes, all correctly linked by `event_id`.

## Goals / Non-Goals

**Goals:**
- Implement a single, idempotent master seed script (`seed-master.ts`).
- Ensure all POIs, Nodes, and Segments are strictly associated with a parent `Event`.
- Provide diverse test data (Music, Sports, Tech) located in the Barcelona area to test the "Near You" discovery logic.
- Include accessibility edge cases (stairs/ramps) for routing verification.

**Non-Goals:**
- We are NOT migrating existing user-generated data; this is a development-only seed.
- We are NOT implementing a full administrative dashboard for event creation in this phase.

## Decisions

### 1. Unified Entry Point
- **Decision**: Create `packages/db/src/seed-master.ts` as the primary entry point and update the root `package.json` to point `db:seed` to it.
- **Rationale**: Simplifies onboarding and ensures every developer has the same baseline state.

### 2. Cascading Deletion Strategy
- **Decision**: Use `TRUNCATE ... CASCADE` on the `events` table before seeding.
- **Rationale**: Ensures a truly clean slate. Since POIs, Nodes, and Segments now have foreign keys to `events`, the cascade will handle the full cleanup safely.

### 3. Geographical Clustering (Barcelona Focus)
- **Decision**: All three events will be located within 30km of Barcelona center.
- **Rationale**: Allows testing of the "Discovery" carousels and "Remote Mode" triggers within a realistic geographical radius.

### 4. Deterministic ID Ranges
- **Decision**: Assign hardcoded ID ranges to nodes for each event (e.g., 100-199 for Nitro GP, 200-299 for Neon Nights).
- **Rationale**: Prevents accidental collisions and makes debugging the routing engine much easier.

## Risks / Trade-offs

- **[Risk]** Massive deletion of data could impact developers with manual telemetry data → **[Mitigation]** Provide a warning or use a separate script if "Safe Seeding" is required, but for dev, a full reset is standard.
- **[Trade-off]** Hardcoded coordinates are easier to maintain than random generation but lack the "stress test" of a worldwide dataset.
