# Design: Social Auth Data Sync

## Architecture
The fix primarily lives in the `auth-service` backend, specifically in the `auth.controller.ts`.

### JWT Decoding
Since we want to avoid adding new dependencies if possible (or keep it simple), we will implement a utility to decode the JWT payload.
A Google `id_token` payload contains:
- `email`: User's email
- `name`: User's full name
- `picture`: URL to the user's avatar
- `sub`: Google's unique identifier for the user

### Logic Flow (Google Login)
1.  Receive `token` (id_token) and `ticket_code`.
2.  Base64 decode the payload part of the JWT.
3.  Parse JSON to get `email`, `name`, `picture`, and `sub`.
4.  Check `users` table for `googleId = sub`.
5.  If not found, check `users` table for `email = email`.
    - If found, link `googleId = sub` and update `fullName` if missing.
    - If not found, create new user with extracted data.
6.  If `ticket_code` is provided:
    - Update `tickets` table to set `userId`.
    - Update `users` table to set `hasTicket = true`.
7.  Return user object and mock JWT token.

### Logic Flow (Apple Login)
1.  Similar to Google, but extraction depends on how the token is structured (Apple's `identityToken` payload).
2.  Handle `ticket_code` association.

## Database Changes
None required. The `users` table already has `fullName`, `email`, `googleId`, `appleId`, and `avatarUrl`.

## Implementation Details
- Use `Buffer.from(token.split('.')[1], 'base64').toString()` on the server to decode the JWT.
- Ensure the extraction is robust against malformed tokens.
