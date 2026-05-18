import { Callout } from 'nextra/components'

# Command Center: Admin User Guide

Welcome to the **Lattice Command Center User Guide**. This comprehensive manual is designed to help event organizers, city administrators, and operators navigate, configure, and monitor the Lattice ecosystem in real-time. 

Lattice provides a state-of-the-art telemetry and geospatial asset curation engine. Any action performed in this web-admin interface propagates instantly to the active mobile applications, ensuring seamless operational control.

---

## 1. Portal Access & Authentication

Before accessing the telemetry maps and management dashboard, administrators must authenticate via the secure portal.

![Admin Portal Login](/assets/screenshots/admin/login.png)
*Figure 1.1: Secure Admin Login Interface*

### Step-by-Step Login:
1. **Navigate** to your designated administrative URL (e.g., `http://localhost:3000` or the production endpoint).
2. **Enter your Credentials**: Input your registered administrator email address and secure password.
3. **Session Verification**: The platform verifies your authorization tier. Upon successful validation, you will be redirected to the global map view.

<Callout type="warning">
  Keep your credentials confidential. Administrative accounts possess real-time event manipulation rights which directly impact active field operations and mobile user safety.
</Callout>

---

## 2. Global Map Explorer & Dashboards

Upon authentication, you are presented with the primary workspace. This is divided into high-level dashboards and the core **Map Explorer**.

### 2.1 The Global Map Overview
The Map Explorer is your centralized operational view. It overlays active telemetry, POIs, and event boundaries onto a rich, real-time map.

![Global Map Overview](/assets/screenshots/admin/map.png)
*Figure 2.1: Centralized Map Command Center*

*   **Geospatial Syncing**: Displays path networks, current telemetry dots representing users, and structural items.
*   **Navigation Overlay**: Visualizes live status flags and routes currently deployed inside the mobile ecosystem.

---

### 2.2 Dashboard Control Hubs
For structured data grids and quick creation, utilize the secondary dashboards reachable via the navigation bar:

*   **Event Dashboard**: Shows a structured index of all planned, live, and archived events, with rapid metrics on active participants.
*   **POI Dashboard**: Provides a searchable directory of permanent infrastructure nodes, complete with filters for categorization and health indices.

![Event Dashboard](/assets/screenshots/admin/event-dashboard.png)
*Figure 2.2: Event Administration Grid*

![POI Dashboard](/assets/screenshots/admin/poi-dashboard.png)
*Figure 2.3: Point-of-Interest Inventory*

---

## 3. Interactive Map Navigation & Item Selection

The map is fully interactive. Clicking on active entities displays context-specific flyout menus and details cards.

### 3.1 Inspecting Active Events
Clicking on an event boundary polygon displays the active event inspector.

![Event Map Inspector](/assets/screenshots/admin/map-event.png)
*Figure 3.1: Event Overlay Selection Inspector*

*   **Live Status Info**: View active participant counts, schedule timestamps, and branding colors.
*   **Boundary Visibility**: Highlights the polygonal fence inside which the customized navigation graph is bound.

### 3.2 Inspecting Points of Interest (POIs)
Clicking on any POI icon (e.g., medical stations, restrooms, emergency exits) triggers a detailed drawer on the left side of the map.

![POI Map Inspector](/assets/screenshots/admin/map-poi.png)
*Figure 3.2: Selected POI Details Sidebar*

*   **Live Telemetry & Status**: Monitor real-time flags such as `Active`, `Under Maintenance`, or `Closed`.
*   **Structural Details**: Check accessibility parameters (e.g., wheelchair compliance) and localized notes.

---

## 4. Map Overlays, Dropdowns & Menus

To handle dense crowds and complex spatial topologies, the map features advanced controls, layer filters, and real-time telemetry options.

### 4.1 Layer & Control Dropdowns
Click the **Layer Selector`** button (top-right of the map) to toggle map layers, overlays, and filter categories.

![Layer Menu Control](/assets/screenshots/admin/map-menu.png)
*Figure 4.1: Multi-layered Map Controls Menu*

*   **Map Base Toggle**: Switch between physical topographic views, structural architectural vector maps, or standard street grids.
*   **POI Class Filtering**: Show or hide specific categories (e.g., hide food trucks while emphasizing emergency exits and first aid posts).
*   **Navigation Overlay**: Turn the routing network visibility on or off to inspect physical links and nodes.

### 4.2 Telemetry Radar & Crowd Heatmaps
Lattice collects anonymous mobile telemetry to generate real-time crowd heatmaps.

![Crowd Telemetry Radar](/assets/screenshots/admin/map-event-radar.png)
*Figure 4.2: Real-time Crowd Radar & Heatmap Analytics*

*   **Density Heatmap**: Zones with heavy crowd concentration glow from yellow to deep red.
*   **Risk Assessment**: Identify bottleneck routes, entry gate queues, and coordinate safety marshals based on live density parameters.

---

## 5. Event Life-Cycle Management

Creating and maintaining events is simple with our responsive step-by-step form wizards.

### 5.1 Creating a New Event
To provision a new event, go to the **Event Dashboard** and click **Create Event**.

![Event Creation Wizard](/assets/screenshots/admin/event-create.png)
*Figure 5.1: Custom Event Creation Panel*

*   **Step 1: General Information**: Input the event name, organization tier, description, and primary brand hex color.
*   **Step 2: Scheduling**: Assign start and end timestamps.
*   **Step 3: Geospatial Fencing (Map)**: Draw a bounding polygon directly on the map. This creates a geofenced area. The custom mobile navigation graph will activate when a user enters this boundary.

### 5.2 Editing Existing Events
Modifications to active schedules, locations, or operational rules are done via the **Edit Event** panel.

![Event Editor Panel](/assets/screenshots/admin/event-edit.png)
*Figure 5.2: Event Parameter Modification Editor*

*   **Hot-Reload Updates**: Updates publish to user apps instantly.
*   **Geofence Adjustments**: You can drag the anchor nodes of your event geofence to adjust boundary lines in real time.

---

## 6. Points of Interest (POI) & Accessibility Curation

POIs act as structural and helpful markers on the map, providing routing points and emergency guidance.

### 6.1 Creating a POI
Click **Create POI** on the **POI Dashboard** or click directly on the Map Explorer coordinates.

![POI Creator Wizard](/assets/screenshots/admin/poi-create.png)
*Figure 6.1: Point-of-Interest Constructor Wizard*

1.  **Name & Category**: Input the title and select the category (e.g., `Restroom`, `Security`, `Food & Drink`, `Transit Hub`).
2.  **Icon & Styling**: Assign standard icons and select custom priority scaling.
3.  **Geospatial Pinning**: Input precise latitude/longitude, or click directly on the interactive map card to place the pin.

### 6.2 Editing POI & Accessibility Parameters
Maintaining correct state parameters is crucial for user trust, particularly regarding accessibility.

![POI Editor Panel](/assets/screenshots/admin/poi-edit.png)
*Figure 6.2: POI Details & Accessibility Configuration Panel*

*   **Real-time Status Toggle**: Update the status to `Operational`, `Maintenance`, or `Closed`.
*   **Accessibility Settings**: Toggle `Wheelchair Accessible` flags. This tells the mobile routing algorithm to bypass routes that lead to this POI if they contain stairs or steep grades.
*   **Dynamic Broadcast**: Changes save immediately, refreshing the mobile view and active routes within 2 seconds.

<Callout type="info">
  **Accessibility Integrity**: Keeping the `Wheelchair Accessible` flags accurate prevents the mobile routing engine from recommending hazardous paths to mobility-impaired attendees.
</Callout>
