# Coding Standards

To ensure a high level of code quality and maintainability, all contributors MUST follow these standards.

## 1. TypeScript & Type Safety

We use TypeScript in strict mode across the entire stack.

- **No Implicit Any**: Avoid `any` at all costs. Use `unknown` if the type is truly dynamic, or define a proper interface.
- **SSOT (Single Source of Truth)**: Always use types inferred from `@app/types-schema` or `@app/db` to avoid type drift.
- **Zod for Validation**: Use Zod for runtime validation of API requests and environment variables.

## 2. Database (Drizzle ORM)

- **Type Inference**: Use `InferSelectModel` and `InferInsertModel` from `drizzle-orm` for database entities.
- **Migrations**: Never modify the database schema manually. Always use `pnpm run db:generate` and `pnpm run db:migrate`.
- **Geospatial**: Use the custom `geometry` and `polygon` types from `@app/db` for all PostGIS operations.

## 3. React & Mobile Performance

- **Functional Components**: Use `FC` or standard functions. Avoid class components.
- **Memoization**: Use `useMemo` and `useCallback` strategically in the mobile app to prevent redundant re-renders on the Map thread.
- **Hooks Logic**: Extract complex business logic into custom hooks (e.g., `useDiscovery`, `useMapCamera`).

## 4. Styling & UI

We prioritize **Vanilla CSS** (Web) and **StyleSheet** (Mobile) with shared design tokens.

- **Design Tokens**: Always use variables from `@app/theme`. Never hardcode hex values like `#ff382e` (use `var(--color-primary)` or `theme.colors.primary`).
- **Accessibility**: All interactive elements MUST have proper ARIA labels or `accessibilityLabel` (Mobile).

## 5. Clean Code Principles

- **DRY (Don't Repeat Yourself)**: If logic is used in more than one app, move it to `@app/core`.
- **Small Functions**: Functions should do one thing and do it well. Aim for < 20 lines.
- **Meaningful Names**: Use descriptive names for variables and functions (e.g., `isUserAuthenticated` instead of `isAuth`).

## 6. Testing Strategy

- **Unit Tests**: Required for all utility functions in `@app/core`.
- **Integration Tests**: Required for critical API endpoints in `apps/server`.
- **Snapshots**: Avoid large snapshots; prefer testing specific behavior and accessibility markers.
