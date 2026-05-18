# Specification: AR Exploration Feature

## 1. Store API (`useARStore`)

```typescript
enum ARFilterMode {
  CLOSEST_EVENT,
  SELECTED_EVENT,
  SPECIFIC_PIN,
}

interface ARState {
  isVisible: boolean;
  filterMode: ARFilterMode;
  targetId: string | number | null;
  openAR: (mode: ARFilterMode, id?: string | number) => void;
  closeAR: () => void;
}
```

## 2. Filtering Logic Requirements

- **CLOSEST_EVENT:**
  - Must calculate distance to all event centroids.
  - Must select exactly ONE event (the nearest one).
  - Must render ALL pins associated with that event.
- **SELECTED_EVENT:**
  - Must render ALL pins associated with the provided `eventId`.
- **SPECIFIC_PIN:**
  - Must render exactly ONE pin (the provided `poiId`).

## 3. UI Requirements

- **Binoculars Button:** Always visible on Map BASE layer.
- **Use AR Button:**
  - Visible in Event Details (Level 2/3).
  - Visible in POI Details (Level 2/3).
- **Portrait Lock:** Mandatory. The camera feed and UI must not rotate.
- **Distances:** Must update in real-time as the user moves.

## 4. Permission Flows

- If Camera Permission is denied: Show `CameraPermissionView`.
- If Location Permission is denied: AR cannot work; show appropriate warning or exit.
- If GPS is inaccurate: Show "Calibrating..." or similar in `ARHUD`.
