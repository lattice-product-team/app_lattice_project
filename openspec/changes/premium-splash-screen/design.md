## Context

The current initialization flow in the Lattice mobile app is handled directly in `RootLayout` and `index.tsx`. While functional, it results in a generic startup experience that doesn't reflect the high-end aesthetic of the app. We need a dedicated splash screen that not only looks premium but also handles the parallel loading of assets and state.

## Goals / Non-Goals

**Goals:**

- Implement a visually stunning, animated splash screen.
- Orchestrate font loading, auth check, and data pre-fetching during the splash.
- Ensure smooth transitions to the main app routes.
- Use Skia and Reanimated for high-performance animations.

**Non-Goals:**

- Modifying the system splash screen (managed by Expo/Native). This change focuses on the _app-level_ splash screen that appears immediately after the system splash.
- Redesigning the authentication logic itself (only its orchestration during startup).

## Decisions

### 1. Dedicated Splash Screen Route

We will introduce a `(splash)` route group or handle it at the root of `(auth)`. Given the architecture, the simplest approach is to modify `app/index.tsx` to render the `SplashScreen` component while the app is in a `loading` state, instead of just returning `null`.

### 2. Animated Gradient + Glass Logo

The design will feature:

- A `LinearGradient` background with colors transitioning from a deep violet to a vibrant blue.
- A centered `SafeBlurView` (Liquid Glass) card.
- A pulsing "Lattice" logo or typography inside the card.
- A scale and opacity entrance animation for the logo.

### 3. Initialization Orchestration

The splash screen will remain visible until three conditions are met:

1.  Fonts are loaded.
2.  Auth state is determined (MMKV + API check if needed).
3.  Minimum display time (e.g., 2s) has passed to allow for the animation to complete.

## Risks / Trade-offs

- **[Risk] Rendering Performance** → **[Mitigation]** Use Skia for the background gradient if needed, or highly optimized SVG/Gradients. Ensure the animation doesn't drop frames during data fetching.
- **[Risk] Startup Latency** → **[Mitigation]** Ensure the splash doesn't block critical tasks. Pre-fetching should happen in the background.
- **[Risk] Skia Loading** → **[Mitigation]** The splash screen must use the `SafeBlurView` fallback if Skia is unavailable to prevent crashes on startup.
