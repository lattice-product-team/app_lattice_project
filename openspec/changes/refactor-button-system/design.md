## Context

The mobile application currently uses a `PremiumButton` component which is visually dated (uses gradients) and semantically confusing. The goal is to move to a unified `Button` component that supports multiple variants and follows a modern, flat design system aligned with the brand colors.

## Goals / Non-Goals

**Goals:**

- Replace `PremiumButton` with a new `Button` component.
- Implement 4 variants: `primary`, `subdued`, `tertiary`, `ghost`.
- Ensure each variant has a distinct implementation for Light and Dark modes (8 total states).
- Support optional left/right icons (using Lucide or existing icon set).
- Add haptic feedback and smooth press animations.

**Non-Goals:**

- Creating a separate "Link" component (can be a ghost button variant).
- Redesigning every single custom button in the app (focus on the primary reusable ones).

## Decisions

### 1. Component Interface

The new `Button` will use a standard set of props:

- `label`: string
- `onPress`: () => void
- `variant`: 'primary' | 'subdued' | 'tertiary' | 'ghost'
- `leftIcon` / `rightIcon`: React.ReactNode (for icons like the arrow in the image)
- `disabled`: boolean
- `loading`: boolean
- `style`: ViewStyle (for layout overrides)

### 2. Styling Strategy (8 States: 4 per theme)

- **Primary**:
  - Light: `bg: brand.primary`, `text: text.inverse`
  - Dark: `bg: brand.primary`, `text: text.inverse`
- **Subdued**:
  - Light: `bg: rgba(brand.primary, 0.1)`, `text: brand.primary`
  - Dark: `bg: rgba(brand.primary, 0.2)`, `text: brand.primary`
- **Tertiary**:
  - Light: `bg: #F2F2F7` (system gray 6), `text: text.primary`
  - Dark: `bg: #2C2C2E` (elevation/surface), `text: text.primary`
- **Ghost**:
  - Light: `bg: transparent`, `text: brand.primary`
  - Dark: `bg: transparent`, `text: brand.primary`
- **No Gradients**: All backgrounds will use solid colors or alpha-blended brand colors.

### 3. Animation & Feedback

- Use `Animated.Value` for scale and opacity changes on press.
- Integrate `Haptics.impactAsync` for a premium feel.

### 4. Migration Path

- Create `Button.tsx`.
- Identify all `PremiumButton` usages.
- Replace one by one, mapping `variant="primary"` to the new `primary` style.
- Delete `PremiumButton.tsx` once all references are gone.

## Risks / Trade-offs

- **Risk**: Some parts of the UI might look different if they relied on the gradient for contrast.
- **Mitigation**: Perform a visual audit after the swap and adjust `brand.primary` or surface colors if needed.
- **Risk**: Breaking existing layouts.
- **Mitigation**: Ensure the new `Button` has similar default padding/height as `PremiumButton`.
