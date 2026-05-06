# Tasks: Fix Social Auth Data and Ticket Linking

## Backend (Auth Service)

- [x] **JWT Decoder Utility**
  - Implement a helper to decode JWT payload without verification.
- [x] **Refactor `googleLogin` Controller**
  - Extract data from `id_token`.
  - Implement account linking (by email).
  - Implement `ticket_code` association.
  - Remove hardcoded "Google User" and mock email.
- [x] **Refactor `appleLogin` Controller**
  - Implement `ticket_code` association.
  - (Optional) Implement extraction from `identityToken` if possible.

## Mobile App

- [x] **Verify `id_token` passing**
  - Ensure `AuthService.signInWithGoogle` correctly sends the `id_token` to the backend. (Done)
- [ ] **Test the flow**
  - Verify that logging in with Google now shows the correct name in the profile.
  - Verify that providing a ticket code during Google login associates the ticket.

## Validation

- [ ] **Manual Test: Google Login**
  - Login with a Google account.
  - Go to Profile screen.
  - Confirm name is correct.
- [ ] **Manual Test: Ticket Association**
  - Login with Google + Ticket Code.
  - Verify ticket appears in "My Tickets".
