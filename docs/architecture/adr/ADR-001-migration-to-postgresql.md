# ADR-001: Migration to PostgreSQL and Drizzle ORM

*   **Status**: Accepted
*   **Deciders**: Engineering Team
*   **Date**: 2024-05-12

## Context and Problem Statement

The project initially considered a Cloud-managed NoSQL approach (such as Firestore) for data storage. However, as the requirements for complex geospatial queries (PostGIS), relational integrity (Events linked to POIs and Users), and robust migrations grew, the limitations of NoSQL became apparent.

## Decision Drivers

*   **Geospatial Performance**: Need for advanced proximity and boundary queries.
*   **Relational Integrity**: Ensuring tickets, events, and users are correctly linked.
*   **Developer Experience**: Strong type safety and easy migration management.

## Considered Options

1.  **Cloud NoSQL (Firestore)**: Schema-less, real-time, but limited query capabilities for complex relations.
2.  **PostgreSQL with Drizzle ORM**: Relational, industry-standard geospatial support (PostGIS), and TypeScript-first ORM.

## Decision Outcome

Chosen option: **PostgreSQL with Drizzle ORM**, because it provides the best balance of relational power and modern developer experience with TypeScript.

### Positive Consequences

*   Full support for PostGIS for advanced mapping features.
*   Type safety across the entire stack via `@app/db`.
*   Clear migration path for schema changes.

### Negative Consequences

*   Increased infrastructure complexity (requires a running Postgres instance).
*   Lose out on Firestore's native real-time listeners (must be implemented via WebSockets or polling).

## Pros and Cons of the Options

### Cloud NoSQL (Firestore)

*   **Good**: Built-in real-time support and zero infrastructure management.
*   **Bad**: Limited geospatial queries and difficult to manage complex relations without data duplication.

### PostgreSQL with Drizzle ORM

*   **Good**: Powerful queries, strict schema, and PostGIS integration.
*   **Bad**: Requires manual management of database connections and migrations.
