# Mobile Best Practices

## Expo & Development Builds

This project requires **Custom Development Builds** because it uses native modules that are not compatible with Expo Go (MMKV, Reanimated, Viro).

- **Build Command:** `npx expo run:android` or `npx expo run:ios`.
- **Pre-requisite:** Ensure you have the local development environment configured (Android Studio / Xcode).

## MapLibre GL Integration

We use `@maplibre/maplibre-react-native` for the map engine.

14. **Performance:** Always use `surfaceView={true}` for Android in the `MapView` component.
15. **High-Performance Layering:**
    - **Avoid Standard Markers:** Do not use the default `Marker` component for multiple points. It causes JS-thread bottlenecking.
    - **Native Layers:** Use `ShapeSource` + `CircleLayer`/`SymbolLayer`. This offloads rendering to the GPU and MapLibre's native core.
    - **Separate Active State:** Use a dedicated `ShapeSource` for the "Selected POI" to allow instant UI updates without re-parsing the entire dataset.
16. **Batching:** Update GeoJSON shapes via `useMemo` to prevent unnecessary bridge traffic.

## State Management Patterns

- **Server Side:** Use `useQuery` for data fetching. Wrap results in custom hooks for business logic reuse.
- **Local Persistence:** Use `react-native-mmkv` for critical settings (Auth, Offline Cache). Avoid `AsyncStorage`.
- **Animation:** Use `react-native-reanimated` for all UI transitions.

Transitions between 2D and AR are governed by device orientation to ensure a smooth, professional experience.

### Orientation Management

- **Portrait:** Standard 2D Map view.
- **Landscape (Physical):** AR activates automatically.
- **Hybrid Projection:** In landscape mode, labels use a 2D Overlay (Reanimated) projected via a 90-degree rotated coordinate system to stay readable even if the OS orientation hasn't flipped yet.

### Stability

- **Smoothing:** Uses `react-native-reanimated` (opacity fade) and a small mounting delay to ensure GPU stability, especially on emulators.
- **Orientation Lock:** Ensure `AndroidManifest.xml` has `android:screenOrientation="unspecified"` to allow rotation.

## Clean Code & Scalability

- **SettingItem Pattern:** Use the `SettingItem` component for all list-based UI screens (Profile, Settings) to ensure consistent iconography and feedback.
- **StyleSheet.create:** Prefer `StyleSheet.create` over inline objects for shadows and complex compositions to improve rendering performance.
- **Conditional Rendering:** Always use ternary operators `condition ? <Component /> : null` instead of the `&&` short-circuit to avoid rendering unexpected `0` or `NaN` values in the UI.

## Accessibility

Always provide accessibility labels for interactive elements on the map and in the UI to ensure the app is usable by everyone at the circuit.
