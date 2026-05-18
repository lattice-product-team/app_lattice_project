import { Callout } from 'nextra/components'

# Admin API

The Admin API provides high-privileged operations for platform curation, content management, real-time operational monitoring, and system-wide telemetry diagnostics. These endpoints are restricted to authenticated users holding `admin` or `editor` roles.

---

## 1. Urban Event Curation

CRUD operations for managing the lifecycle of events, festivals, and permanent city installations.

### Create Event

Creates a new event entity and registers its spatial boundaries in the database (PostGIS). Invalidates affected geospatial caches and broadcasts WebSocket sync signals to active clients.

- **Route**: `POST /events`
- **Role Required**: `admin` | `editor`
- **Request Body**:
  ```json
  {
    "name": "Forum Music Festival",
    "description": "The most vibrant music festival in front of the Mediterranean Sea.",
    "type": "music",
    "startDate": "2026-05-20T12:00:00.000Z",
    "endDate": "2026-05-22T23:59:00.000Z",
    "locationName": "Parc del Forum",
    "address": "Placa del Forum, 1, Barcelona",
    "primaryColor": "#5856D6",
    "isPermanent": false,
    "center": {
      "type": "Point",
      "coordinates": [2.2223, 41.4121]
    },
    "boundary": {
      "type": "Polygon",
      "coordinates": [
        [
          [2.2210, 41.4110],
          [2.2240, 41.4110],
          [2.2240, 41.4130],
          [2.2210, 41.4130],
          [2.2210, 41.4110]
        ]
      ]
    },
    "bannerUrl": "https://server.com/images/banner.jpg",
    "galleryUrls": [
      "https://server.com/images/1.jpg",
      "https://server.com/images/2.jpg"
    ]
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "id": 1,
    "name": "Forum Music Festival",
    "description": "The most vibrant music festival in front of the Mediterranean Sea.",
    "type": "music",
    "startDate": "2026-05-20T12:00:00.000Z",
    "endDate": "2026-05-22T23:59:00.000Z",
    "locationName": "Parc del Forum",
    "address": "Placa del Forum, 1, Barcelona",
    "primaryColor": "#5856D6",
    "isPermanent": false,
    "bannerUrl": "https://server.com/images/banner.jpg",
    "galleryUrls": [...]
  }
  ```

### Modify Event

Updates specific attributes of an existing event by its ID. Invalidates active geospatial caches and broadcasts sync events over WebSocket.

- **Route**: `PATCH /events/:id`
- **Role Required**: `admin` | `editor`
- **Request Body**:
  ```json
  {
    "description": "Updated event description with revised timeline.",
    "primaryColor": "#FF2D55"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "id": 1,
    "name": "Forum Music Festival",
    "description": "Updated event description with revised timeline.",
    "type": "music",
    "startDate": "2026-05-20T12:00:00.000Z",
    "endDate": "2026-05-22T23:59:00.000Z",
    "locationName": "Parc del Forum",
    "address": "Placa del Forum, 1, Barcelona",
    "primaryColor": "#FF2D55",
    "isPermanent": false,
    "bannerUrl": "https://...",
    "galleryUrls": [...]
  }
  ```

### Delete Event

Permanently deletes an event and all its perimeters from the database. Cleans up Redis caches and notifies clients.

- **Route**: `DELETE /events/:id`
- **Role Required**: `admin`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Event deleted successfully"
  }
  ```

---

## 2. Point of Interest (POI) Curation

Managing internal facilities, safety zones, gates, and utilities within event premises.

### Create Point of Interest (POI)

Adds a new service marker (restrooms, food stalls, medical tents, entrances) to the event layout.
Performs an automatic **spatial validation** in the database to alert the editor if the POI coordinate is placed outside the event perimeter boundary.

- **Route**: `POST /pois`
- **Role Required**: `admin` | `editor`
- **Request Body**:
  ```json
  {
    "eventId": 1,
    "name": "Main Medical Center",
    "description": "Equipped medical tent with advanced life support.",
    "type": "medical",
    "geometry": {
      "type": "Point",
      "coordinates": [2.2225, 41.4119]
    },
    "locationName": "Parc del Forum - North Zone",
    "address": "Access aisle North, A-4",
    "capacity": 15,
    "isWheelchairAccessible": true,
    "hasPriorityLane": false,
    "bannerUrl": "https://server.com/images/med.jpg",
    "galleryUrls": []
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "id": 12,
    "eventId": 1,
    "name": "Main Medical Center",
    "description": "Equipped medical tent with advanced life support.",
    "type": "medical",
    "locationName": "Parc del Forum - North Zone",
    "address": "Access aisle North, A-4",
    "capacity": 15,
    "currentOccupancy": 0,
    "status": "open",
    "isWheelchairAccessible": true,
    "hasPriorityLane": false,
    "bannerUrl": "https://server.com/images/med.jpg",
    "galleryUrls": []
  }
  ```

### Modify Point of Interest (POI)

Updates operational attributes or accessibility statuses of a POI (highly useful for live occupancy reporting or hazard updates).

- **Route**: `PATCH /pois/:id`
- **Role Required**: `admin` | `editor`
- **Request Body**:
  ```json
  {
    "status": "closed",
    "description": "Temporarily closed for routine maintenance."
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "id": 12,
    "eventId": 1,
    "name": "Main Medical Center",
    "description": "Temporarily closed for routine maintenance.",
    "type": "medical",
    "locationName": "Parc del Forum - North Zone",
    "address": "Access aisle North, A-4",
    "capacity": 15,
    "currentOccupancy": 0,
    "status": "closed",
    "isWheelchairAccessible": true,
    "hasPriorityLane": false,
    "bannerUrl": "https://...",
    "galleryUrls": []
  }
  ```

### Delete Point of Interest (POI)

Removes a POI from the database and updates live client map layouts.

- **Route**: `DELETE /pois/:id`
- **Role Required**: `admin`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "POI deleted successfully"
  }
  ```

### Override Event Spatial Data (Spatial Overrides)

Overwrites both event perimeter polygons and all inner POIs in a single atomic database operation.

- **Route**: `POST /events/:id/spatial`
- **Role Required**: `admin`
- **Request Body**:
  ```json
  {
    "boundary": {
      "type": "Polygon",
      "coordinates": [...]
    },
    "pois": [
      {
        "name": "Main Access Gate",
        "type": "gate",
        "geometry": { "type": "Point", "coordinates": [2.2215, 41.4118] }
      }
    ]
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Event spatial data saved successfully"
  }
  ```

---

## 3. Real-Time Crowd Analytics and Stats

Supervising aggregate city telemetry and crowd flows inside active event zones.

### Global System Statistics

Fetches consolidated system metrics based on database inventory and live telemetry pings.

- **Route**: `GET /stats`
- **Response (200 OK)**:
  ```json
  {
    "activeEvents": 3,
    "totalCapacity": 12400,
    "liveUsers": 456,
    "activeAlerts": 2
  }
  ```

### Event Crowd Metrics

Retrieves specialized crowd density factors and entry speeds for a specific event based on devices pinging the telemetry router in the last 2 minutes.

- **Route**: `GET /events/:id/stats`
- **Response (200 OK)**:
  ```json
  {
    "estimatedCapacity": 5000,
    "entryRate": 48,
    "staffOnline": 14,
    "activeAlerts": 1
  }
  ```

---

## 4. Diagnostics and Networks

Monolith connectivity and structure audits.

### Path Network Geometry

Returns all node vertices and walking segment geometries stored in the database. Used to debug graph connectivity, routing weights, and visual obstacles on the administration control map.

- **Route**: `GET /navigation/network`
- **Query Parameters**:
  - `eventId` (optional): Limits the graph output to segments mapped under a single event container.
- **Response (200 OK)**:
  ```json
  {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [2.2215, 41.4118],
            [2.2221, 41.4121]
          ]
        },
        "properties": {
          "sourceNodeId": 101,
          "targetNodeId": 102,
          "distance": 84.5,
          "surface": "concrete",
          "hasStairs": false
        }
      }
    ]
  }
  ```

### Health Diagnostics

Performs structural tests verifying connections and responses for satellite servers, databases (PostgreSQL/PostGIS), and Redis caching nodes.

- **Route**: `GET /health`
- **Response (200 OK)**:
  ```json
  {
    "status": "api_ok",
    "timestamp": "2026-05-18T17:24:00.000Z",
    "env": "production",
    "service": "lattice_api",
    "path": "/health"
  }
  ```
