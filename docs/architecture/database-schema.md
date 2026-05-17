import { useState, useRef, useEffect } from 'react'

export const ZoomableMermaid = ({ children }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.85);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = 0.08;
    const direction = e.deltaY < 0 ? 1 : -1;
    const newScale = Math.min(Math.max(scale + direction * zoomFactor, 0.2), 4);
    setScale(newScale);
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const preventScroll = (e) => {
      e.preventDefault();
    };
    el.addEventListener('wheel', preventScroll, { passive: false });
    return () => el.removeEventListener('wheel', preventScroll);
  }, []);

  return (
    <div 
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        position: 'relative',
        width: '100%',
        height: isFullscreen ? '80vh' : '450px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        background: 'rgba(10, 10, 11, 0.65)',
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: 'height 0.3s ease, border-color 0.3s',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '24px',
      }}
    >
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        zIndex: 50,
        display: 'flex',
        gap: '6px',
        background: 'rgba(24, 24, 27, 0.85)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '4px',
        borderRadius: '8px',
        alignItems: 'center',
        userSelect: 'none',
      }}>
        <button 
          type="button"
          onClick={() => setScale(prev => Math.min(prev + 0.15, 4))}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '4px 10px',
            borderRadius: '6px',
            transition: 'background 0.2s',
          }}
        >+</button>
        <button 
          type="button"
          onClick={() => setScale(prev => Math.max(prev - 0.15, 0.2))}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '4px 12px',
            borderRadius: '6px',
            transition: 'background 0.2s',
          }}
        >-</button>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', margin: '0 4px', fontFamily: 'monospace' }}>
          {Math.round(scale * 100)}%
        </span>
        <button 
          type="button"
          onClick={() => { setScale(0.85); setPosition({ x: 0, y: 0 }); }}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '11px',
            fontWeight: '600',
            textTransform: 'uppercase',
            cursor: 'pointer',
            padding: '6px 10px',
            borderRadius: '6px',
            transition: 'background 0.2s',
          }}
        >Reset</button>
        <button 
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '11px',
            fontWeight: '600',
            textTransform: 'uppercase',
            cursor: 'pointer',
            padding: '6px 10px',
            borderRadius: '6px',
            transition: 'background 0.2s',
          }}
        >
          {isFullscreen ? 'Exit' : 'Full Screen'}
        </button>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        zIndex: 40,
        background: 'rgba(24, 24, 27, 0.65)',
        backdropFilter: 'blur(6px)',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '11px',
        color: 'rgba(255,255,255,0.6)',
        pointerEvents: 'none',
      }}>
        💡 Scroll over diagram to Zoom | Left-click + Drag to Pan
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        transformOrigin: 'center center',
        transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}>
        <div style={{ width: '100%', padding: '40px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

# Database Schema

Lattice uses a relational PostgreSQL database with **PostGIS** for high-performance geospatial operations. The schema is managed via **Drizzle ORM**.

To make the database architecture easier to digest and read, we have divided the relational layout into two separate focused schemas: the **Core operations & Geospatial Network** and **User Identity & Telemetry Support**.

---

## 1. Core Operations & Geospatial Network Schema

This schema models the core physical infrastructure of an event. It defines the event boundaries, the localized Points of Interest (POIs) like food and restrooms, and the spatial routing node network used to calculate optimal pedestrian navigation routes.

<ZoomableMermaid>
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
</ZoomableMermaid>

---

## 2. User Identity, Access, & Telemetry Support Schema

This schema governs authentication, passkey credentials, group location sharing, active ticket registers, and historical telemetry logging used by the crowd radar to analyze real-time density.

<ZoomableMermaid>
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
        int id PK
        int user_id FK
        string credential_id
        string public_key
        int counter
    }

    GROUP {
        int id PK
        int creator_id FK
        string name
        string invite_code
    }

    GROUP_MEMBER {
        int id PK
        int group_id FK
        int user_id FK
        timestamp joined_at
    }

    SAVED_LOCATION {
        int id PK
        int user_id FK
        string name
        geometry location
    }

    TELEMETRY_LOG {
        int id PK
        int user_id FK
        int event_id FK
        geometry location
        float speed
        float bearing
        timestamp captured_at
    }
```
</ZoomableMermaid>

---

## Key Architectural Decisions

1.  **Geospatial Native**: We use the `geometry` type for all coordinates, allowing us to perform complex spatial joins and proximity searches directly in SQL via PostGIS.
2.  **Routing Nodes & Path Segments**: All walking networks are parsed as segments connected by coordinates nodes, enabling the client to execute Dijkstra-like routing calculations constrained by stair and accessibility flags.
3.  **Audit & Telemetry**: The `telemetry_logs` table stores high-frequency location ping data from mobile clients. This isolates active database transactions from analytics processing, ensuring the crowd density radar performs flawlessly.
