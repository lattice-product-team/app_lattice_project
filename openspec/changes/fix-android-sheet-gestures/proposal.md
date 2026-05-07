## Why

On Android, the `TextInput` component within the `FloatingSearchBar` aggressively consumes touch events to manage focus and cursor control. This prevents the parent `GestureDetector` from identifying "pan" gestures, making it impossible for users to expand the Level 1 (compact) sheet by dragging the search bar area. While this works on iOS due to more permissive native event propagation, Android users are forced to find the small handle area or the profile button to expand the sheet, leading to a frustrating and inconsistent UX.

## What Changes

- **Conditional Search Bar Interactivity**: The `FloatingSearchBar` will be made non-editable/non-interactive for text input when the Discovery Sheet is in its Level 1 (compact) state.
- **Unified Drag Trigger**: In Level 1, the entire Search Bar area will act as a unified "grab area" for the sheet's expansion gesture.
- **Hit Area Optimization**: The sheet's "Handle" (grab bar) hit area will be significantly increased vertically (without changing its visual design) to provide a more forgiving target for gestures.
- **Touch-to-Expand Logic**: A single tap on the Search Bar at Level 1 will trigger a smooth spring animation to expand the sheet to Level 2/3, rather than focusing the input immediately.
- **Dynamic Input Activation**: The `TextInput` will only become editable once the sheet has passed a certain height threshold (e.g., Level 2), ensuring that "pan" gestures have priority during the initial expansion phase.

## Capabilities

### Modified Capabilities
- `premium-sheet-interaction`: Added requirement for platform-specific gesture priority and conditional input interactivity for the Discovery Sheet.
- `search-results-ui`: Added requirement for search bar activation states based on sheet height.

## Impact

- `FloatingSearchBar.tsx`: New props for `editable` state and `onPress` handling.
- `index.tsx` (Main Page): Logic for managing search bar interactivity and handle hit area.
- `react-native-gesture-handler`: Refinement of Simultaneous/Exclusive gesture coordination.
