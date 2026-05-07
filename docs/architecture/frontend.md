# Frontend Architecture: Mobile App

The Lattice mobile application is built with Expo and React Native, focusing on high-performance map interactions and location-based AR.

## Core Philosophical Pillars

1. **Mixed Style Design:** Fusion of Cupertino elegance and Material structure.
2. **Offline-First:** Critical data (POIs, Map Styles) is cached to survive network saturation.
3. **Location Intelligence:** Efficiency-gated GPS updates and on-device routing calculations.

## State Management

We use a hybrid strategy to optimize for different types of data:

- **Server State:** [React Query](https://tanstack.com/query/latest) for API requests.
- **Global UI State:** [Zustand](https://github.com/pmndrs/zustand) for shared ephemeral data.
- **Storage:** [MMKV](https://github.com/mrousavy/react-native-mmkv) for high-speed synchronous persistence.

## Offline Strategy

Given the typical network saturation at circuits, the app is designed to be functional "Off the Grid":

1. **Data Caching:** React Query persists critical responses to MMKV. Static POIs are stored in a local SQLite database if necessary.
2. **Offline Maps:** MapLibre is configured to use pre-downloaded offline tiles for the circuit region.
3. **Local Routing:** Navigation graphs are stored locally. The server only provides real-time congestion weights as an enhancement.
4. **Deferred Telemetry:** GPS updates are queued locally if the server is unreachable.

## Map & Performance

- **Engine:** MapLibre GL.
- **Optimization:** We force `surfaceView={true}` on Android to bypass the overhead of `TextureView` during complex UI layering.
- **Marker Layering:** Bulk markers use GPU-accelerated `CircleLayer` and `SymbolLayer`, while only the selected marker uses a high-detail native `MarkerView`.

## Augmented Reality (AR)

- **Engine:** React Three Fiber (R3F).
- **Implementation Strategy:**
  - **View Layering:** `expo-camera` provides the background feed, with a R3F `Canvas` overlaid for 3D rendering.
  - **World Tracking:** Aligning the AR coordinate system using GPS and device sensors.
  - **Asset Rendering:** Optimized 3D components and `drei` for text projections in 3D space.

## App States & Transitions

The transition between 2D (Map) and AR is driven by **Device Sensors** (Tilt-to-AR logic) and **Orientation**:

| Orientation   | Pitch Angle   | State      | UI Behavior                                  |
| :------------ | :------------ | :--------- | :------------------------------------------- |
| **Portrait**  | Any           | 2D Map     | Full MapLibre view.                          |
| **Landscape** | **< 30°**     | 2D Map     | Full MapLibre view. Low sensor polling.      |
| **Landscape** | **30° - 75°** | Transition | Interpolated blur. Start Camera & AR engine. |
| **Landscape** | **> 75°**     | AR Live    | Overlay R3F Scene on top of Camera.          |

**Important:** AR is restricted to **Landscape (Horizontal)** mode to ensure better field of view and stability.

**Automatic Overrides:**

- AR is disabled if `battery < 15%`.
- Reverts to 2D if the device temperature exceeds safety thresholds due to high GPU usage.

---

> For setup instructions, see the [**Developer Setup Guide**](../guides/setup.md).
