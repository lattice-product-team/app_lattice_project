## Why

The admin-web application currently lacks aesthetic consistency between screens. While the "Events" and "POIs" screens follow a high-fidelity "Lattice Precision" style (minimalist, industrial, and editorial), other areas like the Login screen and shared UI components use inconsistent design patterns (e.g., soft blurs, rounded corners, inconsistent typography). This change aims to unify the entire admin-web experience under a single, professional, and technical identity.

## What Changes

- **Login Screen Overhaul**: Replace the soft background blurs with a clean `eggshell` background. Redesign the login card using `backdrop-blur-md` and `shadow-massive`. Standardize labels and inputs to follow the high-contrast, uppercase technical style.
- **Component Standardization**: Update `Input` and `Button` components to strictly adhere to the "Lattice" design tokens. Inputs will favor `rounded-none` and `bg-powder/40`, while buttons will use specific variants for "flotante" vs "industrial" contexts.
- **Layout Alignment**: Ensure all admin pages follow a consistent "Header -> Toolbar -> Canvas" structural pattern.
- **Typography Consistency**: Enforce the use of `waldenburg-display` for headers and `font-black uppercase tracking-widest` for technical labels across the entire application.

## Capabilities

### New Capabilities
- `admin-ui-standardization`: Defines the visual and structural standards for the Lattice Admin interface, including typography, spacing, and component behavior.

### Modified Capabilities
<!-- No functional requirements are changing, only the visual implementation and UI consistency. -->

## Impact

- **Affected Apps**: `apps/admin-web`
- **Affected Components**: `src/app/(auth)/login/page.tsx`, `src/components/ui/input.tsx`, `src/components/ui/button.tsx`, `src/app/(admin)/layout.tsx`.
- **Design Tokens**: Standardized use of `eggshell`, `powder`, `chalk`, and `obsidian` colors across all UI layers.
