## Why

Standardize the Admin Web UI using the premium "Eleven" design language to improve aesthetic quality and professional feel. The current interface lacks consistency with the project's high-end "Solar Gold" and "Eleven" brand guidelines, and the dashboard requires a prioritized visual overhaul to meet operational excellence standards.

## What Changes

- **Core Theme Integration**: Inject Eleven design tokens (Eggshell, Powder, Obsidian, etc.) into the `admin-web` Tailwind configuration.
- **Typography Standard**: Configure **Waldenburg 300** as the primary headline font and ensure proper fallbacks.
- **Dashboard Refactor**: Complete visual redesign of the Admin Dashboard (`/`) based on Eleven patterns (Editorial feel, hairline shadows).
- **Component Scaling**: Create and document new reusable components (Cards, Badges, Tables) that follow the Eleven spec for future use across other admin screens.

## Capabilities

### New Capabilities
- `admin-eleven-theme`: Implementation of the Eleven color palette and typography scale in Tailwind.
- `eleven-dashboard`: Refactored dashboard layout using floating cards, hairline shadows, and Waldenburg headlines.

### Modified Capabilities
- `admin-design-system`: Update the administrative design standards to incorporate Eleven as the primary style guide for web.
- `eleven-ui-components`: Extend the component library with admin-specific patterns identified during the dashboard refactor.

## Impact

- `apps/admin-web`: Major UI refactor of the root dashboard and global styles.
- `packages/theme`: Possible updates to shared tokens if Eleven-specific values are missing.
- `admin-web` Tailwind Configuration: Significant updates to `tailwind.config.ts`.
