# Proposal: Mobile Onboarding and Auth Redesign

## Problem
The current entry experience of the Lattice mobile app is functional but lacks the "WOW" factor of modern premium applications. The transition for new users is abrupt (straight to login), and the visual identity doesn't fully exploit the brand's aesthetic potential. Additionally, guest access is buried within the login/register screens rather than being a clear alternative path from the start.

## Proposed Changes
1.  **New Onboarding Screen**:
    - Implement a high-fidelity onboarding flow inspired by the "Roi" app.
    - Features a scrollable informational pager explaining the app's value proposition.
    - Prominent Lattice branding with glassmorphism effects.
    - Clear dual-path buttons: "Get Started" for conversion and "Explore as Guest" for immediate utility.

2.  **Auth Flow Redesign**:
    - Update `Register` and `Login` screens to follow the "Mind" app's minimal and elegant style.
    - Adaptation to the Lattice orange color palette (`#E2B042`).
    - Streamlining the registration screen by removing the guest mode alternative (now handled in onboarding).

3.  **App Navigation Entry**:
    - Update the app's root index to direct unauthenticated first-time users to the Onboarding screen instead of Login.

## Goals
- Increase user engagement through a premium first impression.
- Clarify the app's purpose for new users before asking for registration.
- Provide a cleaner, more focused registration experience.

## Non-Goals
- Changing the underlying authentication logic (Google/Apple/Email).
- Modifying the post-login experience (Main map/Profile).
