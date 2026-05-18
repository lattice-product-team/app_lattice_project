import { Callout } from 'nextra/components'

# Coding Standards

To maintain excellent code quality, consistency, and long-term maintainability across the monorepo, all contributors MUST strictly follow these engineering standards.

---

## 1. TypeScript & Type Safety

Strict mode (`strict: true`) is enforced across the entire Lattice monorepo.

*   **No Implicit Any**: The use of `any` is strictly prohibited. If a type is truly dynamic, use `unknown` and implement type guards.
*   **SSOT (Single Source of Truth)**: Always reuse types exported from `@app/types-schema` or inferred directly from `@app/db`. Do not manually duplicate types in client applications.
*   **Zod for Validation**: Every external input (API request bodies, query parameters, environment variables) must be parsed and validated using a Zod schema before processing:

```typescript
import { z } from 'zod';

export const CreatePoiSchema = z.object({
  eventId: z.number().int().positive(),
  name: z.string().min(3).max(100),
  type: z.enum(['restaurant', 'wc', 'medical', 'gate']),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type CreatePoiInput = z.infer<typeof CreatePoiSchema>;
```

---

## 2. Database & Drizzle ORM Guidelines

*   **Type Inference**: Leverage Drizzle's built-in models to automatically infer database interfaces rather than declaring duplicate TypeScript models:

```typescript
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { poisTable } from './schema';

export type POI = InferSelectModel<typeof poisTable>;
export type NewPOI = InferInsertModel<typeof poisTable>;
```

*   **Geospatial Standards**: All coordinate updates must utilize the custom `geometry` WGS 84 helper function exported from `@app/db` to format PostGIS parameters.
*   **No Direct SQL Migrations**: Database schemas must never be altered manually in production or development environments. Schema changes must be declared in `@app/db` table files and generated via `pnpm run db:generate`.

---

## 3. React and React Native Guidelines

*   **Functional Components**: Class-based components are deprecated. Always write functional components leveraging modern React Hooks.
*   **Memoization**: The React Native map thread can experience rendering bottlenecks during heavy updates. You must use `useMemo` and `useCallback` strategically to prevent unnecessary re-renders of map layers:

```typescript
// Good: prevents recalculating marker arrays on every render tick
const visibleMarkers = useMemo(() => {
  return pois.filter(poi => poi.status === 'open');
}, [pois]);
```

*   **Decoupled Hook Logic**: Isolate visual layouts from business logic. Keep component files clean by extracting data-fetching, state updates, and map camera actions into custom hooks (e.g., `useDiscoveryFeed`, `useMapCamera`).

---

## 4. UI, Styling & Tokens

*   **Design Tokens**: Never write hardcoded color HEX strings, padding values, or typography scales inside component files. Always import tokens from `@app/theme` or use CSS custom variables:

```typescript
// Good (CSS Modules)
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
}

// Good (React Native StyleSheets)
import { theme } from '@app/theme';

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.medium,
  },
});
```

*   **Accessibility (a11y)**: All interactive elements must support screen readers. Declare appropriate `aria-label` properties in web applications and `accessibilityLabel` properties in mobile components.

---

## 5. Clean Code Principles

*   **DRY (Don't Repeat Yourself)**: If an algorithm or utility function is needed in multiple projects (e.g., coordinate conversions), it must be placed in `@app/core`.
*   **Decoupled Architectures**: Implement the **Service Layer** pattern. Controllers should handle incoming request validation and response serialization, delegating core business operations to domain services (`PoiService`, `EventService`).
*   **Explicit Naming**: Use descriptive names for variables, constants, and methods (e.g., `isUserSessionAuthenticated` instead of `isAuth`).

---

## 6. Testing Strategy

*   **Unit Tests**: Required for helper utilities and state management routines in `@app/core`.
*   **Integration Tests**: Required for critical path handlers in `apps/server` (such as Passkey logins or ticket claiming).
*   **Snapshot Testing**: Keep snapshot tests focused and small; testing specific functional outcomes is preferred over general snapshots.

<Callout type="warning">
  **Code Reviews**: Every contribution must pass all linting, formatting, and unit testing stages before a Pull Request can be merged. Code reviewers will reject any PR that bypasses the type-safety checks or contains hardcoded visual design constants.
</Callout>
