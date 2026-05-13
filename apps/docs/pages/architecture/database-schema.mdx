# Database Schema

Lattice uses a relational PostgreSQL database with **PostGIS** for high-performance geospatial operations. The schema is managed via **Drizzle ORM**.

## Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ TICKET : owns
    USER ||--o{ PASSKEY_CREDENTIAL : has
    USER ||--o{ GROUP : creates
    USER ||--o{ GROUP_MEMBER : joins
    USER ||--o{ SAVED_LOCATION : saves
    USER ||--o{ TELEMETRY_LOG : generates

    EVENT ||--o{ TICKET : "is for"
    EVENT ||--o{ POINT_OF_INTEREST : contains
    EVENT ||--o{ NODE : "spatial network"
    EVENT ||--o{ PATH_SEGMENT : "spatial network"

    NODE ||--o{ PATH_SEGMENT : "source/target"

    GROUP ||--o{ GROUP_MEMBER : has

    USERS {
        int id PK
        string email UK
        string password_hash
        string full_name
        string mobility_mode
        boolean has_ticket
    }

    EVENTS {
        int id PK
        string name
        geometry location
        polygon boundary
        timestamp start_date
        timestamp end_date
    }

    POINTS_OF_INTEREST {
        int id PK
        int event_id FK
        string name
        string type
        geometry location
        int current_occupancy
        string status
    }

    TICKETS {
        int id PK
        int user_id FK
        int event_id FK
        string code UK
        string gate
        geometry seat_location
    }

    PATH_SEGMENTS {
        int id PK
        int event_id FK
        int source_node_id FK
        int target_node_id FK
        float distance
        string surface
        boolean has_stairs
    }
```

## Key Architectural Decisions

1.  **Geospatial Native**: We use the `geometry` type for all coordinates, allowing us to perform complex spatial joins and proximity searches directly in SQL.
2.  **Modular Monolith Integration**: All domain tables share a unified schema, ensuring cross-domain relational integrity (e.g., ensuring a ticket can only be created for an existing event).
3.  **Audit & Telemetry**: The `telemetry_logs` table allows for historical crowd density analysis without impacting the performance of the core operational tables.
