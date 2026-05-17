# Database Schema

Lattice uses a relational PostgreSQL database with **PostGIS** for high-performance geospatial operations. The schema is managed via **Drizzle ORM**.

To make the database architecture easier to digest and read, we have divided the relational layout into two separate focused schemas: the **Core operations & Geospatial Network** and **User Identity & Telemetry Support**.

---

## 1. Core Operations & Geospatial Network Schema

This schema models the core physical infrastructure of an event. It defines the event boundaries, the localized Points of Interest (POIs) like food and restrooms, and the spatial routing node network used to calculate optimal pedestrian navigation routes.

```mermaid
erDiagram
    EVENT ||--o{ POINT_OF_INTEREST : contains
    EVENT ||--o{ NODE : "spatial network"
    EVENT ||--o{ PATH_SEGMENT : "spatial network"
    NODE ||--o{ PATH_SEGMENT : "source/target"

    EVENT {
        int id PK
        string name
        geometry location
        polygon boundary
        timestamp start_date
        timestamp end_date
    }

    POINT_OF_INTEREST {
        int id PK
        int event_id FK
        string name
        string type
        geometry location
        int current_occupancy
        string status
    }

    NODE {
        int id PK
        int event_id FK
        string name
        geometry location
        string type
    }

    PATH_SEGMENT {
        int id PK
        int event_id FK
        int source_node_id FK
        int target_node_id FK
        float distance
        string surface
        boolean has_stairs
    }
```

---

## 2. User Identity, Access, & Telemetry Support Schema
 
This schema governs authentication, passkey credentials, group location sharing, active ticket registers, and historical telemetry logging used by the crowd radar to analyze real-time density.
 
```mermaid
erDiagram
    USER ||--o{ TICKET : owns
    USER ||--o{ PASSKEY_CREDENTIAL : has
    USER ||--o{ GROUP : creates
    USER ||--o{ GROUP_MEMBER : joins
    USER ||--o{ SAVED_LOCATION : saves
    USER ||--o{ TELEMETRY_LOG : generates
    GROUP ||--o{ GROUP_MEMBER : has
 
    USER {
        int id PK
        string email UK
        string password_hash
        string full_name
        string mobility_mode
        boolean has_ticket
    }
 
    TICKET {
        int id PK
        int user_id FK
        int event_id FK
        string code UK
        string gate
        geometry seat_location
    }
 
    PASSKEY_CREDENTIAL {
        string id PK
        int user_id FK
        string public_key
        int counter
        string device_type
        boolean backed_up
        timestamp created_at
    }
 
    GROUP {
        int id PK
        int created_by FK
        string name
        string invite_code
        geometry meeting_point
        timestamp created_at
    }
 
    GROUP_MEMBER {
        int user_id PK_FK
        int group_id PK_FK
        timestamp joined_at
        geometry last_location
        timestamp last_updated
    }
 
    SAVED_LOCATION {
        int id PK
        int user_id FK
        string label
        geometry location
        timestamp created_at
    }
 
    TELEMETRY_LOG {
        int id PK
        int user_id FK
        int event_id FK
        geometry location
        timestamp timestamp
    }
 
    OFFLINE_PACKAGE {
        int id PK
        string region_name
        string file_url
        string version
        float size_mb
    }
```


---

## Key Architectural Decisions

1.  **Geospatial Native**: We use the `geometry` type for all coordinates, allowing us to perform complex spatial joins and proximity searches directly in SQL via PostGIS.
2.  **Routing Nodes & Path Segments**: All walking networks are parsed as segments connected by coordinates nodes, enabling the client to execute Dijkstra-like routing calculations constrained by stair and accessibility flags.
3.  **Audit & Telemetry**: The `telemetry_logs` table stores high-frequency location ping data from mobile clients. This isolates active database transactions from analytics processing, ensuring the crowd density radar performs flawlessly.
