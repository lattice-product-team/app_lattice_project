import { Callout } from 'nextra/components'

# API Data Schemas

This document defines the core data schemas and object structures managed by the Lattice Express monolith. These definitions form the structural blueprint for database modeling and ensure data uniformity across PostgreSQL/PostGIS, Redis caching, and client-side applications.

---

## 1. System Entities

### Event

Represents an organized festival, concert, conference, or permanent urban infrastructure. It acts as the primary logical container for spatial perimeters and related Points of Interest.

| Field | Type | Nullable | Description |
| :--- | :--- | :--- | :--- |
| `id` | `integer` | No | Unique, auto-incrementing primary key. |
| `name` | `string` | No | Public name of the event or location. |
| `description` | `string` | Yes | Descriptive summary or promotional details of the event. |
| `type` | `enum` | No | Categorization tag. Values: `music`, `food`, `tech`, `sports`, `generic`. |
| `locationName` | `string` | Yes | Common name of the venue (e.g., "Parc del Forum"). |
| `address` | `string` | Yes | Full postal street address of the venue. |
| `bannerUrl` | `string` | Yes | URL pointing to the primary event cover or banner image. |
| `galleryUrls` | `array (string)` | Yes | Array of image URLs comprising the media gallery. |
| `startDate` | `ISO 8601` | No | UTC timestamp marking when event doors or activities open. |
| `endDate` | `ISO 8601` | No | UTC timestamp marking when the event concludes. |
| `isPermanent` | `boolean` | No | Set to `true` if the layout is a fixed city fixture; `false` if temporary. |
| `primaryColor` | `string` | Yes | Hexadecimal color code for custom client styling (e.g., `#5856D6`). |
| `center` | `GeoJSON Point` | Yes | Central point used to anchor map cameras. |
| `boundary` | `GeoJSON Polygon` | Yes | Standard polygon enclosing the event's geographic perimeter. |
| `metadata` | `JSON` | Yes | Highly flexible container for custom attributes, settings, or stats. |

---

### Point of Interest (POI)

Any active facility, gate, medical tent, or restroom located within or adjacent to an active event area.

| Field | Type | Nullable | Description |
| :--- | :--- | :--- | :--- |
| `id` | `integer` | No | Unique, auto-incrementing primary key. |
| `eventId` | `integer` | Yes | Foreign key mapping to the parent event. Null if a public city resource. |
| `name` | `string` | No | Descriptive name of the facility (e.g., "Medical Station Alpha"). |
| `description` | `string` | Yes | Additional operational notes regarding the POI. |
| `type` | `enum` | No | Functional POI category. See complete list in [POI Types](#poi-types). |
| `location` | `GeoJSON Point` | No | Precise geographic point structured as `[longitude, latitude]`. |
| `locationName` | `string` | Yes | Descriptive label of the local area (e.g., "Behind Grandstand G"). |
| `address` | `string` | Yes | Postal address of the POI. |
| `capacity` | `integer` | Yes | Maximum occupancy ceiling allowed inside the POI. |
| `currentOccupancy` | `integer` | No | Live estimate of active visitors inside the POI. |
| `status` | `enum` | No | Operational status of the service: `open`, `closed`, `maintenance`. |
| `crowdLevel` | `enum` | No | Congestion indicator: `low`, `moderate`, `high`, `blocked`. |
| `isWheelchairAccessible`| `boolean` | No | Flag indicating complete wheelchair and stroller access. |
| `hasPriorityLane` | `boolean` | No | Flag indicating existence of an express or priority queue. |
| `bannerUrl` | `string` | Yes | URL pointing to a descriptive POI cover image. |
| `galleryUrls` | `array (string)` | Yes | Gallery of URLs containing descriptive media files. |

---

### Saved Location

Private spatial bookmarks logged by mobile users for marking key personal coordinates.

| Field | Type | Nullable | Description |
| :--- | :--- | :--- | :--- |
| `id` | `integer` | No | Unique, auto-incrementing primary key. |
| `userId` | `integer` | No | Foreign key mapping to the owner user account. |
| `label` | `string` | No | Personalized name supplied by the user (e.g., "My Camp Tent"). |
| `location` | `GeoJSON Point` | No | Bookmarked coordinate pair `[longitude, latitude]`. |
| `createdAt` | `ISO 8601` | No | Timestamp of bookmark creation. |

---

### Telemetry Log

Time-series location logs collected from mobile devices to compile crowd density analytics.

| Field | Type | Nullable | Description |
| :--- | :--- | :--- | :--- |
| `id` | `integer` | No | Unique primary key of the log entry. |
| `userId` | `integer` | Yes | Foreign key mapping to the active user. Null for anonymous logs. |
| `eventId` | `integer` | No | Foreign key pointing to the target event. |
| `location` | `GeoJSON Point` | No | Telemetry coordinate pair `[longitude, latitude]`. |
| `timestamp` | `ISO 8601` | No | Precise UTC timestamp of the telemetry ping. |

---

## 2. Enums and Constants

### POI Types

The POI `type` classifies facilities to load coordinate icons and trigger semantic navigation searches:

*   `restaurant`: Food courts, dining trucks, and snack stalls.
*   `wc`: Standard public restrooms and wheelchair-accessible cabins.
*   `grandstand`: Seat grids, VIP decks, and spectating zones.
*   `gate`: Main access gates, security checkpoints, and ticket boxes.
*   `medical`: First aid points, emergency response centers, and field pharmacies.
*   `shop`: Merchandise stores, record stands, and accessory shops.
*   `parking`: Designated zones for cars, transit shuttles, or bike racks.
*   `meetup_point`: Prominent landmarks suggested for grouping/reunions.
*   `bar`: Live beverage dispensers and cocktail bars.
*   `information`: Information centers, tourist guidance desks, and physical maps.
*   `entrance`: Dedicated entrance doors or one-way gates.
*   `exit`: Standard egress channels and evacuation routes.
*   `emergency`: High-priority evacuation exits.
*   `stage`: Live stages, dance floors, and performance platforms.
*   `merch`: Secondary merchandising stands and vendor stalls.
*   `security`: Security stations, lost-and-found desks, and local police offices.

### Mobility Modes

The routing engine supports custom pedestrian profiles designed around different mobility levels:

*   `standard`: Standard walking speed. Accesses all valid trails and stairs.
*   `wheelchair`: Avoids stairs, gravel, steep grades, and narrow turnstiles.
*   `reduced_mobility`: Tailored for crutches or walking aid devices. Prioritizes mild slopes.
*   `visual_impairment`: Prioritizes routes containing tactile pavements and auditory signals.
*   `family_stroller`: Designed for baby strollers. Prioritizes wide ramps and elevator accesses.

---

## 3. GeoJSON Standards (RFC 7946)

All spatial properties communicated over the Express network adhere to standard GeoJSON parameters.

### GeoJSON Point

Represents isolated coordinates for POIs, saved locations, and telemetry pings:

```json
{
  "type": "Point",
  "coordinates": [2.2223, 41.4121]
}
```

### GeoJSON Polygon

Represents perimeter rings for event boundaries and closed zones:

```json
{
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
}
```

<Callout type="info">
  Per RFC 7946 rules, polygon rings must be closed by repeating the exact first coordinate array at the final index position of the coordinate ring.
</Callout>
