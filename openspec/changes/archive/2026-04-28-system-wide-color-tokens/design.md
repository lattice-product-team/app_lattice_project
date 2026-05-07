## Context

The current color definitions are fragmented across the codebase (e.g., `apps/mobile/src/styles/colors.ts`, `apps/admin-web/src/app/globals.css`). There is a shift in brand direction toward "Solar Gold" which needs a professional, unified implementation to support both consumer-facing mobile apps and productivity-focused admin panels.

## Goals / Non-Goals

**Goals:**

- Centralize all color constants in a shared workspace package (`@app/theme`).
- Define a professional "Solar Gold" brand scale.
- Provide a robust neutral hierarchy for high-density UI.
- Establish **Inter** as the primary typeface for a professional look.
- Ensure all tokens are properly typed for TypeScript consumers.

**Non-Goals:**

- Updating existing UI components to use the new tokens (this will be done in subsequent tasks/changes).
- Modifying the build systems of `apps/mobile` or `apps/admin-web`.
- Implementing a full Design System (only colors for now).

## Decisions

### 1. New Shared Package: `@app/theme`

**Rationale:** Creating a dedicated package at `packages/theme` follows the monorepo pattern established by `@app/core` and `@app/types-schema`. It prevents circular dependencies and allows independent versioning of the design language.
**Alternatives Considered:** Adding to `@app/core`. Rejected because `@app/core` is currently focused on backend utilities/middleware.

### 2. Token Format: Nested TypeScript Objects

**Rationale:** Provides the best developer experience with IDE autocomplete and type safety. Can be easily converted to Tailwind configuration or CSS variables if needed.
**Implementation:**

```typescript
export const colors = {
  brand: {
    primary: '#E2B042',
    secondary: '#C59837',
    accent: '#F4C978',
    deep: '#A67C27',
  },
  neutral: {
    light: {
      base: '#FCFCFA',
      surface: '#F4F4F2',
      elevated: '#EBEBE8',
      overlay: '#E1E1DE',
    },
    dark: {
      base: '#0A0A09',
      surface: '#141412',
      elevated: '#1C1C1A',
      overlay: '#262624',
    },
  },
  semantic: {
    light: {
      success: '#16A34A',
      warning: '#D97706',
      error: '#DC2626',
      info: '#2563EB',
    },
    dark: {
      success: '#27C468',
      warning: '#F2A03D',
      error: '#E5484D',
      info: '#54A6FF',
    },
  },
  // ... category scales
};
```

### 3. Typography: The Inter Typeface

**Rationale:** Inter is designed specifically for user interfaces. It provides superior legibility at small sizes and a neutral, professional tone that balances the "premium" feel of Solar Gold.
**Implementation:** The package will export a `typography` object containing font families and a standard scale of sizes.

### 4. Tailwind Integration Strategy

**Rationale:** The tokens should be the "Single Source of Truth". Tailwind configs in `apps/` will eventually import this package to extend their themes.

## Risks / Trade-offs

- **[Risk] Package Linking Issues** → **Mitigation**: Use `pnpm` workspace protocols and verify the link with a simple import test in the Mobile app.
- **[Risk] Hex vs HSL/RGB** → **Mitigation**: Stick to Hex for initial simplicity and alignment with existing code, but structure the object to allow future expansion (e.g., `colors.brand.primary.hex`).

## Color Specification

### Brand (Solar Gold)

- `primary`: #E2B042
- `secondary`: #C59837
- `accent`: #F4C978
- `deep`: #A67C27

### Neutrals (Dual-Theme)

| Token        | Light (Warm)        | Dark (Premium)            |
| :----------- | :------------------ | :------------------------ |
| `base`       | #FCFCFA             | #0A0A09                   |
| `surface`    | #F4F4F2             | #141412                   |
| `elevated`   | #EBEBE8             | #1C1C1A                   |
| `overlay`    | #E1E1DE             | #262624                   |
| `border-low` | rgba(0, 0, 0, 0.05) | rgba(255, 255, 255, 0.05) |
| `border-med` | rgba(0, 0, 0, 0.12) | rgba(255, 255, 255, 0.12) |

### Semantics (Dual-Theme)

| Token     | Light   | Dark    |
| :-------- | :------ | :------ |
| `success` | #16A34A | #27C468 |
| `warning` | #D97706 | #F2A03D |
| `error`   | #DC2626 | #E5484D |
| `info`    | #2563EB | #54A6FF |

### Categories

- `music`: #8E5DCF
- `food`: #D97706
- `tech`: #4F46E5

## Typography Specification

### Font Family

- `sans`: 'Inter', system-ui, -apple-system, sans-serif

### Size Scale (Base 16px)

- `xs`: 0.75rem (12px)
- `sm`: 0.875rem (14px)
- `base`: 1rem (16px)
- `lg`: 1.125rem (18px)
- `xl`: 1.25rem (20px)
- `2xl`: 1.5rem (24px)
- `3xl`: 1.875rem (30px)
- `4xl`: 2.25rem (36px)
