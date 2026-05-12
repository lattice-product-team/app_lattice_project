# Admin API

*Status: Internal Use*

The Admin API provides high-privileged operations for platform curation, content management, and real-time operational telemetry.

## 1. Content Curation

### POST `/pois`
Adds a new Point of Interest to the global database.
- **Role**: `admin` or `editor`

### POST `/events`
Publishes a new urban event or festival.

### POST `/events/:id/spatial`
Overrides or updates the spatial boundaries/geometry for a specific event. Used for fine-tuning map rendering.

---

## 2. Telemetry & Stats

### GET `/stats`
Global system overview.
- **Returns**: Total active users, total events, system load, and database health.

### GET `/events/:id/stats`
Engagement metrics for a specific event.
- **Returns**: View counts, ticket claims, and real-time attendee estimates.

---

## 3. System Health

### GET `/health`
Check connectivity to database, cache (Redis), and Firebase services.

### GET `/navigation/network`
Returns the status and version of the current navigation graph used by the routing engine.
