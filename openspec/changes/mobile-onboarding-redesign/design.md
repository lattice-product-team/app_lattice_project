# Design: Premium Onboarding and Auth UI

## Visual Direction

The design merges two distinct styles:

- **Onboarding (Roi-inspired)**: Rich textures, glassmorphism, and dynamic background elements.
- **Auth (Mind-inspired)**: Clean, high-contrast, minimal UI with subtle color accents.

## Component Specifications

### 1. Onboarding Pager

- **Technology**: `react-native-reanimated` + `react-native-gesture-handler`.
- **Background**: A blurred grid of event category icons (Music, Food, Tech) to represent the "Lattice" (the grid).
- **Logo**: Centered Lattice logo (text or icon) with an `expo-blur` container to achieve the glassmorphism look.
- **Content Slides**:
  - Slide 1: "The social layer of your city."
  - Slide 2: "Find exclusive events and venues."
  - Slide 3: "Connect with your community in real-time."
- **Pagination**: Minimalist dot indicators.

### 2. Redesigned Auth Layout

- **Colors**: Use `theme.colors.brand.primary` (#E2B042) for primary actions and links.
- **Background**: Soft off-white to grey gradient with a subtle orange glow at the bottom.
- **Typography**: `Outfit-Bold` for headlines, `PlusJakartaSans-Medium` for body and small actions.
- **Buttons**:
  - Social buttons (Google/Apple) in capsule style (border only or subtle fill).
  - Primary button (Connect with Email) in solid black or dark grey as per "Mind" style.

## Navigation Flow

1.  `app/index.tsx` checks `token` and `isGuest`.
2.  If both false -> `router.replace('/(auth)/onboarding')`.
3.  Onboarding:
    - `Get Started` -> `router.push('/(auth)/register')`.
    - `Explore as Guest` -> `setGuestMode(true)` & `router.replace('/(main)')`.

## Technical Notes

- Use `expo-linear-gradient` for background glows.
- Use `expo-blur` for the logo backdrop.
- Adapt `PremiumButton` component to support the new minimal style.
