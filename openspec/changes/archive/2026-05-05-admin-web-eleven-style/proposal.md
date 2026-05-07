## Why

The current `admin-web` interface, while functional, lacks a cohesive and premium identity. By adopting the "— Style Reference," we aim to transform the dashboard into a type-first, editorial experience that communicates authority through restraint. This "severe yet warm" aesthetic will elevate the platform's professional feel, using a sophisticated "Eggshell" light theme and a signature light-weight serif typography.

## What Changes

- **Achromatic Discipline**: Transition the entire color palette to a near-zero saturation scale (#fdfcfc, #000000, #777169).
- **Typography Overhaul**: Implement the Waldenburg/Inter system, prioritizing a weight-300 serif for headlines and a highly legible sans-serif for body copy.
- **Surface Strategy**: Adopt the "Eggshell-to-White" elevation pattern where cards "hover" on hairline shadows rather than depth layering.
- **Component Redefinition**: Standardize all interactive elements into "Pill" shapes with specific border-radius logic (9999px for buttons, 16px for cards, 0px for inputs).
- **Token Modernization**: Fully migrate to Tailwind v4 `@theme` variables, removing all legacy color and spacing patterns.

## Capabilities

### New Capabilities

- `eleven-design-system`: Definition of the core tokens (Colors, Typography, Spacing, Shapes) based on the architectural blueprint.
- `eleven-ui-components`: Specification for the standardized component library (Pill Buttons, Demo Cards, Voice List Items, and Editorial Inputs).

### Modified Capabilities

- `admin-design-system`: Updating the existing administrative requirements to adhere to the new "Type-First" and "Eggshell" constraints.

## Impact

- **Affected Code**: All `admin-web` pages, components, and `globals.css`.
- **Dependencies**: Potential addition of Google Fonts (Cormorant Garamond/Libre Baskerville) or local assets for Waldenburg substitutes.
- **APIs**: No backend impact; purely visual and architectural refactor of the frontend layer.
