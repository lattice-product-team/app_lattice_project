import { Callout } from 'nextra/components'

# Web Control Center

The **Lattice Command Center** is a state-of-the-art web administration portal designed for event organizers, municipal operators, and safety coordinators. It provides real-time oversight of Barcelona's event ecosystems, combining rich telemetry dashboards with precise geospatial drawing tools.

---

## 1. Portal Access and Authentication

To ensure the security of event management and crowd telemetry tools, access to the Command Center requires multi-layered authentication.

<div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
  <div style={{ textAlign: 'center' }}>
    <h4>Secure Login Portal</h4>
    <img src="/assets/screenshots/admin/login.png" alt="Admin Portal Login" width="550" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} />
  </div>
</div>

### System Specifications
*   **Security Architecture**: Protected by an HTTP-only JWT token authentication layer.
*   **Role-Based Access Control (RBAC)**: Supports roles for *System Administrators* (full system CRUD), *Event Coordinators* (event and POI editing within assigned geofences), and *Safety Marshals* (view-only telemetry access).

---

## 2. Global Map Command Center

The core workspace is the **Map Command Center**, combining real-time crowd telemetry with interactive POI and event boundary overlays.

<div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
  <div style={{ textAlign: 'center' }}>
    <h4>Global Map Workspace</h4>
    <img src="/assets/screenshots/admin/map.png" alt="Global Map Command Center" width="550" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} />
  </div>
</div>

### System Specifications
*   **Interactive GIS Canvas**: Built on MapLibre GL JS, supporting high-performance vector overlays, geofenced areas, and path network layers.
*   **Live User Telemetry**: Visualizes anonymous, real-time location pings from the mobile app as interactive coordinates on the map.

---

## 3. Operations Dashboards

For structured data management, the portal includes dedicated dashboards for events and points of interest.

<div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', margin: '2rem 0' }}>
  <div style={{ textAlign: 'center' }}>
    <h4>Event Registry Grid</h4>
    <img src="/assets/screenshots/admin/event-dashboard.png" alt="Event Registry" width="380" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
  <div style={{ textAlign: 'center' }}>
    <h4>POI Registry Grid</h4>
    <img src="/assets/screenshots/admin/poi-dashboard.png" alt="POI Registry" width="380" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
</div>

### System Specifications
*   **Data Grids**: High-speed, paginated tables with multi-column filtering.
*   **Real-Time Sync**: Changes to status, schedules, or descriptions sync instantly to the mobile app without requiring manual refreshes.

---

## 4. Contextual Inspectors

Clicking on any map boundary or icon opens a detailed side panel, providing instant access to operational status and metrics.

<div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', margin: '2rem 0' }}>
  <div style={{ textAlign: 'center' }}>
    <h4>Event boundary inspector</h4>
    <img src="/assets/screenshots/admin/map-event.png" alt="Event Boundary Inspector" width="380" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
  <div style={{ textAlign: 'center' }}>
    <h4>POI Drawer inspector</h4>
    <img src="/assets/screenshots/admin/map-poi.png" alt="POI Drawer Inspector" width="380" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
</div>

### System Specifications
*   **Live Metrics**: Displays active attendee counts, peak occupancy hours, and dynamic route status.
*   **Status Management**: Allows operators to quickly toggle POI states (`Operational`, `Maintenance`, `Closed`), propagating the updates to the mobile app within 2 seconds.

---

## 5. Map Layers and Crowd Telemetry

The Command Center provides advanced controls to filter map layers and monitor crowd density in high-traffic zones.

<div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', margin: '2rem 0' }}>
  <div style={{ textAlign: 'center' }}>
    <h4>Live Radar & Heatmap</h4>
    <img src="/assets/screenshots/admin/map-event-radar.png" alt="Crowd Telemetry Radar" width="380" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
  <div style={{ textAlign: 'center' }}>
    <h4>Layer Filter Controls</h4>
    <img src="/assets/screenshots/admin/map-menu.png" alt="Layer Filter Controls" width="380" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
</div>

### System Specifications
*   **Layer Filtering**: Toggle topographic views, POI categories, and pedestrian networks to keep the view clean and focused.
*   **Crowd Density Heatmaps**: Aggregates anonymous mobile coordinate pings, mapping them to dynamic heatmaps. These zones shift from yellow to deep red as density increases.
*   **Incident Management**: Real-time insights help identify bottlenecks, allowing organizers to dispatch safety teams and adjust access points before issues arise.

---

## 6. Event Lifecycle and Boundary Drawing

Organizers can manage events from creation to real-time adjustments using an intuitive, step-by-step wizard.

<div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', margin: '2rem 0' }}>
  <div style={{ textAlign: 'center' }}>
    <h4>Event Creator Wizard</h4>
    <img src="/assets/screenshots/admin/event-create.png" alt="Event Creation Wizard" width="380" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
  <div style={{ textAlign: 'center' }}>
    <h4>Event Parameter Editor</h4>
    <img src="/assets/screenshots/admin/event-edit.png" alt="Event Parameter Editor" width="380" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
</div>

### System Specifications
*   **Boundary Drawing Tools**: Draw custom, multi-node geofences directly on the map. This creates a geofenced area that binds the custom mobile routing graph.
*   **Live Boundary Tuning**: Drag and adjust geofence anchor points in real time to adapt to changing venue setups.

---

## 7. POI and Accessibility Management

Points of Interest (POIs) act as key landmarks on the map, providing routing targets and safety information for attendees.

<div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', margin: '2rem 0' }}>
  <div style={{ textAlign: 'center' }}>
    <h4>POI Creator Panel</h4>
    <img src="/assets/screenshots/admin/poi-create.png" alt="POI Creator Panel" width="380" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
  <div style={{ textAlign: 'center' }}>
    <h4>POI Accessibility Editor</h4>
    <img src="/assets/screenshots/admin/poi-edit.png" alt="POI Accessibility Editor" width="380" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
</div>

### System Specifications
*   **Accessibility Configuration**: Toggle the `Wheelchair Accessible` flag on POIs. This coordinates with the mobile routing engine, ensuring wheelchair-friendly paths bypass steps, gravel, or steep slopes.
*   **Pin Placement**: Place pins by clicking directly on the map canvas or by entering precise latitude and longitude coordinates.

<Callout type="warning">
  **Accessibility Operations**: Keeping accessibility markers accurate is critical for visitor safety. Any change to wheelchair accessibility flags recalculates active mobile routes within 2 seconds.
</Callout>
