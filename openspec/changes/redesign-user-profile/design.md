## Context

The profile screen is a critical part of the user experience in Lattice, serving as the personal dashboard. Currently, it is a placeholder. The goal is to implement a high-fidelity, theme-aware profile that follows Apple's design language (depth, blur, typography) and Google's functional clarity.

## Goals / Non-Goals

**Goals:**

- Implement a responsive, multi-section profile screen.
- Support full dark/light mode synchronization using `theme.ts`.
- Create a reusable Achievement/Medal system for gamification.
- Ensure 60fps animations for header transitions using Reanimated.

**Non-Goals:**

- Implement backend APIs for profile editing (mocked for now).
- Social features (friends, following) are out of scope for this private profile phase.

## Decisions

### 1. Feature-Based Directory Structure

**Choice**: Create `apps/mobile/src/features/profile/`.
**Rationale**: Keeps profile-specific logic, components, and hooks isolated from the main app routes, following the project's existing architectural pattern.

### 2. State Management with Zustand

**Choice**: Implement `useProfileStore`.
**Rationale**: Provides a lightweight way to manage profile state, achievements, and local preferences without the overhead of Redux, matching other features in the codebase.

### 3. Animation Strategy

**Choice**: Use `react-native-reanimated` for a "Collapsible Header" effect.
**Rationale**: Matches the Apple aesthetic where the header background blurs and the title shrinks as the user scrolls up.

### 4. Component Primitives

**Choice**: Use existing UI primitives from `apps/mobile/src/components/ui` if available, otherwise create new theme-aware components.
**Rationale**: Ensures visual consistency and rapid development.

## Risks / Trade-offs

- **[Risk] Heavy Asset Loading** → **[Mitigation]** Use `expo-image` for optimized avatar and medal rendering with caching.
- **[Trade-off] Local State vs Server Sync** → For this phase, we prioritize UI fidelity with local mock data, with sync capabilities to be added in a future spec.
