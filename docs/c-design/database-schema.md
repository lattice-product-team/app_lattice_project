# Esquema de la Base de Dades: Lattice

> **Projecte:** Accessibilitat + Temps Real
> **Context:** Gestió de rutes, accessibilitat i grups per a esdeveniments en circuits.

## 1. Diagrama Visual (ERD)

Aquest diagrama representa les principals entitats i relacions.

```mermaid
erDiagram
    %% RELACIONS
    USERS ||--o{ TICKETS : posseeix
    USERS ||--o{ GROUPS : crea_admin
    USERS ||--o{ GROUP_MEMBERS : "és membre de"
    GROUPS ||--o{ GROUP_MEMBERS : conté
    USERS ||--o{ SAVED_LOCATIONS : guarda

    %% ENTITATS
    USERS {
        int id PK
        string email
        string password_hash
        string full_name
        enum mobility_mode "standard, wheelchair, reduced_mobility, visual_impairment, family_stroller"
        boolean avoid_stairs
        boolean avoid_crowds
        boolean avoid_slopes
    }

    TICKETS {
        int id PK
        int user_id FK
        string code
        string gate
        string zone_name
        string seat_row
        string seat_number
        geometry seat_location
    }

    POINTS_OF_INTEREST {
        int id PK
        string name
        string description
        enum type "restaurant, wc, grandstand, gate, medical, shop, parking, meetup_point"
        geometry location
        enum crowd_level "low, moderate, high, blocked"
        boolean is_wheelchair_accessible
    }

    PATH_SEGMENTS {
        int id PK
        geometry start_node
        geometry end_node
        enum surface "asphalt, grass, gravel, stairs, ramp"
        float slope_percentage
        boolean has_stairs
        enum crowd_level
    }

    GROUPS {
        int id PK
        string name
        string invite_code
        int created_by FK
        geometry meeting_point
    }

    GROUP_MEMBERS {
        int user_id PK, FK
        int group_id PK, FK
        timestamp joined_at
        geometry last_location
        timestamp last_updated
    }

    SAVED_LOCATIONS {
        int id PK
        int user_id FK
        string label
        geometry location
    }

    OFFLINE_PACKAGES {
        int id PK
        string region_name
        string file_url
        string version
        float size_mb
    }
```
