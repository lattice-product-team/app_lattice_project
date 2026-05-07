## Context

The mobile app is built with Expo and React Native in a monorepo. Recently, a new shared package `@app/theme` was created to centralize design tokens. The mobile app still uses local `colors.ts`, causing inconsistencies and build errors after merges that moved files (like `useAuthStore`). Currently, the app fails to bundle due to missing modules and type mismatches.

## Goals / Non-Goals

**Goals:**

- **Bundling Success**: Restore the ability to build and run the mobile app via Metro.
- **Token Centralization**: Fully transition the mobile app to use `@app/theme` tokens.
- **Type Stability**: Eliminate all 34+ TypeScript errors currently blocking development.

**Non-Goals:**

- **UI Redesign**: This is a maintenance and migration task, not a visual redesign.
- **State Overhaul**: We are fixing imports and types, not changing the underlying state logic.

## Decisions

- **Decision 1: Centralized Mapping in `theme.ts`**
  - **Rationale**: By mapping `@app/theme` tokens to the existing `LatticeTheme` interface in `apps/mobile/src/styles/theme.ts`, we can update the entire app's colors without changing the property access logic in dozens of components.
  - **Alternatives**: Updating every component to use `@app/theme` directly, which would be extremely time-consuming and error-prone.

- **Decision 2: Standardizing on `useLatticeTheme` Hook**
  - **Rationale**: Components should consume the theme through this hook to ensure they automatically respond to system appearance changes (Dark/Light mode).
  - **Alternatives**: Passing theme as props, which adds boilerplate and complexity.

## Risks / Trade-offs

- **Risk: Token Semantic Mismatch** → The new theme tokens might not map 1:1 to the old primitives.
  - **Mitigation**: Perform a careful mapping in `theme.ts` and verify critical screens (Login, Home, Map) after migration.
- **Risk: MMKV API Versioning** → The error in `offlineService.ts` suggests a potential mismatch in expected vs actual MMKV API.
  - **Mitigation**: Update the service to use the correct `delete()` or `remove()` method as per the installed version (`^4.1.2`).
