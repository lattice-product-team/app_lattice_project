# Tasks: Onboarding Implementation and Auth Redesign

## Setup and Routing

- [ ] **Update entry navigation**
  - Modify `app/index.tsx` to include `onboarding` in the initial routing logic.
- [ ] **Create Onboarding screen**
  - Scaffold `app/(auth)/onboarding.tsx`.

## Onboarding UI

- [ ] **Implement Pager component**
  - Build a custom pager/carousel using Reanimated for the informational slides.
- [ ] **Implement Glassmorphism Logo**
  - Create the branded logo container with `expo-blur`.
- [ ] **Add Action Buttons**
  - Implement "Get Started" and "Explore as Guest" buttons with the specified navigation.

## Auth Screens Redesign

- [ ] **Redesign Register screen**
  - Update `app/(auth)/register.tsx` to match the "Mind" style and orange palette.
  - Remove guest mode button.
- [ ] **Redesign Login screen**
  - Update `app/(auth)/login.tsx` for visual consistency with the new registration screen.
- [ ] **Update AuthLayout**
  - Adjust the shared `AuthLayout` component to support the new minimal background style and orange accents.

## Refinement

- [ ] **Add micro-animations**
  - Add entrance animations (FadeInDown) for text elements and buttons.
- [ ] **Polish theme integration**
  - Ensure all colors are pulled from `theme.colors` and not hardcoded.
