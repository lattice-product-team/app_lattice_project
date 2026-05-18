import { Callout } from 'nextra/components'

# Class Diagram

This document models the primary object-oriented domain classes governing the **Lattice** monolith. It details attributes, operations, and architectural relationships, representing the core entities processed by the system.

---

## Domain Model Class Diagram

```mermaid
classDiagram
    direction TB

    class User {
        +int id
        +string email
        +string passwordHash
        +string fullName
        +string mobilityMode
        +boolean hasTicket
        +boolean avoidStairs
        +boolean avoidCrowds
        +boolean avoidSlopes
        +boolean avoidGrandstands
        +authenticate() boolean
        +getTickets() Ticket[]
        +updateProfile(data) void
    }

    class Ticket {
        +int id
        +int userId
        +int eventId
        +string code
        +string gate
        +Point seatLocation
        +validate() boolean
        +scan(gateId) boolean
    }

    class Event {
        +int id
        +string name
        +string type
        +Point center
        +Polygon boundary
        +DateTime startDate
        +DateTime endDate
        +getActivePOIs() PointOfInterest[]
        +getNetworkTopology() RouteNetwork
    }

    class PointOfInterest {
        +int id
        +int eventId
        +string name
        +string type
        +Point location
        +int capacity
        +int currentOccupancy
        +string status
        +string crowdLevel
        +boolean isWheelchairAccessible
        +boolean hasPriorityLane
        +updateOccupancy(count) void
        +setStatus(newStatus) void
    }

    class RouteNetwork {
        +Node[] nodes
        +PathSegment[] segments
        +calculateAccessiblePath(source, target, preferences) PathSegment[]
    }

    class Node {
        +int id
        +Point location
        +string name
    }

    class PathSegment {
        +int id
        +int sourceNodeId
        +int targetNodeId
        +float distance
        +string surface
        +boolean hasStairs
        +isAccessibleFor(preferences) boolean
    }

    class TelemetryLog {
        +int id
        +int userId
        +int eventId
        +Point location
        +DateTime timestamp
        +logTelemetry(userId, eventId, location) void
    }

    User "1" --> "0..*" Ticket : owns
    User "1" --> "0..*" TelemetryLog : generates
    Event "1" --> "0..*" Ticket : "associated with"
    Event "1" --> "0..*" PointOfInterest : contains
    Event "1" --> "1" RouteNetwork : "spatial network"
    RouteNetwork "1" *-- "0..*" Node : contains
    RouteNetwork "1" *-- "0..*" PathSegment : contains
    Node "2" -- "0..*" PathSegment : connects
```

---

## Architectural Patterns and Structural Details

### 1. Unified Typings
These classes do not exist in isolation; they are tied directly to compile-time TypeScript declarations in `@app/types-schema` and database schema tables in `@app/db`. This structural alignment guarantees type safety across the entire stack.

### 2. Service Layer Decoupling
Business logic is isolated away from transport controllers (Express routers).
*   **Controller Layer**: Handles raw request validation, parses route parameters, manages session caching, and handles CORS/rate-limiting constraints.
*   **Service Layer**: Expressed as domain service classes (such as `PoiService` or `EventService`). Services are responsible for orchestration, database querying, validation, cache eviction, and dispatching events via WebSockets.

### 3. Spatial Aggregation Pattern
Geospatial entities (`Point` and `Polygon`) leverage WGS 84 geometries.
*   **Database Level**: PostGIS manages precise coordinates and spatial operations.
*   **API Level**: Coordinates are automatically serialized into GeoJSON standard structures (`Point` / `Polygon`), facilitating direct rendering on the MapLibre mobile canvas or Next.js map dashboards.

<Callout type="info">
  **Domain Decoupling**: The `RouteNetwork` class encapsulates all routing calculations (such as Dijkstra or A* pathfinding graphs), isolating the core `Event` service from the complexities of navigation logic.
</Callout>
