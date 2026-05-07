# Proposal: Fix Social Auth Data and Ticket Linking

## Problem

Currently, when users register or login via Google or Apple:

1.  **Name**: The full name is hardcoded to "Google User" (for Google) or "Apple User" (for Apple if not provided), instead of extracting it from the social provider's account.
2.  **Email**: The email is mocked using a random string and provider name (e.g., `google_abc123@example.com`), which prevents account linking and doesn't represent the user's real email.
3.  **Tickets**: The `ticket_code` provided during login is received by the backend but never used to associate the ticket with the newly created (or linked) account.

## Proposed Changes

1.  **Server-side (Auth Service)**:
    - Update `googleLogin` controller to decode the `id_token` (JWT) and extract `email`, `fullName`, and `avatarUrl`.
    - Update `appleLogin` controller to handle `ticket_code`.
    - Implement ticket linking logic in both social login flows: if a `ticket_code` is provided, associate that ticket with the user and set `hasTicket: true`.
    - Improve user lookup: first check for existing user by provider ID, then by email to link accounts.

2.  **Mobile-side**:
    - Ensure the `id_token` is correctly passed to the `signInWithGoogle` service (already done, but verified).
    - If needed, pass `fullName` and `email` explicitly if server-side decoding is not implemented with a full library yet.

## Goals

- Users see their real name and profile picture in the profile section after Google login.
- Users' real email addresses are stored in the database.
- Tickets are automatically linked to accounts during social login/registration.

## Non-Goals

- Full JWT signature verification (will remain "simulated" until `google-auth-library` is integrated, but will use real data from the token).
- UI redesign of the profile or login screens.
