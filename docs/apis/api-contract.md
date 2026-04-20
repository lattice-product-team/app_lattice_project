# API Contract v1.0 - Lattice API

## 1. General Standards

- **Base URL:** `https://api.circuit-copilot.com/`
- **Authentication:** Bearer Token (JWT) in headers. `Authorization: Bearer <token>`
- **Data Format:** JSON for REST, MessagePack (binary) for WebSockets (location updates).
- **Geographic Format:** All coordinates MUST follow the **GeoJSON** standard: `[longitude, latitude]`.

## 2. REST Endpoints (HTTP)

### Authentication and Onboarding (US1, US2)

#### `POST /auth/ticket-sync`

Links a physical/digital ticket with the user and extracts access metadata.

- **Body:**

```json
{
  "qr_code_data": "CRYPTIC_SCANNER_STRING",
  "device_id": "uuid-v4"
}
```

- **Response (200 OK):**

```json
{
  "user_id": "u-123",
  "token": "jwt_token_here",
  "ticket_info": {
    "gate": "Gate 3",
    "zone": "Grandstand G",
    "seat": "Row 12, Seat 4",
    "seat_coordinates": [2.2645, 41.5701] // Navigation target
  }
}
```

#### `PATCH /users/me/parking` (US34)

Saves the car location for the exit journey.

- **Body:**

```json
{
  "location": [2.261, 41.569],
  "notes": "Parking B, Row 4"
}
```

### Navigation and Map Data (US6, US9)

#### `GET /pois`

Retrieves static Points of Interest (POI). Can be cached on the device (local SQLite).

- **Query Params:** `?category=restaurant,wc,grandstand`
- **Response (200 OK):**

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [2.26, 41.57] },
      "properties": {
        "id": 101,
        "name": "Burger Truck #4",
        "category": "restaurant",
        "description": "Premium food with short lines",
        "crowdLevel": "low"
      }
    }
  ]
}
```

#### `GET /pois/categories`

Retrieves the list of available categories for POIs (for filter chips).

- **Response (200 OK):**

```json
[
  { "id": "1", "label": "Gates", "icon": "door-open", "category": "gate" },
  { "id": "2", "label": "Food", "icon": "food", "category": "restaurant" }
]
```

### Intelligent Routing (supports US4, US7)

#### `POST /navigation/route`

Requests a pedestrian route considering current congestion.

- **Body:**

```json
{
  "origin": [2.261, 41.568],
  "destination": [2.265, 41.572],
  "mode": "walking" // Future: 'vip_shuttle'
}
```

- **Response (200 OK):**

```json
{
  "route_geometry": "encoded_polyline_string", // Lightweight for Mapbox/MapLibre
  "distance_meters": 450,
  "estimated_time_seconds": 380,
  "congestion_level": "high", // UI triggers warning color
  "ar_checkpoints": [
    // Nodes where AR arrows should appear
    { "coords": [2.262, 41.569], "instruction": "Turn left at the Red Bull stand" }
  ]
}
```

## 3. WebSocket Events (Real-Time)

**Protocol:** Socket.io
**Namespace:** `/live-track`

### Client Emissions (Sent by mobile)

#### `user:update_location` (Throttled)

Sent at most once every 30 seconds or if moved >20m.

- **Payload:**

```json
{
  "lat": 41.5701,
  "lng": 2.2645,
  "accuracy": 12.5, // Meters. Ignore if > 50m
  "heading": 180, // For AR orientation
  "speed": 1.2 // m/s
}
```

#### `group:join`

To join a group of friends.

- **Payload:** `{ "group_code": "FAST-CARS-24" }`

### 📥 Server Emissions (Received by mobile)

#### `group:locations`

Friend positions on the map.

- **Payload:**

```json
[
  { "user_id": "u-456", "name": "Marc", "coords": [2.26, 41.57], "last_seen": "10s ago" },
  { "user_id": "u-789", "name": "Laia", "coords": [2.27, 41.58], "last_seen": "2min ago" } // UI shows 'offline' icon
]
```

#### `race:status` (US11)

Live race data (Low Latency).

- **Payload:**

```json
{
  "lap": 45,
  "total_laps": 66,
  "flag": "yellow", // Triggers UI alert
  "leaderboard_top3": ["VER", "HAM", "NOR"]
}
```

## 4. Error Management Standards

All error responses MUST follow this format so the Frontend can display consistent messages:

```json
{
  "error": {
    "code": "TICKET_INVALID",
    "message": "The QR code implies a generic entry, please select zone manually.",
    "user_friendly_message": "We couldn't detect your zone. Please select it manually.",
    "status": 400
  }
}
```
