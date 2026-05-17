# Class Diagram

This diagram represents the core object-oriented class structure of the **Lattice** domain model, showing the attributes, operations, and relationships between the primary entities.

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
        +Point location
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
        +int currentOccupancy
        +string status
        +updateOccupancy(count) void
        +setStatus(newStatus) void
    }

    class RouteNetwork {
        +Node[] nodes
        +PathSegment[] segments
        +calculateAccessiblePath(source, target, mobilityMode) PathSegment[]
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
        +isAccessibleFor(mobilityMode) boolean
    }

    class TelemetryLog {
        +int id
        +int userId
        +Point location
        +DateTime timestamp
        +logTelemetry(userId, location) void
    }

    User "1" --> "0..*" Ticket : owns
    User "1" --> "0..*" TelemetryLog : generates
    Event "1" --> "0..*" Ticket : "is for"
    Event "1" --> "0..*" PointOfInterest : contains
    Event "1" --> "1" RouteNetwork : "spatial network"
    RouteNetwork "1" *-- "0..*" Node : contains
    RouteNetwork "1" *-- "0..*" PathSegment : contains
    Node "2" -- "0..*" PathSegment : connects
```

## Architectural Insights

1.  **Strict Type Safety**: These classes map directly to the TypeScript schemas defined in `@app/types-schema` and Drizzle ORM models in `@app/db`.
2.  **Geospatial Integration**: Geometric attributes like `Point` and `Polygon` leverage PostGIS database extensions, translated into standard GeoJSON structures for consumption by the MapLibre mobile rendering engine.
3.  **Domain Decoupling**: Services interact strictly via domain boundaries (e.g., the `RouteNetwork` encapsulates the complexity of the A* / Dijkstra pathfinding routing away from the core `Event` service).

