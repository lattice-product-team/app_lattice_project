## Context

The current Discovery Sheet implementation uses a `GestureDetector` that wraps a `TextInput`. On Android, `TextInput` (Native `EditText`) captures touch events to manage its own focus and internal state, which prevents the parent `GestureDetector` from receiving "pan" events during the sheet's expansion phase. This results in the sheet only being expandable via the small handle or the profile button (which, being a `Pressable`, propagates gestures differently).

## Goals / Non-Goals

**Goals:**
- Enable smooth sheet expansion from any point in the Search Bar header on Android.
- Maintain full interactivity for text input once the sheet is expanded.
- Improve the hit area of the sheet handle for better "blind" grabbing.
- Preserve the existing high-fidelity animations and spring physics.

**Non-Goals:**
- Redesigning the visual look of the Search Bar.
- Modifying the underlying `react-native-reanimated` spring configurations.

## Decisions

### 1. Conditional Search Bar Interactivity
We will pass the `islandState` shared value into the `FloatingSearchBar`. When `islandState.value < 0.1` (Level 1), we will set `editable={false}` on the `TextInput`.
- **Rationale**: By disabling the `TextInput` at Level 1, we prevent it from becoming a native focus-consumer, allowing the parent `GestureDetector` to see the touch events.
- **Alternative**: Using `pointerEvents="none"` on the input. This was rejected because we still want to detect taps to trigger manual expansion.

### 2. Transparent Drag Overlay vs. Pressable Trigger
In `index.tsx`, we will wrap the `FloatingSearchBar` in a `Pressable` that is only "active" at Level 1.
- **Rationale**: This `Pressable` will handle the `onPress` to expand the sheet to Level 2 (`withSpring(0.5)`). Because it's a React Native gesture-handler compatible component, it won't block the simultaneous `Pan` gesture.

### 3. Handle Hit Area Expansion
The `handleContainer` in `index.tsx` will have its vertical padding increased from `5px` to `15px`.
- **Rationale**: This creates a 34px total height "invisible" grab zone (15 padding + 4 handle + 15 padding), making it significantly easier for users to target the top of the sheet.

## Risks / Trade-offs

- [Risk] → **Gesture Jitter**: Tapping the search bar might trigger a slight pan start.
- [Mitigation] → Use `activeOffsetY` thresholds (already implemented as `[-10, 10]`) to differentiate between a tap and a drag.
- [Risk] → **Android Keyboard Lag**: Transitioning from `editable={false}` to `true` might cause a frame drop when the keyboard opens.
- [Mitigation] → Ensure the state transition happens at the beginning of the expansion animation to hide the "enable" delay.
