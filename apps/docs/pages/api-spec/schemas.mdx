# API Schemas

This document defines the common data structures used across all Lattice APIs. These schemas are based on our core database models and standardized GeoJSON formats.

## 1. Core Objects

### Event

Represents a festival, concert, or urban occurrence.

| Field          | Type              | Description                                           |
| :------------- | :---------------- | :---------------------------------------------------- |
| `id`           | `integer`         | Unique identifier.                                    |
| `name`         | `string`          | Human-readable name.                                  |
| `type`         | `enum`            | One of: `music`, `food`, `tech`, `sports`, `generic`. |
| `location`     | `GeoJSON Point`   | `[lng, lat]` coordinates of the main entrance.        |
| `boundary`     | `GeoJSON Polygon` | The spatial extent of the event area.                 |
| `startDate`    | `ISO 8601`        | When the event begins.                                |
| `endDate`      | `ISO 8601`        | When the event ends.                                  |
| `primaryColor` | `string`          | Hex code for UI branding.                             |

### POI (Point of Interest)

A fixed location or service within or near an event.

| Field                    | Type            | Description                           |
| :----------------------- | :-------------- | :------------------------------------ |
| `id`                     | `integer`       | Unique identifier.                    |
| `type`                   | `enum`          | See [POI Types](#poi-types).          |
| `location`               | `GeoJSON Point` | `[lng, lat]` position.                |
| `status`                 | `enum`          | `open`, `closed`, `maintenance`.      |
| `crowdLevel`             | `enum`          | `low`, `moderate`, `high`, `blocked`. |
| `isWheelchairAccessible` | `boolean`       | Accessibility flag.                   |

---

## 2. Enums & Constants

### POI Types

Used to categorize locations for filtering and icons.

- `restaurant`, `wc`, `grandstand`, `gate`, `medical`, `shop`, `parking`, `meetup_point`, `bar`, `information`, `entrance`, `exit`, `emergency`, `stage`, `merch`, `security`.

### Mobility Modes

Used for routing customization.

- `standard`: Normal walking speed and pathing.
- `wheelchair`: Avoids stairs and steep slopes.
- `reduced_mobility`: Tailored for users with manual wheelchairs or walker devices.
- `visual_impairment`: Prioritizes tactile paving and auditory guidance indicators.
- `family_stroller`: Prioritizes ramps and wide paths.

---

## 3. Geospatial Standards

Lattice strictly follows **RFC 7946 (GeoJSON)**.

### Point

Used for specific markers.

```json
{
  "type": "Point",
  "coordinates": [2.1734, 41.3851]
}
```

### Polygon

Used for event boundaries or zones.

```json
{
  "type": "Polygon",
  "coordinates": [
    [
      [2.1734, 41.3851],
      [2.1754, 41.3851],
      [2.1754, 41.3871],
      [2.1734, 41.3871],
      [2.1734, 41.3851]
    ]
  ]
}
```
